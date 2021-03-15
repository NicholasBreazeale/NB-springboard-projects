document.getElementById("messages").addEventListener("click", async function(evt) {
	let target = evt.target.tagName === "I" ? evt.target.parentElement : evt.target;
	let elem = target;
	while (elem.id === "" || elem.id === "messages-form") {
		elem = elem.parentElement;
	}

	if (target.classList.contains("btn-primary")) {
		fetch(`/users/like/${elem.id}`, {method:"DELETE"}).then(resp => {
			if (resp.status === 200) {
				target.classList.remove("btn-primary");
				target.classList.add("btn-secondary");
			}
		})
	}
	else {
		fetch(`/users/like/${elem.id}`, {method: "POST"}).then(resp => {
			if (resp.status === 200) {
				target.classList.remove("btn-secondary");
				target.classList.add("btn-primary");
			}
		})
	}
})