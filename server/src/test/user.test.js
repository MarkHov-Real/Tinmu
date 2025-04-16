const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

let token; // For authenticated requests

async function loginAndGetToken() {
  const hashed = await bcrypt.hash("test1234", 10);

  await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@login.com",
      password: hashed,
      favoriteGenre: "Pop",
      favoriteArtist: "Dua Lipa",
      gender: "female",
      lookingForGender: "any",
      relationType: "friend",
      personalAnthem: "Shake It Off",
    },
  });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@login.com", password: "test1234" });

  return res.body.token;
}

beforeEach(async () => {
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();
  token = await loginAndGetToken();
});

afterAll(async () => {
  await prisma.$disconnect();
});
describe("GET /users", () => {
  let token;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const hashed = await bcrypt.hash("test1234", 10);
    await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@login.com",
        password: hashed,
        favoriteGenre: "Pop",
        favoriteArtist: "Dua Lipa",
        gender: "female",
        lookingForGender: "any",
        relationType: "friend",
        personalAnthem: "Shake It Off",
      },
    });

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
          favoriteArtist: "Foo Fighters",
          gender: "male",
          lookingForGender: "female",
          relationType: "friend",
          personalAnthem: "Everlong",
        },
      ],
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@login.com", password: "test1234" });

    token = res.body.token;
  });

  it("should return all users without passwords", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(3);
    expect(res.body[0]).not.toHaveProperty("password");
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

    const res = await request(app)
      .get(`/users/${createdUser.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: createdUser.id,
      name: "Charlie",
      email: "charlie@example.com",
      favoriteGenre: "Jazz",
    });
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 404 if user is not found", async () => {
    const res = await request(app)
      .get("/users/999999")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(res.body).toEqual({ error: "User not found" });
  });
});

describe("POST /users validation", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "missing-fields@example.com" })
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
      .set("Authorization", `Bearer ${token}`)
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
    expect(stored.password.length).toBeGreaterThan(20);
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
    const res = await request(app)
      .get("/users?genre=rock")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      name: "Bob",
      favoriteGenre: "Rock",
    });
    expect(res.body[0]).not.toHaveProperty("password");
  });

  it("should return all users if no filter is passed", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("POST /auth/login", () => {
  it("should return success on valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@login.com", password: "test1234" })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should return 401 on wrong password", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "test@login.com", password: "wrong" })
      .expect(401);
  });

  it("should return 401 if email is not found", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "missing@user.com", password: "whatever" })
      .expect(401);
  });
});

describe("GET /users/me", () => {
  let user;
  beforeEach(async () => {
    await prisma.user.deleteMany();

    const hashed = await bcrypt.hash("test1234", 10);
    user = await prisma.user.create({
      data: {
        name: "Test Me",
        email: "me@test.com",
        password: hashed,
        favoriteGenre: "Indie",
        favoriteArtist: "Phoebe Bridgers",
        gender: "nonbinary",
        lookingForGender: "any",
        relationType: "friend",
        personalAnthem: "Motion Sickness",
      },
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "test1234" });

    token = res.body.token;
  });

  it("should return the logged-in user's safe profile", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: user.id,
      email: user.email,
      favoriteGenre: "Indie",
      personalAnthem: "Motion Sickness",
    });

    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app).get("/users/me").expect(401);
    expect(res.body).toEqual({ error: "Token missing" });
  });
});
