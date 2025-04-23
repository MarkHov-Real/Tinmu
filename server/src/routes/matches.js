// routes/matches.js
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authenticateToken = require("../middleware/auth");

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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { Like: true },
    });

    if (!currentUser || currentUser.Like.length === 0) {
      return res.json([]); // No likes = no matches
    }

    const likedGenres = currentUser.Like.filter((l) => l.type === "genre").map(
      (l) => l.value
    );
    const likedArtists = currentUser.Like.filter(
      (l) => l.type === "artist"
    ).map((l) => l.value);

    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        gender:
          currentUser.lookingForGender === "any"
            ? undefined
            : currentUser.lookingForGender,
        lookingForGender:
          currentUser.gender === "any" ? undefined : currentUser.gender,
        relationType: currentUser.relationType,
        Like: {
          some: {
            OR: [
              { type: "genre", value: { in: likedGenres } },
              { type: "artist", value: { in: likedArtists } },
            ],
          },
        },
      },
      select: safeUserSelect,
    });

    // console.log("Les potentiels match sont : ", potentialMatchestest);

    res.json(potentialMatches);
  } catch (err) {
    console.error("❌ Error fetching matches:", err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

module.exports = router;
