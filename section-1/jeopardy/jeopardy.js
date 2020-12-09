// Implement the Fisher-Yates shuffle algorithm for arrays
Object.defineProperty(Array.prototype, "shuffle", {
	value: function() {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		return this;
	}
});

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
	const catIds = [];
	do {
		const jServiceRandom = await axios.get(`http://jservice.io/api/random?count=${NUM_CATEGORIES-catIds.length}`);

		// Throw an error if the status code is anything other than 200
		if (jServiceRandom.status !== 200) {
			throw `jService error: ${jServiceRandom.status} - ${jServiceRandom.statusText}`;
		}

		// Parse random clue data and extract their category IDs
		for (const clue of jServiceRandom.data) {
			// Only add unique IDs to array
			if (!catIds.includes(clue.category_id)) {
				catIds.push(clue.category_id);
			}
		}
	} while (catIds.length < NUM_CATEGORIES);
	return catIds;
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
	const jServiceCategory = await axios.get(`http://jservice.io/api/category?id=${catId}`);

	// Throw an error if the status code is anything other than 200
	if (jServiceCategory.status !== 200) {
		throw `jService error: ${jServiceRandom.status} - ${jServiceRandom.statusText}`;
	}

	// Randomize clue order
	jServiceCategory.data.clues.shuffle();
	// Extract the category title
	const category = {title: jServiceCategory.data.title, clues: []};
	// Extract and format the first 5 clues from jServiceCategory
	for (let i = 0; i < 5; i++) {
		const clue = jServiceCategory.data.clues[i];
		category.clues.push({question: clue.question, answer: clue.answer, showing: null});
	}
	return category;
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
	gameBoard.innerHTML = "";

	// Fill table head
	const thead = document.createElement("thead");
	const theadRow = document.createElement("tr");
	for (const category of categories) {
		const th = document.createElement("th");
		th.innerText = category.title;
		theadRow.appendChild(th);
	}
	thead.appendChild(theadRow);

	// Fill table body
	const tbody = document.createElement("tbody");
	for (let i = 0; i < 5; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < NUM_CATEGORIES; j++) {
			const cell = document.createElement("td");
			cell.id = `${j}-${i}`;
			cell.innerHTML = "?";
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}

	// Append table contents
	gameBoard.appendChild(thead);
	gameBoard.appendChild(tbody);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	if (evt.target.tagName !== "TD") {
		return;
	}

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
	try {
		await setupAndStart();
	} catch (error) {
		alert(error);
		return;
	}
	hideLoadingView();
	document.getElementById("reStartBtn").value = "Restart!";
});

/** On page load, add event handler for clicking clues */

document.getElementById("gameBoard").addEventListener("click", handleClick);