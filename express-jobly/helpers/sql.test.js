const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("works: all keys mapped", function() {
    const data = {firstName: 'Aliya', age: 32};
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        age: "age"
      });
    expect(setCols).toEqual('"first_name"=$1, "age"=$2');
    expect(values).toEqual(['Aliya', 32]);
  });

  test("works: partial keys mapped", function() {
    const data = {firstName: 'Aliya', age: 32};
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name"
      });
    expect(setCols).toEqual('"first_name"=$1, "age"=$2');
    expect(values).toEqual(['Aliya', 32]);
  });

  test("bad request if no data", function() {
    expect.assertions(1);
    try {
      sqlForPartialUpdate({},{});
      fail();
    } catch (err) {
      expect (err instanceof BadRequestError).toBeTruthy();
    }
  });
});
