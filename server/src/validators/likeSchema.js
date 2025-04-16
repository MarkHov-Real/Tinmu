// validators/likeSchema.js
const yup = require("yup");

const allowedTypes = ["artist", "genre"];
const allowedGenres = ["Pop", "Rock", "Indie", "Hip-Hop", "Jazz"]; // Fetch or cache from Spotify later
const allowedArtists = [
  "Dua Lipa",
  "Drake",
  "Phoebe Bridgers",
  "Kendrick Lamar",
]; // Example data

const likeSchema = yup.object({
  type: yup.string().oneOf(["artist", "genre"]).required(),
  value: yup.string().when("type", {
    is: "genre",
    then: (schema) => schema.oneOf(allowedGenres),
    otherwise: (schema) => schema.oneOf(allowedArtists),
  }),
});

module.exports = likeSchema;
