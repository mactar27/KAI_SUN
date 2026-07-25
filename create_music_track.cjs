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
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`MusicTrack\` (
          \`id\` INTEGER NOT NULL AUTO_INCREMENT,
          \`title\` VARCHAR(191) NOT NULL,
          \`url\` LONGTEXT NOT NULL,
          \`isActive\` BOOLEAN NOT NULL DEFAULT false,
          PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log("MusicTrack table created successfully.");
  } catch (e) {
    console.error("Error creating table:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
