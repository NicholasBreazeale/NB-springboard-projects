const express = require("express");
const router = new express.Router();
const db = require ("../db");
const ExpressError = require("../expressError");

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT code, name FROM companies`);
    return res.json({companies: results.rows});
  }
  catch (err) {
    return next(err);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
    if (company.rowCount === 0) throw new ExpressError(`No such company: ${code}`, 404);
    const invoices = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [code]);
    company.rows[0].invoices = invoices.rows;
    return res.json({company: company.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {code, name, description} = req.body;
    const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
    return res.status(201).json({company: results.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.put("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const {name, description} = req.body;

    const results = await db.query(`UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code, name, descrioption`, [code, name, description]);
    if (results.rowCount === 0) throw new ExpressError(`No such company: ${code}`, 404);
    return res.json({company: results.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;

    await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
    if (results.rowCount === 0) throw new ExpressError(`No such company: ${code}`, 404);
    return res.json({status: "deleted"});
  }
  catch (err) {
    return next(err);
  }
});

module.exports = router;