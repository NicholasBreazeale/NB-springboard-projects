const fs = require("fs");

function cat(path) {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) throw err;
		console.log(data);
	})
}

if (process.argv.length === 3) cat(process.argv[2]);