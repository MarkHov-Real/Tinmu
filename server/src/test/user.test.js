const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.user.deleteMany(); // Clean slate
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /users", () => {
  it("should create a new user and return it", async () => {
    const newUser = {
      name: "Alex",
      email: "alex@example.com",
      favoriteGenre: "Hip Hop",
      favoriteArtist: "Kendrick Lamar",
      gender: "male",
      lookingForGender: "female",
      relationType: "friend",
      personalAnthem: "Alright - Kendrick Lamar",
    };

    const res = await request(app).post("/users").send(newUser).expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: "Alex",
      email: "alex@example.com",
      favoriteGenre: "Hip Hop",
      // Optional: add other fields if you want to test more
    });
  });
});

describe("GET /users", () => {
  it("should return all users", async () => {
    // Seed some users
    await prisma.user.createMany({
      data: [
        {
          name: "Alice",
          email: "alice@example.com",
          favoriteGenre: "Pop",
          favoriteArtist: "Dua Lipa",
          gender: "female",
          lookingForGender: "male",
          relationType: "lover",
          personalAnthem: "Levitating",
        },
        {
          name: "Bob",
          email: "bob@example.com",
          favoriteGenre: "Rock",
          favoriteArtist: "Foo Fighters",
          gender: "male",
          lookingForGender: "female",
          relationType: "friend",
          personalAnthem: "Everlong",
        },
      ],
    });

    const res = await request(app).get("/users").expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0]).toEqual(
      expect.objectContaining({
        email: "alice@example.com",
        gender: "female",
      })
    );
    expect(res.body[1]).toHaveProperty("email", "bob@example.com");
  });
});

describe("GET /users/:id", () => {
  it("should return a single user by ID", async () => {
    const createdUser = await prisma.user.create({
      data: {
        name: "Charlie",
        email: "charlie@example.com",
        favoriteGenre: "Jazz",
        favoriteArtist: "Miles Davis",
        gender: "male",
        lookingForGender: "any",
        relationType: "friend",
        personalAnthem: "So What",
      },
    });

    const res = await request(app).get(`/users/${createdUser.id}`).expect(200);

    expect(res.body).toMatchObject({
      id: createdUser.id,
      name: "Charlie",
      email: "charlie@example.com",
      favoriteGenre: "Jazz",
      favoriteArtist: "Miles Davis",
    });
  });

  it("should return 404 if user is not found", async () => {
    const res = await request(app).get("/users/999999").expect(404);

    expect(res.body).toEqual({ error: "User not found" });
  });
});
