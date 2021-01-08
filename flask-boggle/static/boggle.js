var interval = null;
boggleGame = {
	score: 0,
	high: 0,
	time: 60
};

(async () => {
	// Get high score from server
	boggleGame.high = (await axios.get("/score")).data.high;
	// Populate game fields
	for (const [key, value] of Object.entries(boggleGame)) {
		document.getElementById(key).innerText = value.toString();
	}

	// Countdown timer for game
	interval = setInterval(async () => {
		boggleGame.time -= 1;
		document.getElementById("time").innerText = boggleGame.time.toString();
		// Time is up
		if (boggleGame.time <= 0) {
			window.clearInterval(interval);
			// Disable submissions
			document.getElementById("guess").disabled = true;
			document.getElementById("submit").disabled = true;
			// Submit score to server
			const request = await axios.post("/score", {s: boggleGame.score});
			document.getElementById("high").innerText = request.data.high;
		}
	}, 1000);
})()

document.getElementById("guessForm").addEventListener("submit", async event => {
	event.preventDefault();

	const guessInput = document.getElementById("guess");
	const word = guessInput.value;

	// Handle server response
	switch ((await axios.get(`/search?w=${word}`)).data.request) {
		case "ok":
			document.getElementById("result").innerText = "";
			const scoreElem = document.getElementById("score");
			boggleGame.score += word.length
			scoreElem.innerText = boggleGame.score.toString();
			break;

		case "not-on-board":
			document.getElementById("result").innerText = `"${word}" is not on the board.`
			break;

		case "not-a-word":
			document.getElementById("result").innerText = `"${word}" is not a word.`
			break;
	}

	// Clear input
	guessInput.value = "";
});