import pool from './api/db.js';
import 'dotenv/config';

async function main() {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
  console.log(rows);
  process.exit(0);
}
main();
