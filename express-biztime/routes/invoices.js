const express = require("express");
const router = new express.Router();
const db = require ("../db");
const ExpressError = require("../expressError");

router.get("/", async (req, res, next) => {
  return res.json({invoices: (await db.query(`SELECT id, comp_code FROM invoices`)).rows});
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = await db.query(`SELECT id, amt, paid, add_date, paid_date, row_to_json(companies) AS company FROM invoices LEFT JOIN companies ON invoices.comp_code=companies.code WHERE id=$1`, [id]);
    if (results.rowCount === 0) throw new ExpressError(`No such invoice: ${id}`, 404);
    return res.json({invoice: results.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {comp_code, amt} = req.body;

    // Required arguments
    const missingArgs = [];
    if (comp_code === undefined) missingArgs.push("comp_code");
    if (amt === undefined) missingArgs.push("amt");
    if (missingArgs.length !== 0) throw new ExpressError(`Missing arguments: ${missingArgs.join(",")}`, 400);

    const dbQuery = await db.query(`SELECT code FROM companies WHERE code=$1`, [comp_code]);
    if (dbQuery.rowCount === 0) throw new ExpressError(`No such company: ${comp_code}`, 404);
    const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [comp_code, amt]);
    return res.status(201).json({invoice: results.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const {amt} = req.body;

    // Required arguments
    const dbQuery = await db.query(`SELECT id FROM invoices WHERE id=$1`, [id]);
    if (dbQuery.rowCount === 0) throw new ExpressError(`No such invoice: ${id}`, 404);
    if (amt === undefined) throw new ExpressError(`Missing arguments: amt`, 400);

    const results = await db.query(`UPDATE invoices SET amt=$2 WHERE id=$1 RETURNING *`, [id, amt]);
    if (results.rowCount === 0) throw new ExpressError(`No such invoice: ${id}`, 404);
    return res.json({invoice: results.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const request = await db.query(`SELECT id FROM invoices WHERE id=$1`, [id]);
    if (request.rowCount === 0) throw new ExpressError(`No such invoice: ${id}`, 404);
    await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
    return res.json({status: "deleted"});
  }
  catch (err) {
    return next(err);
  }
});

module.exports = router;