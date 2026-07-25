const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const dbUrl = process.env.TIDB_USER 
  ? `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:4000/${process.env.TIDB_DATABASE}?sslaccept=strict` 
  : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } }
});

async function main() {
  await prisma.musicTrack.updateMany({
    data: {
      url: '/ambiance.webm'
    }
  });
  console.log("Track URL updated to /ambiance.webm");
  await prisma.$disconnect();
}
main();
