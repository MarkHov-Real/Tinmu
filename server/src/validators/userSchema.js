const yup = require("yup");

const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  favoriteGenre: yup.string().required(),
  password: yup.string().min(6).required(),
  favoriteArtist: yup.string(),
  gender: yup.string().required(),
  lookingForGender: yup.string().required(),
  relationType: yup.string().oneOf(["friend", "lover", "dating"]).required(),
  personalAnthem: yup.string(),
});

module.exports = userSchema;
