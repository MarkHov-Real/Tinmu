const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  // Clean old users
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();

  const hashed1 = await bcrypt.hash("test1234", 10);
  const hashed2 = await bcrypt.hash("test5678", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "Frontend Tester 1",
      email: "frontend1@test.com",
      password: hashed1,
      favoriteGenre: "Pop",
      favoriteArtist: "Dua Lipa",
      gender: "female",
      lookingForGender: "male",
      relationType: "friend",
      personalAnthem: "Levitating",
      personalThemeTempo: "fast",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Frontend Tester 2",
      email: "frontend2@test.com",
      password: hashed2,
      favoriteGenre: "Indie",
      favoriteArtist: "Phoebe Bridgers",
      gender: "nonbinary",
      lookingForGender: "any",
      relationType: "lover",
      personalAnthem: "Motion Sickness",
      personalThemeTempo: "slow",
    },
  });

  await prisma.like.createMany({
    data: [
      { userId: user1.id, type: "genre", value: "Pop" },
      { userId: user1.id, type: "artist", value: "Dua Lipa" },
      { userId: user2.id, type: "genre", value: "Indie" },
      { userId: user2.id, type: "artist", value: "Phoebe Bridgers" },
    ],
  });

  console.log("✅ Final test users and likes created for frontend.");
});

afterAll(async () => {
  await prisma.$disconnect();
});

// 👇 dummy test so Jest doesn't error
test("setup complete", () => {
  expect(true).toBe(true);
});
