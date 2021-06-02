process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCo;
let testIn;

beforeEach(async () => {
  let result = await db.query("INSERT INTO companies (code, name, description) VALUES ('testco', 'Test Company', 'A company for testing databases') RETURNING *");
  testCo = result.rows[0];
  result = await db.query("INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES ('testco', 250, true, '2021-03-24') RETURNING *");
  testIn = result.rows[0];
});

afterEach(async () => {
  await db.query("DELETE FROM companies");
});

afterAll(async () => {
  await db.end();
});

describe("GET /invoices", () => {
  test("Get a list of all invoices", async () => {
    const response = await request(app).get("/invoices");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoices: [{id: testIn.id, comp_code: testIn.comp_code}]
    });
  });
});

describe("GET /invoices/:id", () => {
  test("Get a single invoice", async () => {
    const response = await request(app).get(`/invoices/${testIn.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoice: {
        id: testIn.id,
        amt: testIn.amt,
        paid: testIn.paid,
        add_date: testIn.add_date.toISOString(),
        paid_date: testIn.paid_date.toISOString(),
        company: testCo
      }
    });
  });

  test("Nonexistent invoices should 404", async() => {
    const response = await request(app).get(`/invoices/${testIn.id + 1}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: `No such invoice: ${testIn.id + 1}`},
      message: `No such invoice: ${testIn.id + 1}`
    });
  });
});

describe("POST /invoices", () => {
  test("Create a new invoice", async () => {
    const response = await request(app).post(`/invoices`).send({comp_code: "testco", amt: 350});
    expect(response.statusCode).toEqual(201);
    const invoice = response.body.invoice;
    const dbQuery = (await db.query(`SELECT * FROM invoices WHERE id=${invoice.id}`)).rows[0];
    dbQuery.add_date = dbQuery.add_date.toISOString();
    expect(dbQuery).toEqual(invoice);
  });

  test("Must include all required parameters", async () => {
    let response = await request(app).post("/invoices").send({comp_code: "noamt"});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: amt"},
      message: "Missing arguments: amt"
    });

    response = await request(app).post("/invoices").send({amt: 150});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: comp_code"},
      message: "Missing arguments: comp_code"
    });

    response = await request(app).post("/invoices").send({});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: comp_code,amt"},
      message: "Missing arguments: comp_code,amt"
    });
  });

  test("A valid comp_code must be used", async () => {
    const response = await request(app).post("/invoices").send({comp_code: "foobar", amt: 150});
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: "No such company: foobar"},
      message: "No such company: foobar"
    });
  });
});

describe("PUT /invoices/:id", () => {
  test("Update an invoice", async () => {
    const response = await request(app).put(`/invoices/${testIn.id}`).send({amt: 450});
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoice: {
        id: testIn.id,
        comp_code: testIn.comp_code,
        amt: 450,
        paid: testIn.paid,
        add_date: testIn.add_date.toISOString(),
        paid_date: testIn.paid_date.toISOString()
      }
    });
    const dbQuery = await db.query(`SELECT * FROM invoices WHERE id=${testIn.id}`);
    expect(dbQuery.rows[0]).toEqual({
      id: testIn.id,
      comp_code: testIn.comp_code,
      amt: 450,
      paid: testIn.paid,
      add_date: testIn.add_date,
      paid_date: testIn.paid_date
    });
  });

  test("Must include required parameters", async () => {
    const response = await request(app).put(`/invoices/${testIn.id}`).send({});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: amt"},
      message: "Missing arguments: amt"
    });
  });

  test("Nonexistent invoices should 404", async () => {
    const response = await request(app).put(`/invoices/${testIn.id + 1}`).send({amt: 50});
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: `No such invoice: ${testIn.id + 1}`},
      message: `No such invoice: ${testIn.id + 1}`
    });
  });
});

describe("DELETE /invoices/:id", () => {
  test("Delete an invoice", async () => {
    const response = await request(app).delete(`/invoices/${testIn.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      status: "deleted"
    });
  });

  test("Nonexistent invoices should 404", async () => {
    const response = await request(app).delete(`/invoices/${testIn.id + 1}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: `No such invoice: ${testIn.id + 1}`},
      message: `No such invoice: ${testIn.id + 1}`
    });
  });

  test("Deleting the company should delete any invoices it has", async () => {
    await request(app).delete(`/companies/${testCo.code}`);
    const dbQuery = await db.query(`SELECT id FROM invoices WHERE id=${testIn.id}`);
    expect(dbQuery.rowCount).toEqual(0);
  });
});