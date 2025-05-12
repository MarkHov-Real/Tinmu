// routes/likes.js
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/auth");
const likeSchema = require("../validators/likeSchema");

const safeLikeSelect = {
  id: true,
  type: true,
  value: true,
};

router.post("/", authenticateToken, async (req, res) => {
  try {
    const validated = await likeSchema.validate(req.body, {
      abortEarly: false,
    });

    const like = await prisma.like.create({
      data: {
        userId: req.user.userId,
        type: validated.type,
        value: validated.value,
      },
      select: {
        id: true,
        type: true,
        value: true,
        createdAt: true,
      },
    });

    res.status(201).json(like);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({
          error: "Validation failed",
          details: err.errors
        });
    }
    console.error("❌ Error creating like:", err);
    res.status(500).json({
      error: "Failed to create like"
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const like = await prisma.like.findMany({
      where: {
        userId: Number(req.user.userId)
      },
      select: safeLikeSelect,
    });

    if (like.length === 0) {
      return res.status(404).json({
        error: "No likes found for this user"
      });
    }

    res.json(like);
  } catch (err) {
    console.error("Error in /like/me:", err); // 👈 helpful log
    res
      .status(500)
      .json({
        error: "Failed to fetch current likes (from /me route)"
      });
  }
});

module.exports = router;