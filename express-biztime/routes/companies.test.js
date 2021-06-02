process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCo;

beforeEach(async () => {
  let result = await db.query("INSERT INTO companies (code, name, description) VALUES ('testco', 'Test Company', 'A company for testing databases')");
  testCo = result.rows[0];
});

afterEach(async () => {
  await db.query("DELETE FROM companies");
});

afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("Get a list of all companies", async () => {
    const response = await request(app).get("/companies");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      companies: [{code: "testco", name: "Test Company"}]
    });
  });
});

describe("GET /companies/:code", () => {
  test("Get a single company's data", async () => {
    const response = await request(app).get("/companies/testco");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      company: {code: "testco", name: "Test Company", description: "A company for testing databases", invoices: []}
    });
  });

  test("Nonexistent companies should 404", async() => {
    const response = await request(app).get("/companies/foobar");
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: "No such company: foobar"},
      message: "No such company: foobar"
    })
  })
});

describe("POST /companies", () => {
  test("Create a new company", async () => {
    const response = await request(app).post("/companies").send({code: "rival", name: "Rival Corp", description: "They are cutting into our earnings"});
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      company: {code: "rival", name: "Rival Corp", description: "They are cutting into our earnings"}
    });
    const dbQuery = await db.query("SELECT * FROM companies WHERE code='rival'");
    expect(dbQuery.rowCount).toEqual(1);
    expect(dbQuery.rows[0]).toEqual({
      code: "rival",
      name: "Rival Corp",
      description: "They are cutting into our earnings"
    });
  });

  test("Must include all required parameters", async () => {
    let response = await request(app).post("/companies").send({code: "noname", description: "A company with no name"});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: name"},
      message: "Missing arguments: name"
    });

    response = await request(app).post("/companies").send({name: "No Code", description: "A company with no code"});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: code"},
      message: "Missing arguments: code"
    });

    response = await request(app).post("/companies").send({description: "A company with no code or name"});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: code,name"},
      message: "Missing arguments: code,name"
    });
  });

  test("Companies cannot have duplicate codes or names", async () => {
    let response = await request(app).post("/companies").send({code: "testco", name: "Duplicate Code", description: "Another company with the same code"});
    expect(response.statusCode).toEqual(500);

    response = await request(app).post("/companies").send({code: "dupename", name: "Test Company", description: "Another company with the same name"});
    expect(response.statusCode).toEqual(500);
  });
});

describe("PUT /companies/:code", () => {
  test("Update a company's data", async () => {
    const response = await request(app).put("/companies/testco").send({name: "Updated Name", description: "A new description for the same company"});
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      company: {code: "testco", name: "Updated Name", description: "A new description for the same company"}
    });
    const dbQuery = await db.query("SELECT * FROM companies WHERE code='testco'");
    expect(dbQuery.rows[0]).toEqual({
      code: "testco",
      name: "Updated Name",
      description: "A new description for the same company"
    });
  });

  test("Must include required parameters", async () => {
    const response = await request(app).put("/companies/testco").send({description: "No name provided"});
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: {status: 400, message: "Missing arguments: name"},
      message: "Missing arguments: name"
    });
  });

  test("Nonexistent companies should 404", async () => {
    const response = await request(app).put("/companies/foobar").send({name: "No Company", description: "This company does not exist."});
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: "No such company: foobar"},
      message: "No such company: foobar"
    });
  });
});

describe("DELETE /companies/:code", () => {
  test("Delete a company's data", async () => {
    const response = await request(app).delete("/companies/testco");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      status: "deleted"
    });
  });

  test("Nonexistent companies should 404", async () => {
    const response = await request(app).delete("/companies/foobar");
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: {status: 404, message: "No such company: foobar"},
      message: "No such company: foobar"
    });
  });
});