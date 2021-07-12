"use strict";

/** Routes for jobs. */

const express = require("express");

const { ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const router = new express.Router();


/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  }
  catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on provided search filters:
 * - title (will find case-insensitive, partial matches)
 * - minSalary
 * - hasEquity
 *
 * Authorization required: none
 */

router.get("/", async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  }
  catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { company }
 *
 * Job is { id, title, salary, equity, companyHandle }
 *
 * Authorization required: none
 */

router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  }
  catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async (req, res, next) => {
  try {
    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  }
  catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async (req, res, next) => {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  }
  catch (err) {
    return next(err);
  }
});

module.exports = router;