const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

let token;
let user;

beforeEach(async () => {
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();

  const hashed = await bcrypt.hash("test1234", 10);
  user = await prisma.user.create({
    data: {
      name: "Like Tester",
      email: "like@test.com",
      password: hashed,
      favoriteGenre: "Pop",
      favoriteArtist: "Drake",
      gender: "male",
      lookingForGender: "any",
      relationType: "friend",
      personalAnthem: "God's Plan",
    },
  });

  const check = await prisma.user.findUnique({ where: { id: user.id } });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: "test1234" });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /likes", () => {
  it("should create a like for artist", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const res = await request(app)
      .post("/likes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "artist",
        value: "Drake",
      });
    expect(201);

    expect(res.body).toMatchObject({
      type: "artist",
      value: "Drake",
    });
    expect(res.body).not.toHaveProperty("user.password");
  });
  it("should reject invalid type", async () => {
    const res = await request(app)
      .post("/likes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "band", // Invalid
        value: "Queen",
      })
      .expect(400);

    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  it("should reject invalid value for type", async () => {
    const res = await request(app)
      .post("/likes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "genre",
        value: "Screamo",
      })
      .expect(400);

    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  it("should reject request with missing token", async () => {
    const res = await request(app)
      .post("/likes")
      .send({
        type: "genre",
        value: "Pop",
      })
      .expect(401);

    expect(res.body).toEqual({ error: "Token missing" });
  });
});

describe("GET /likes/me", () => {
  it("should return all likes for the logged-in user", async () => {
    // Create 2 likes for the test user
    await prisma.like.createMany({
      data: [
        {
          userId: user.id,
          type: "artist",
          value: "Drake",
        },
        {
          userId: user.id,
          type: "genre",
          value: "Pop",
        },
      ],
    });

    const res = await request(app)
      .get("/likes/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "artist", value: "Drake" }),
        expect.objectContaining({ type: "genre", value: "Pop" }),
      ])
    );
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/likes/me").expect(401);
    expect(res.body).toEqual({ error: "Token missing" });
  });
});
