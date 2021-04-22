/** Command-line tool to generate Markov text. */

const axios = require("axios");
const fs = require("fs");
const {MarkovMachine} = require("./markov.js");

const argv = process.argv;
if (argv.length !== 4) {
  console.error("Incorrect argument syntax, must be: node makeText.js <text/url> <path>");
  process.exit(1);
}

switch(argv[2]) {
  case "file":
    fs.readFile(argv[3], "utf8", (err, data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      const mm = new MarkovMachine(data);
      console.log(mm.makeText());
    });
    break;
  case "url":
    axios.get(argv[3])
      .then(response => {
        const mm = new MarkovMachine(response.data);
        console.log(mm.makeText());
      })
      .catch(err => console.error(err));
    break;
  default:
    console.error("3rd argument must either be \"text\" or \"url\".")
}