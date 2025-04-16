// routes/users.js
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const userSchema = require("../validators/userSchema");
const authenticateToken = require("../middleware/auth");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

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

// Create user
router.post("/", async (req, res) => {
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
      select: safeUserSelect,
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/debug-users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("❌ Failed to fetch debug users", err);
    res.status(500).json({ error: "Debug fetch failed" });
  }
});

// List users (with optional filter)
router.get("/", authenticateToken, async (req, res) => {
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
      select: safeUserSelect,
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get ME user informations
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.userId) },
      select: safeUserSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /users/me:", err); // 👈 helpful log
    res
      .status(500)
      .json({ error: "Failed to fetch current users (from /me route)" });
  }
});

// Get user by ID
router.get("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user(This is from /:id)" });
  }
});
module.exports = router;
