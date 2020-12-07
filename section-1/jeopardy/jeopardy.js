// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const NUM_CATEGORIES = 6;
let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	return (await axios.get(`http://jservice.io/api/random?count=${NUM_CATEGORIES*5-4}`)).data.reduce(function(accumulator, value) {
		let catId = value.category.id;
		if (accumulator.length < NUM_CATEGORIES && !accumulator.includes(catId)) {
			accumulator.push(catId);
		}
		return accumulator;
	}, []);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	let jData = (await axios.get(`http://jservice.io/api/category?id=${catId}`)).data;
	return {title: jData.title, clues: jData.clues.map(value => ({question: value.question, answer: value.answer, showing: null}))};
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
	let gameBoard = document.getElementById("gameBoard");
	for (let i = 0; i < NUM_CATEGORIES; i++) {
		gameBoard.children[0].children[0].children[i].innerText = categories[i].title;
		for (let j = 0; j < 5; j++) {
			gameBoard.children[1].children[j].children[i].innerText = "???";
		}
	}
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	const [x, y] = evt.target.id.split("-").map(val => Number(val));
	const clue = categories[x].clues[y];
	switch (clue.showing) {
		case null:
			clue.showing = "question";
			evt.target.innerText = clue.question;
			break;
		case "question":
			clue.showing = "answer";
			evt.target.innerHTML = clue.answer;
			evt.target.className = "answered";
			break;
	}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
	document.getElementById("loadingView").style.display = "block";
	document.getElementById("gameBoard").removeAttribute("style");
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
	document.getElementById("loadingView").removeAttribute("style");
	document.getElementById("gameBoard").style.display = "table";
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	categories = [];
	for (const catId of (await getCategoryIds())) {
		categories.push(await getCategory(catId));
	}
	fillTable();
}

/** On click of start / restart button, set up game. */

document.getElementById("reStartBtn").addEventListener("click", async () => {
	showLoadingView();
	await setupAndStart();
	hideLoadingView();
	document.getElementById("reStartBtn").value = "Restart!";
});

/** On page load, add event handler for clicking clues */

document.getElementById("gameBoard").children[1].addEventListener("click", handleClick);