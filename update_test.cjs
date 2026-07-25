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
    data: { isActive: false }
  });
  
  const testTracks = await prisma.musicTrack.findMany({
    where: { title: 'Test' }
  });

  if (testTracks.length > 0) {
    await prisma.musicTrack.update({
      where: { id: testTracks[testTracks.length - 1].id },
      data: { url: '/test_ambiance.webm', isActive: true }
    });
  } else {
    await prisma.musicTrack.create({
      data: { title: 'Test', url: '/test_ambiance.webm', isActive: true }
    });
  }
  
  console.log("Test track updated to /test_ambiance.webm and set to active.");
  await prisma.$disconnect();
}
main();
