"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const jsonschema = require("jsonschema");
const jobNewSchema = require("../schemas/jobNew.json");
const jobSearchSchema = require("../schemas/jobSearch.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if incoming data is invalid or the job is already in the database.
   * */

  static async create(data) {
    // Validate incoming data
    const validator = jsonschema.validate(data, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { title, salary, equity, companyHandle } = data;

    const duplicateCheck = await db.query(
          `SELECT id
           FROM jobs
           WHERE title = $1 AND company_handle = $2`,
        [title, companyHandle]);
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title} at ${companyHandle}`);

    const company = await db.query(
          `SELECT handle
           FROM companies
           WHERE handle = $1`,
        [companyHandle]);
    if (!company.rows[0])
      throw new BadRequestError(`No company: ${companyHandle}`);

    // Add data to database
    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle,
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   * 
   * Optionally filter by title, minimum salary, equity, or any combination thereof.
   *
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
   * */

  static async findAll(query) {
    // Validate query string
    const validator = jsonschema.validate(query, jobSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { title, minSalary, hasEquity } = query;

    // Generate where conditions and paramaterized values
    const whereConditions = [];
    const values = [];
    if (title) {
      whereConditions.push(`LOWER(title) LIKE $${whereConditions.length + 1}`);
      values.push(`%${title.toLowerCase()}%`);
    }
    if (minSalary) {
      whereConditions.push(`salary >= $${whereConditions.length + 1}`);
      values.push(minSalary);
    }
    if (hasEquity) {
      whereConditions.push(`equity <> 0`);
    }

    const jobsRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           ${whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}
          ` : ""}ORDER BY title`,
        values);
    return jobsRes.rows;
  }

  /** Given a job id, return data about job.
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobsRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [id]);

    const job = jobsRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    // Validate data
    const validator = jsonschema.validate(data, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyHandle: "company_handle",
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No company: ${id}`);
  }
}


module.exports = Job;
