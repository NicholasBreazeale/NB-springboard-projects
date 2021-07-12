"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "New",
    salary: 40000,
    equity: 0.1,
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: 4,
      title: "New",
      salary: 40000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = $1`,
          [job.id]);
    expect(result.rows).toEqual([
      {
        id: 4,
        title: "New",
        salary: 40000,
        equity: "0.1",
        company_handle: "c1",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll({});
    expect(jobs).toEqual([
      {
        id: 1,
        title: "j1",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: 2,
        title: "j2",
        salary: 100000,
        equity: "0.15",
        companyHandle: "c2",
      },
      {
        id: 3,
        title: "j3",
        salary: 75000,
        equity: "0",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: title filter", async function () {
    let jobs = await Job.findAll({title: "j2"});
    expect(jobs).toEqual([
      {
        id: 2,
        title: "j2",
        salary: 100000,
        equity: "0.15",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: minSalary filter", async function () {
    let jobs = await Job.findAll({minSalary: "60000"});
    expect(jobs).toEqual([
      {
        id: 2,
        title: "j2",
        salary: 100000,
        equity: "0.15",
        companyHandle: "c2",
      },
      {
        id: 3,
        title: "j3",
        salary: 75000,
        equity: "0",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: hasEquity filter", async function () {
    let jobs = await Job.findAll({hasEquity: "true"});
    expect(jobs).toEqual([
      {
        id: 1,
        title: "j1",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: 2,
        title: "j2",
        salary: 100000,
        equity: "0.15",
        companyHandle: "c2",
      },
    ]);
  });

  test("bad request if invalid query key", async function () {
    try {
      await Job.findAll({foo: "bar"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
        title: "j1",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Job.get(1000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 55000,
    equity: 0.12,
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      title: "New",
      salary: 55000,
      equity: "0.12",
      companyHandle: "c1",
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      id: 1,
      title: "New",
      salary: 55000,
      equity: "0.12",
      company_handle: "c1",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New",
      salary: null,
      equity: null,
    };

    let job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      id: 1,
      ...updateDataSetNulls,
      companyHandle: "c1",
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      id: 1,
      title: "New",
      salary: null,
      equity: null,
      company_handle: "c1",
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(1000, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(1000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
