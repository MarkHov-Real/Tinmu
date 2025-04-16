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

  await prisma.like.createMany({
    data: [
      { userId: user.id, type: "genre", value: "Indie" },
      { userId: user.id, type: "artist", value: "Phoebe Bridgers" },
    ],
  });

  // Create a matching user
  const matchUser = await prisma.user.create({
    data: {
      name: "Matching Girl",
      email: "matchher@test.com",
      password: "irrelevant",
      favoriteGenre: "Indie",
      gender: "female",
      lookingForGender: "male",
      relationType: "lover",
    },
  });

  await prisma.like.create({
    data: [
      {
        userId: matchUser.id,
        type: "genre",
        value: "Indie",
      },
      {
        userId: matchUser.id,
        type: "artist",
        value: "Phoebe Bridgers",
      },
    ],
  });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: "test1234" });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

it("should return matching users based on likes and gender prefs", async () => {
  const res = await request(app)
    .get("/matches")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.length).toBeGreaterThanOrEqual(1);
  expect(res.body[0]).toMatchObject({
    name: "Matching Girl",
    favoriteGenre: "Indie",
  });
});

it("should return empty array if no matches found", async () => {
  await prisma.like.deleteMany(); // remove all likes

  const res = await request(app)
    .get("/matches")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body).toEqual([]);
});
