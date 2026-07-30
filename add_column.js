import 'dotenv/config';
import pool from './api/db.js';

async function main() {
  try {
    const [rows] = await pool.query("SHOW COLUMNS FROM products LIKE 'stock'");
    if (rows.length === 0) {
      console.log("Column 'stock' does not exist. Adding it now...");
      await pool.query("ALTER TABLE products ADD COLUMN stock INT DEFAULT 0");
      console.log("Column 'stock' added successfully.");
    } else {
      console.log("Column 'stock' already exists.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
main();
