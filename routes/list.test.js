process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let list = require("../fakeDb");
const { afterEach } = require("node:test");

let pickles = {
    name: "Pickles",
    price: 1.99
};

beforeEach(function(){
    list.push(pickles);
});

afterEach(function(){
    list.length = 0;
});

describe("GET /list", () => {
    test("Get all list items", async() => {
        const res = await request(app).get("/list");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ list: [pickles] })
    })
})

describe("GET /list/:name", () => {
    test("Get individual list item", async() => {
        const res = await request(app).get(`/list/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item: pickles});
    })
    test("Responds with 404 for invalid list item", async () => {
        const res = await request(app).get(`/list/icecube`);
        expect(res.statusCode).toBe(404)
      })
})

describe("POST /list", () => {
    test("Creating a list item", async () => {
      const res = await request(app).post("/list").send({ name: "cheese", price: 3.99 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ item: { name: "cheese", price: 3.99 } });
    })
    test("Responds with 400 if name is missing", async () => {
      const res = await request(app).post("/list").send({});
      expect(res.statusCode).toBe(400);
    })
  })

  describe("/PATCH /list/:name", () => {
    test("Updating a list item's name", async () => {
      const res = await request(app).patch(`/list/${pickles.name}`).send({ name: "cucumbers", price: 1.49 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ item: { name: "cucumbers", price: 1.49 } });
    })
    test("Responds with 404 for invalid name", async () => {
      const res = await request(app).patch(`/list/Piggles`).send({ name: "cucumbers", price: 1.49 });
      expect(res.statusCode).toBe(404);
    })
  })

  describe("/DELETE /list/:name", () => {
    test("Deleting a list item", async () => {
      const res = await request(app).delete(`/list/${pickles.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Item Deleted!' })
    })
    test("Responds with 404 for deleting invalid list item", async () => {
      const res = await request(app).delete(`/list/piggles`);
      expect(res.statusCode).toBe(404);
    })
  })