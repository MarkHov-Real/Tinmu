const yup = require("yup");

const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  favoriteGenre: yup.string().required(),
  password: yup.string().min(6).required(),
  favoriteArtist: yup.string(),
  gender: yup.string().oneOf(["female", "male", "it"]).required(),
  lookingForGender: yup.string().oneOf(["female", "male", "it"]).required(),
  relationType: yup.string().oneOf(["friend", "lover", "dating"]).required(),
  personalAnthem: yup.string(),
  personalThemeTempo: yup
    .string()
    .oneOf(["slow", "fast", "blues"])
    .default("slow"),
});

module.exports = userSchema;
