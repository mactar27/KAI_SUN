const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const dbUrl = process.env.TIDB_USER 
  ? `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:4000/${process.env.TIDB_DATABASE}?sslaccept=strict` 
  : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } }
});

async function main() {
  try {
    const count = await prisma.musicTrack.count();
    if (count === 0) {
      await prisma.musicTrack.create({
        data: {
          title: "Ambiance par défaut",
          url: "/ambiance.webm",
          isActive: true
        }
      });
      console.log("Default music track added and activated.");
    } else {
      console.log("Music tracks already exist.");
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
