// app.js
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

// Mount routes
app.use("/users", require("./routes/users"));
app.use("/likes", require("./routes/likes"));
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/ping"));

module.exports = app;
