// routes/ping.js
const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.get("/pong", (req, res) => {
  res.send("allo");
});

module.exports = router;
