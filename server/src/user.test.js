const request = require('supertest');
const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.user.deleteMany(); // Clean slate
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /users', () => {
  it('should create a new user and return it', async () => {
    const newUser = {
      name: "Alex",
      email: "alex@example.com",
      favoriteGenre: "Hip Hop",
      favoriteArtist: "Kendrick Lamar",
      gender: "male",
      lookingForGender: "female",
      relationType: "friend",
      personalAnthem: "Alright - Kendrick Lamar"
    };

    const res = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: "Alex",
      email: "alex@example.com",
      favoriteGenre: "Hip Hop"
      // Optional: add other fields if you want to test more
    });
  });
});
