const axios = require("axios").default;
const fs = require("fs");

function cat(path) {
	if (/^https?:\/\//.test(path)) {
		webCat(path);
	}
	else {
		fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			console.log(data);
		})
	}
}

function webCat(url) {
	axios.get(url).then(response => console.log(response.data));
}

if (process.argv.length === 3) cat(process.argv[2]);