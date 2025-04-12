const request = require("supertest");
const app = require("../app"); // Reuse the app from one source

describe("GET /ping", () => {
  it("should return pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.text).toBe("pong");
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /pong", () => {
  it("should return pong", async () => {
    const res = await request(app).get("/pong");
    expect(res.text).toBe("allo");
    expect(res.statusCode).toBe(200);
  });
});

describe("POST /users validation", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "missing-name@example.com",
        // no name, favoriteGenre, etc.
      })
      .expect(400);

    expect(res.body).toMatchObject({
      error: "Validation failed",
      details: expect.arrayContaining([
        "name is a required field",
        "favoriteGenre is a required field",
        "gender is a required field",
        "lookingForGender is a required field",
        "relationType is a required field",
      ]),
    });
  });
});
