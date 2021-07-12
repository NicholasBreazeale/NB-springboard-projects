"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", () => {
  const newJob = {
    title: "new",
    salary: 40000,
    equity: 0.1,
    companyHandle: "c1",
  };

  test("ok for admin", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job : {
        id: 3,
        title: "new",
        salary: 40000,
        equity: "0.1",
        companyHandle: "c1",
      }
    });
  });

  test("unauth for non-admin", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "new",
          salary: 40000,
          companyHandle: "c1",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "new",
          salary: 40000,
          equity: 0.1,
          companyHandle: "x5",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", () => {
  test("ok for anon", async () => {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
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
              salary: 75000,
              equity: "0",
              companyHandle: "c3",
            },
          ]
    });
  });

  test("ok for title filter", async () => {
    const resp = await request(app).get("/jobs?title=j2");
    expect(resp.body).toEqual({
      jobs:
          [
            {
              id: 2,
              title: "j2",
              salary: 75000,
              equity: "0",
              companyHandle: "c3",
            },
          ]
    });
  });

  test("ok for minSalary filter", async () => {
    const resp = await request(app).get("/jobs?minSalary=60000");
    expect(resp.body).toEqual({
      jobs:
          [
            {
              id: 2,
              title: "j2",
              salary: 75000,
              equity: "0",
              companyHandle: "c3"
            },
          ]
    });
  });

  test("ok for hasEquity filter", async () => {
    const resp = await request(app).get("/jobs?hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
          [
            {
              id: 1,
              title: "j1",
              salary: 50000,
              equity: "0.1",
              companyHandle: "c1",
            },
          ]
    });
  });

  test("bad request if invalid query key", async () => {
    const resp = await request(app).get("/jobs?foo=bar");
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", () => {
  test("works for anon", async () => {
    const resp = await request(app).get(`/jobs/1`);
    expect(resp.body).toEqual({
      job: {
        id: 1,
        title: "j1",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
    });
  });

  test("not found for no such job", async () => {
    const resp = await request(app).get(`/jobs/999`);
    expect(resp.statusCode).toEqual(404);
  })
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", () => {
  test("works for admin", async () => {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1-new",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      job: {
        id: 1,
        title: "J1-new",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
    });
  });

  test("unauth for non-admin", async () => {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1-new",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "J1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async () => {
    const resp = await request(app)
        .patch(`/jobs/999`)
        .send({
          title: "new 999",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on id change attempt", async () => {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          id: 999,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async () => {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          salary: "foo",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", () => {
  test("works for admin", async () => {
    const resp = await request(app)
        .delete(`/jobs/1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: "1" });
  });

  test("unauth for non-admin", async () => {
    const resp = await request(app)
        .delete(`/jobs/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const resp = await request(app)
        .delete(`/jobs/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async () => {
    const resp = await request(app)
        .delete(`/jobs/999`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});