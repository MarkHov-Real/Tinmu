const express = require("express");
const { PrismaClient } = require("@prisma/client");
const userSchema = require("./validators/userSchema");
const bcrypt = require("bcrypt");

const app = express();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

app.use(express.json());

// Safe fields to return from user queries
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  favoriteGenre: true,
  favoriteArtist: true,
  gender: true,
  lookingForGender: true,
  relationType: true,
  personalAnthem: true,
  createdAt: true,
};

// Health check routes
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/pong", (req, res) => {
  res.send("allo");
});

// Create user (sign up)
app.post("/users", async (req, res) => {
  try {
    const validatedData = await userSchema.validate(req.body, {
      abortEarly: false,
    });

    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      SALT_ROUNDS
    );

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: safeUserSelect, // ✅ Only return safe fields
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }

    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// List users (optionally filter by genre)
app.get("/users", async (req, res) => {
  const { genre } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: genre
        ? {
            favoriteGenre: {
              equals: genre,
              mode: "insensitive",
            },
          }
        : undefined,
      select: safeUserSelect, // ✅ Safer and cleaner
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect, // ✅ Only return safe fields
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = app;
