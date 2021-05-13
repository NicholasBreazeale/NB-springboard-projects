/** Database setup for BizTime. */

const { Client } = require("pg");

let db = new Client({
  connectionString: `postgresql://postgres@localhost/${process.env.NODE_ENV === "test" ? "biztime_test" : "biztime"}`
});

db.connect();

module.exports = db;