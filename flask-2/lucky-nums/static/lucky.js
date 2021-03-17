/** processForm: get data from form and make AJAX call to our API. */

function processForm(evt) {
	evt.preventDefault();
	fetch("/api/get-lucky-num", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: `name=${document.getElementById("name").value}&email=${document.getElementById("email").value}&year=${document.getElementById("year").value}&color=${document.getElementById("color").value}`
	}).then(resp => resp.json().then(data => handleResponse(data)))
}

/** handleResponse: deal with response from our lucky-num API. */

function handleResponse(resp) {
	const luckyResultsElem = document.getElementById("lucky-results");
	luckyResultsElem.innerHTML = "";

	if (resp.errors !== undefined) {
		let errorStr = "";
		for (const err in resp.errors) {
			if (errorStr !== "") {
				errorStr += "<br>";
			}
			errorStr += err;
			for (const e of resp.errors[err]) {
				errorStr += `<br>&emsp;${e}`
			}
		}
		luckyResultsElem.innerHTML = errorStr;
	} else {
		luckyResultsElem.innerText = `Your lucky number is ${resp.num.num} (${resp.num.fact}).\nYour birth year (${resp.year.year}) fact is: ${resp.year.fact}.`;
	}
}


$("#lucky-form").on("submit", processForm);
