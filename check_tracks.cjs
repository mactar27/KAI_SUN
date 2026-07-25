const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const dbUrl = process.env.TIDB_USER 
  ? `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:4000/${process.env.TIDB_DATABASE}?sslaccept=strict` 
  : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } }
});

async function main() {
  const tracks = await prisma.musicTrack.findMany();
  console.log("TRACKS:", tracks);
  await prisma.$disconnect();
}
main();
