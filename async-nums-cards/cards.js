const g = {};

async function getCard() {
	return await fetch(`https://deckofcardsapi.com/api/deck/${"deck_id" in g ? g["deck_id"] : "new"}/draw/?count=1`)
		.then(response => response.json())
		.then(data => {
			if (!("deck_id" in g)) {
				g.deck_id = data.deck_id;
			}
			return data;
		});
}

document.getElementById("card-btn").addEventListener("click", async () => {
	const cardInfo = await getCard();
	const displayElem = document.getElementById("card-display");
	if (cardInfo.remaining === 0) {
		document.getElementById("card-btn").style.display = "none";
	}
	displayElem.innerHTML += `<img src="${cardInfo.cards[0].image}" style="transform:translate(-${Math.floor(Math.random()*10)+45}%, ${Math.floor(Math.random()*20)}px) rotate(${Math.floor(Math.random()*60)-30}deg)"/>`
})