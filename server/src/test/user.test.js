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

describe("GET /users", () => {
  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        {
          name: "Alice",
          email: "alice@example.com",
          password: "hashed-password", // Simulating hashed
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
          password: "hashed-password",
          favoriteGenre: "Rock",
          favoriteArtist: "Foo Fighters",
          gender: "male",
          lookingForGender: "female",
          relationType: "friend",
          personalAnthem: "Everlong",
        },
      ],
    });
  });

  it("should return all users without passwords", async () => {
    const res = await request(app).get("/users").expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0]).toEqual(
      expect.objectContaining({
        email: "alice@example.com",
        gender: "female",
      })
    );
    expect(res.body[0]).not.toHaveProperty("password");
    expect(res.body[1]).toHaveProperty("email", "bob@example.com");
    expect(res.body[1]).not.toHaveProperty("password");
  });
});

describe("GET /users/:id", () => {
  it("should return a single user by ID without password", async () => {
    const createdUser = await prisma.user.create({
      data: {
        name: "Charlie",
        email: "charlie@example.com",
        password: "hashed-password",
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
    });
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 404 if user is not found", async () => {
    const res = await request(app).get("/users/999999").expect(404);
    expect(res.body).toEqual({ error: "User not found" });
  });
});

describe("POST /users validation", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "missing-fields@example.com",
      })
      .expect(400);

    expect(res.body).toMatchObject({
      error: "Validation failed",
      details: expect.arrayContaining([
        "name is a required field",
        "password is a required field",
        "favoriteGenre is a required field",
        "gender is a required field",
        "lookingForGender is a required field",
        "relationType is a required field",
      ]),
    });
  });

  it("should hash the password", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        name: "HashedUser",
        email: "hash@example.com",
        password: "plaintext123",
        favoriteGenre: "EDM",
        gender: "other",
        lookingForGender: "any",
        relationType: "friend",
      })
      .expect(201);

    expect(res.body).not.toHaveProperty("password");

    const stored = await prisma.user.findUnique({
      where: { email: "hash@example.com" },
    });

    expect(stored.password).not.toBe("plaintext123");
    expect(stored.password.length).toBeGreaterThan(20); // bcrypt hash length
  });
});

describe("GET /users with query filters", () => {
  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        {
          name: "Alice",
          email: "alice@example.com",
          password: "hashed-password",
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
          password: "hashed-password",
          favoriteGenre: "Rock",
          favoriteArtist: "Nirvana",
          gender: "male",
          lookingForGender: "female",
          relationType: "friend",
          personalAnthem: "Lithium",
        },
      ],
    });
  });

  it("should return users matching a given genre", async () => {
    const res = await request(app).get("/users?genre=rock").expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      name: "Bob",
      favoriteGenre: "Rock",
    });
    expect(res.body[0]).not.toHaveProperty("password");
  });

  it("should return all users if no filter is passed", async () => {
    const res = await request(app).get("/users").expect(200);
    expect(res.body.length).toBe(2);
  });
});
