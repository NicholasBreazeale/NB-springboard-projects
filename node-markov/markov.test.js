const {MarkovMachine} = require("./markov.js");

describe("markov", () => {
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine("the cat in the hat");
  });

  test("make words", () => {
    expect(mm.words).toEqual(["the", "cat", "in", "the", "hat"]);
  });

  test("make chains", () => {
    expect(mm.chains).toEqual({"the":["cat","hat"],"cat":["in"],"in":["the"],"hat":[null]});
  });

  test("max words", () => {
    for (let i = 0; i < 10; i++) {
      expect(mm.makeText(numWords = 3).split(" ").length).toBeLessThanOrEqual(3);
    }
  });
});