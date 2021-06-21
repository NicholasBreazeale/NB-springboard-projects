const { BadRequestError } = require("../expressError");

/** Generates code to partialy update a row, rather than the whole row
 *
 * dataToUpdate: object that contains the data to be updated.
 *
 * jsToSql: object that maps the keys in dataToUpdate to the SQL column names.
 *   If a key isn't mapped, it will default to the key used in dataToUpdate.
 *
 * Returns an object with two values:
 *   setCols: string to be passed to the SET clause of an UPDATE statement.
 *   values: array to be passed to the parameterized values.
 *
 * Throws BadRequestError if dataToUpdate is empty.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
