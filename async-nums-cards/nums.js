async function getNum(num) {
	return await fetch(`http://numbersapi.com/${num}`)
		.then(response => response.text());
}

async function getNums(nums) {
	return await fetch(`http://numbersapi.com/${nums.join()}`)
		.then(response => response.json());
}

async function getNum4Fact(num) {
	const facts = ["", "", "", ""];
	for (let i = 0; i < facts.length; i++) {
		facts[i] = await getNum(num);
	}
	return facts;
}