/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = this.words.reduce((acc, val, idx, arr) => {
      // If the next value is out of range, use null instead
      const next = (idx+1 === arr.length ? null : arr[idx+1]);
      // Add property if it doesn't exist
      if (!(val in acc)) {
        acc[val] = [next];
      }
      // Add word to property if it doesn't have it
      else if (!(next in acc[val])) {
        acc[val].push(next);
      }
      return acc;
    }, {});
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    let text = "";
    let word = this.words[Math.floor(Math.random() * this.words.length)];
    for (let count = 0; count < numWords && word !== null; count++) {
      if (text !== "") {
        text += " ";
      }
      text += word;
      word = this.chains[word][Math.floor(Math.random() * this.chains[word].length)];
    }
    return text;
  }
}

module.exports = {MarkovMachine};