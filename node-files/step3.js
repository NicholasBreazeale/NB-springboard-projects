const axios = require("axios").default;
const fs = require("fs");

const argv = process.argv;
// Potential arguments to pass
const args = {
	path: "",
	out: ""
}

// Parse command line arguments
for (let i = 2; i < argv.length; i++) {
	switch (argv[i]) {
		case "--out":
			if (args.out) throw "Out path already defined";
			args.out = argv[++i];
			break;
		default:
			if (args.path) throw "Cat path/URL already defined";
			args.path = argv[i];
	}
}

// Required arguments
if (!args.path) throw "No path/URL specified";

// Execute the program
cat(args.path);

function output(data) {
	if (args.out) {
		fs.writeFile(args.out, data, err => console.log(err));
	}
	else {
		console.log(data);
	}
}

function cat(path) {
	if (/^https?:\/\//.test(path)) {
		webCat(path);
	}
	else {
		let test = fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			output(data)
		});
	}
}

function webCat(url) {
	axios.get(url).then(response => output(response.data));
}