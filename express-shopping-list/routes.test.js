process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const items = require("./fakeDb");

afterEach(() => {
  items.length = 0;
});

describe("POST /items", () => {
  test("Create a new item", async () => {
    const res = await request(app).post("/items").send({name:"popsicle",price:1.45});
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({added:{name:"popsicle",price:1.45}});
    expect(items).toEqual([{name:"popsicle",price:1.45}]);
  });

  test("Item names must be unique", async () => {
    await request(app).post("/items").send({name:"popsicle",price:1.45});
    const res = await request(app).post("/items").send({name:"popsicle",price:2.50});
    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual("An item with the name \"popsicle\" already exists.");
    expect(items).toEqual([{name:"popsicle",price:1.45}]);
  });

  test("Unknown properties should cause a rejection", async () => {
    const res = await request(app).post("/items").send({name:"cheerios",price:3.40,"stock":50});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual("Unknown property \"stock\".");
    expect(items).toEqual([]);
  });

  test("Must include \"name\" and \"price\" properties", async () => {
    let res = await request(app).post("/items").send({price:3.40});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual("Missing required property \"name\".");
    expect(items).toEqual([]);

    res = await request(app).post("/items").send({name:"cheerios"});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual("Missing required property \"price\".");
    expect(items).toEqual([]);
  });

  test("Properties must be of a specific type", async () => {
    let res = await request(app).post("/items").send({name:12345,price:3.40});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual("\"name\" is of type number, expecting string.");
    expect(items).toEqual([]);

    res = await request(app).post("/items").send({name:"cheerios",price:"3.40"});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual("\"price\" is of type string, expecting number.");
    expect(items).toEqual([]);
  });
});

describe("GET /items", () => {
  test("Get all items", async () => {
    let res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);

    await request(app).post("/items").send({name:"popsicle",price:1.45});
    res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{name:"popsicle",price:1.45}]);

    await request(app).post("/items").send({name:"cheerios",price:3.40});
    res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{name:"popsicle",price:1.45},{name:"cheerios",price:3.40}]);
  });
});

describe("GET /items/:name", () => {
  test("Get a single item", async () => {
    await request(app).post("/items").send({name:"popsicle",price:1.45});
    const res = await request(app).get("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({name:"popsicle",price:1.45});
  });

  test("Non-existant items should raise an error", async () => {
    const res = await request(app).get("/items/cheerios");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual("Could not find item with the name \"cheerios\".");
  });
});

describe("PATCH /items/:name", () => {
  test("Edit an item", async () => {
    await request(app).post("/items").send({name:"popsicle",price:1.45});
    const res = await request(app).patch("/items/popsicle").send({name:"new popsicle",price:2.45});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updated:{name:"new popsicle",price:2.45}});
    expect(items).toEqual([{name:"new popsicle",price:2.45}]);
  });

  test("Non-existant items should raise an error", async () => {
    const res = await request(app).patch("/items/cheerios").send({name:"honey cheerios",price:4.40});
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual("Could not find item with the name \"cheerios\".");
  });
});

describe("DELETE /items/:name", () => {
  test("Delete an item", async () => {
    await request(app).post("/items").send({name:"popsicle",price:1.45});
    await request(app).post("/items").send({name:"cheerios",price:3.40});
    const res = await request(app).delete("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({message:"Deleted"});
    expect(items).toEqual([{name:"cheerios",price:3.40}]);
  });

  test("Non-existant items should raise an error", async () => {
    const res = await request(app).delete("/items/cheerios");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual("Could not find item with the name \"cheerios\".");
  });
});