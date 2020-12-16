$(async function() {
  // cache some selectors we'll be using quite a bit
  const $allStoriesList = $("#all-articles-list");
  const $submitForm = $("#submit-form");
  const $favoritedArticles = $("#favorited-articles");
  const $filteredArticles = $("#filtered-articles");
  const $loginForm = $("#login-form");
  const $createAccountForm = $("#create-account-form");
  const $ownStories = $("#my-articles");
  const $navLogin = $("#nav-login");
  const $navLogOut = $("#nav-logout");

  // global storyList variable
  let storyList = null;

  // global currentUser variable
  let currentUser = null;

  await checkIfLoggedIn();

  /**
   * Event listener for logging in.
   *  If successfully we will setup the user instance
   */

  $loginForm.on("submit", async function(evt) {
    evt.preventDefault(); // no page-refresh on submit

    // grab the username and password
    const username = $("#login-username").val();
    const password = $("#login-password").val();

    // call the login static method to build a user instance
    const userInstance = await User.login(username, password);
    // set the global user to the user instance
    currentUser = userInstance;
    syncCurrentUserToLocalStorage();
    loginAndSubmitForm();
  });

  /**
   * Event listener for signing up.
   *  If successfully we will setup a new user instance
   */

  $createAccountForm.on("submit", async function(evt) {
    evt.preventDefault(); // no page refresh

    // grab the required fields
    let name = $("#create-account-name").val();
    let username = $("#create-account-username").val();
    let password = $("#create-account-password").val();

    // call the create method, which calls the API and then builds a new user instance
    const newUser = await User.create(username, password, name);
    currentUser = newUser;
    syncCurrentUserToLocalStorage();
    loginAndSubmitForm();
  });

  /**
   * Event listener for adding new stories
   *  If successfully we will prepend the new story to the DOM
   */

  $submitForm.on("submit", async function(evt) {
    evt.preventDefault();

    // grab the required fields
    const story = {
      author: $("#author").val(),
      title: $("#title").val(),
      url: $("#url").val()
    };

    // submit the story to the API and display the result
    const newStory = await storyList.addStory(currentUser, story);
    const storyMarkup = generateStoryHTML(newStory);
    storyMarkup.prepend($('<button class="star">★</button><button class="trash-can">🗑</button>'));
    $allStoriesList.prepend(storyMarkup);

    // clear inputs once the new story is displayed
    $("#author").val("");
    $("#title").val("");
    $("#url").val("");
  });

  /**
   * Log Out Functionality
   */

  $navLogOut.on("click", function() {
    // empty out local storage
    localStorage.clear();
    // refresh the page, clearing memory
    location.reload();
  });

  /**
   * Event Handler for Clicking Login
   */

  $navLogin.on("click", function() {
    // Show the Login and Create Account Forms
    $loginForm.slideToggle();
    $createAccountForm.slideToggle();
    $allStoriesList.toggle();
  });

  /**
   * Event handler for Navigation to Homepage
   */

  $("body").on("click", "#nav-all", async function() {
    hideElements();
    await generateStories();
    $allStoriesList.show();
  });

  /**
   * Favorite a story by clicking the star button to its right
   */

  $allStoriesList.on("click", ".star", async function(evt) {
    // submit the ID to the favorites list
    await currentUser.favoriteStory(evt.target.parentElement.id);

    generateFavoriteStories();
  });

  /**
   * Unfavorite a story by clicking the x button to its right
   */

  $favoritedArticles.on("click", ".xmark", async function(evt) {
    // submit the ID to the favorites list
    await currentUser.unfavoriteStory(evt.target.parentElement.id);

    generateFavoriteStories();
  });

  $allStoriesList.on("click", ".trash-can", async function(evt) {
    currentUser.deleteStory(evt.target.parentElement.id);

    evt.target.parentElement.remove();
  });

  /**
   * Render the favorited stories
   */

  function generateFavoriteStories() {
    // empty out the favorited list
    $favoritedArticles.empty();

    // only display the section if the current user has favorited articles
    if (currentUser.favorites.length === 0) {
      $favoritedArticles.hide();
      return;
    } else {
      $favoritedArticles.show();
    }

    // populate the list
    for (let story of currentUser.favorites) {
      const result = generateStoryHTML(story);
      result.prepend($('<button class="xmark">🗙</button>'));
      $favoritedArticles.append(result);
    }
  }

  /**
   * On page load, checks local storage to see if the user is already logged in.
   * Renders page information accordingly.
   */

  async function checkIfLoggedIn() {
    // let's see if we're logged in
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // if there is a token in localStorage, call User.getLoggedInUser
    //  to get an instance of User with the right details
    //  this is designed to run once, on page load
    currentUser = await User.getLoggedInUser(token, username);
    await generateStories();

    if (currentUser) {
      generateFavoriteStories();
      $submitForm.show();
      showNavForLoggedInUser();
      showProfleInfo();
    }
  }

  /**
   * A rendering function to run to reset the forms and hide the login info
   */

  function loginAndSubmitForm() {
    // hide the forms for logging in and signing up
    $loginForm.hide();
    $createAccountForm.hide();

    // reset those forms
    $loginForm.trigger("reset");
    $createAccountForm.trigger("reset");

    // show the user's account info
    showProfleInfo();

    // show the stories
    $allStoriesList.show();

    // show the submit form
    $submitForm.show();

    // show favorited stories if the user has any
    generateFavoriteStories();

    // update the navigation bar
    showNavForLoggedInUser();
  }

  /**
   * A rendering function to call the StoryList.getStories static method,
   *  which will generate a storyListInstance. Then render it.
   */

  async function generateStories() {
    // get an instance of StoryList
    const storyListInstance = await StoryList.getStories();
    // update our global variable
    storyList = storyListInstance;
    // empty out that part of the page
    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
      const result = generateStoryHTML(story);
      if (currentUser !== null) {
        if (currentUser.ownsStory(result[0].id)) {
          result.prepend($('<button class="trash-can">🗑</button>'));
        }
        result.prepend($('<button class="star">★</button>'));
      }
      $allStoriesList.append(result);
    }
  }

  /**
   * A function to render HTML for an individual Story instance
   */

  function generateStoryHTML(story) {
    let hostName = getHostName(story.url);

    // render story markup
    const storyMarkup = $(`
      <li id="${story.storyId}">
        <a class="article-link" href="${story.url}" target="a_blank">
          <strong>${story.title}</strong>
        </a>
        <small class="article-author">by ${story.author}</small>
        <small class="article-hostname ${hostName}">(${hostName})</small>
        <small class="article-username">posted by ${story.username}</small>
      </li>
    `);

    return storyMarkup;
  }

  /* display user info at the bottom of the page */

  function showProfleInfo() {
    $("#profile-name").append(" " + currentUser.name);
    $("#profile-username").append(" " + currentUser.username);
    $("#profile-account-date").append(" " + currentUser.createdAt);
  }

  /* hide all elements in elementsArr */

  function hideElements() {
    const elementsArr = [
      $submitForm,
      $allStoriesList,
      $filteredArticles,
      $ownStories,
      $loginForm,
      $createAccountForm
    ];
    elementsArr.forEach($elem => $elem.hide());
  }

  function showNavForLoggedInUser() {
    $navLogin.hide();
    $navLogOut.show();
  }

  /* simple function to pull the hostname from a URL */

  function getHostName(url) {
    let hostName;
    if (url.indexOf("://") > -1) {
      hostName = url.split("/")[2];
    } else {
      hostName = url.split("/")[0];
    }
    if (hostName.slice(0, 4) === "www.") {
      hostName = hostName.slice(4);
    }
    return hostName;
  }

  /* sync current user information to localStorage */

  function syncCurrentUserToLocalStorage() {
    if (currentUser) {
      localStorage.setItem("token", currentUser.loginToken);
      localStorage.setItem("username", currentUser.username);
    }
  }
});
