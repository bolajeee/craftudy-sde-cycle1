const request = require("supertest");
const app = require("../src/app");

describe("GET /health", () => {
  test("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("unknown routes", () => {
  test("return a JSON 404", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });
});
