/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  return (await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)).data.map(elem => elem.show);
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    const imgSrc = show.image !== null ? show.image.original : "https://tinyurl.com/tv-missing";
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
		   <img class="card-img-top" src="${imgSrc}">
		   <button type="button" class="btn btn-primary">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  return (await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)).data.map(elem => ({id: elem.id, name: elem.name, season: elem.season, number: elem.number}));
}


/** Populate episodes list:
 *     - given list of episodes, add episodes to DOM
 */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $episodesList.append($item);
  }
}


/** Handle episode button click:
 *    - show episodes area
 *    - get list of episodes in a shows and show in episodes list
 */

$("#shows-list").on("click", async function handleEpisodes (evt) {
  if (evt.target.tagName !== "BUTTON") {
    return;
  }

  let query = evt.target.parentElement.getAttribute("data-show-id");

  $("#episodes-area").show();

  let episodes = await getEpisodes(query);

  populateEpisodes(episodes);
});
