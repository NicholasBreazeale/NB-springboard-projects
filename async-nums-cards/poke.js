async function getPokeList() {
	return await fetch("https://pokeapi.co/api/v2/pokemon/?limit=0")
		.then(response => response.json())
		.then(data => fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${data.count}`))
		.then(response => response.json());
}

async function getPoke3() {
	const pokeList = await getPokeList();

	const ids = [-1, -1, -1];

	for (let i = 0; i < 3; i++) {
		// Generate a unique random ID
		let randId = 0;
		do {
			randId = Math.floor(Math.random() * pokeList.count);
		} while (ids.includes(randId));
		ids[i] = randId;

		// Get pokemon descriptions
		await fetch(pokeList.results[ids[i]].url)
			.then(response => response.json())
			.then(data => fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}/`))
			.then(response => response.json())
			.then(data => {
				for (const entry of data.flavor_text_entries) {
					if ("language" in entry && entry.language.name === "en") {
						console.log(`${data.name}: ${entry.flavor_text}`);
						break;
					}
				}
			});
	}
}