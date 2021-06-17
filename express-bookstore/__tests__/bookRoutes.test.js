process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM books");

    let b1 = await Book.create({
      isbn: "9780198117476",
      amazon_url: "https://www.amazon.com/William-Shakespeare-Complete-Works-Oxford/dp/0198117477",
      author: "William Shakespeare",
      language: "english",
      pages: 1348,
      publisher: "Oxford University Press",
      title: "William Shakespeare: The Complete Works",
      year: 1988
    });
  });

  describe("GET /books", () => {
    test("get all books", async () => {
      let response = await request(app).get("/books");

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        books: [
          {
            isbn: "9780198117476",
            amazon_url: "https://www.amazon.com/William-Shakespeare-Complete-Works-Oxford/dp/0198117477",
            author: "William Shakespeare",
            language: "english",
            pages: 1348,
            publisher: "Oxford University Press",
            title: "William Shakespeare: The Complete Works",
            year: 1988
          }
        ]
      });
    });
  });

  describe("GET /books/:id", () => {
    test("get one book", async () => {
      let response = await request(app).get("/books/9780198117476");

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        book: {
          isbn: "9780198117476",
          amazon_url: "https://www.amazon.com/William-Shakespeare-Complete-Works-Oxford/dp/0198117477",
          author: "William Shakespeare",
          language: "english",
          pages: 1348,
          publisher: "Oxford University Press",
          title: "William Shakespeare: The Complete Works",
          year: 1988
        }
      });
    });

    test("get with invalid id", async () => {
      let response = await request(app).get("/books/1234567890");

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn '1234567890",
          status: 404
        },
        message: "There is no book with an isbn '1234567890"
      });
    });
  });

  describe("POST /books", () => {
    test("create a book", async () => {
      let response = await request(app)
        .post("/books")
        .send({
          isbn: "‎9780785834205",
          amazon_url: "https://www.amazon.com/Complete-Fiction-H-P-Lovecraft/dp/0785834206/ref=pd_sbs_2/135-2705773-8459049?pd_rd_w=JEnSS&pf_rd_p=a5925d26-9630-40f3-a011-d858608ac88b&pf_rd_r=X5804P344MJAHYNR5CQ4&pd_rd_r=ab153d0f-d648-4cfc-ace5-832afda903a7&pd_rd_wg=gxg4w&pd_rd_i=0785834206&psc=1",
          author: "H. P. Lovecraft",
          language: "english",
          pages: 1112,
          publisher: "Chartwell Books",
          title: "The Complete Fiction of H. P. Lovecraft",
          year: 2016
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        book: {
          isbn: "‎9780785834205",
          amazon_url: "https://www.amazon.com/Complete-Fiction-H-P-Lovecraft/dp/0785834206/ref=pd_sbs_2/135-2705773-8459049?pd_rd_w=JEnSS&pf_rd_p=a5925d26-9630-40f3-a011-d858608ac88b&pf_rd_r=X5804P344MJAHYNR5CQ4&pd_rd_r=ab153d0f-d648-4cfc-ace5-832afda903a7&pd_rd_wg=gxg4w&pd_rd_i=0785834206&psc=1",
          author: "H. P. Lovecraft",
          language: "english",
          pages: 1112,
          publisher: "Chartwell Books",
          title: "The Complete Fiction of H. P. Lovecraft",
          year: 2016
        }
      });
    });

    test("create a book with invalid data", async () => {
      let response = await request(app)
        .post("/books")
        .send({
          isbn: "1234567890",
          amazon_url: "https://notamazon.org/not_a_book",
          author: "Foo Bar",
          language: "giberish",
          pages: 123,
          publisher: "Street Street",
          title: "Not a Real Book",
          year: 2000
        });

      expect(response.statusCode).toEqual(400);
    });
  });

  describe("PUT /books/:isbn", () => {
    test("update a book", async () => {
      let response = await request(app)
        .put("/books/9780198117476")
        .send({
          isbn: "9780198117476",
          amazon_url: "https://www.amazon.com/William-Shakespeare-Complete-Works-Oxford/dp/0198117477",
          author: "William Shakespeare",
          language: "English",
          pages: 1348,
          publisher: "Oxford University Press",
          title: "William Shakespeare: The Complete Works (The Oxford Shakespear)",
          year: 1988
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        book: {
          isbn: "9780198117476",
          amazon_url: "https://www.amazon.com/William-Shakespeare-Complete-Works-Oxford/dp/0198117477",
          author: "William Shakespeare",
          language: "English",
          pages: 1348,
          publisher: "Oxford University Press",
          title: "William Shakespeare: The Complete Works (The Oxford Shakespear)",
          year: 1988
        }
      });
    });

    test("cannot update an invalid book", async () => {
      let response = await request(app)
        .put("/books/1234567890")
        .send({
          isbn: "1234567890",
          amazon_url: "https://www.amazon.com/not_a_book",
          author: "Foo Bar",
          language: "giberish",
          pages: 123,
          publisher: "Street Street",
          title: "Not a Real Book",
          year: 2000
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn '1234567890",
          status: 404
        },
        message: "There is no book with an isbn '1234567890"
      });
    });

    test("update a book with invalid data", async () => {
      let response = await request(app)
        .put("/books/9780198117476")
        .send({
          isbn: "9780198117476",
          amazon_url: "https://notamazon.com/not_a_book",
          author: "William Shakespeare",
          language: "English",
          pages: 1348,
          publisher: "Oxford University Press",
          title: "William Shakespeare: The Complete Works (The Oxford Shakespear)",
          year: 1988
        });

      expect(response.statusCode).toEqual(400);
    });
  });

  describe("DELETE /books/:isbn", () => {
    test("delete a book", async () => {
      let response = await request(app).delete("/books/9780198117476");

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Book deleted" });
    });

    test("cannot delete an invalid book", async () => {
      let response = await request(app).delete("/books/1234567890");

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn '1234567890",
          status: 404
        },
        message: "There is no book with an isbn '1234567890"
      });
    });
  });
});

afterAll(async () => {
  await db.end();
});