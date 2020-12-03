async function searchGiphy(event) {
	event.preventDefault();
	
	let searchQ = document.getElementById("searchQ");
	
	let giphy = await axios.get(`http://api.giphy.com/v1/gifs/search?q=${searchQ.value}&api_key=MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym`);
	console.log(giphy);

	searchQ.value = "";
}

document.getElementById("searchForm").addEventListener("submit", searchGiphy);