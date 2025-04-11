const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // To parse JSON body

// Routes
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/pong', (req, res)=> {
    res.send("allo")
})

app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = app;