// src/lib/prisma.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// console.log("🧪 Using DB:", process.env.DATABASE_URL);

module.exports = prisma;
