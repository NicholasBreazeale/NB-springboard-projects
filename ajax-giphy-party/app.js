document.getElementById("searchForm").addEventListener("submit", async event => {
	event.preventDefault();

	let searchQ = document.getElementById("searchQ");

	// Fetch a random image from Giphy
	let giphy = await axios.get(`http://api.giphy.com/v1/gifs/random?tag=${searchQ.value}&api_key=MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym`);

	// Append image to document
	let img = document.createElement("img");
	img.setAttribute("src", `https://i.giphy.com/media/${giphy.data.data.id}/giphy.webp`);
	document.getElementById("giphs").appendChild(img);

	// Clear form
	searchQ.value = "";
});

document.getElementById("removeBtn").addEventListener("click", () => {
	document.getElementById("giphs").innerHTML = "";
});