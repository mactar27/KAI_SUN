import 'dotenv/config';
import pool from './api/db.js';

async function main() {
  try {
    console.log("Checking specs columns on products table...");
    const columns = [
      { name: 'frame_width', type: "VARCHAR(50) DEFAULT '145 mm'" },
      { name: 'lens_width', type: "VARCHAR(50) DEFAULT '51 mm'" },
      { name: 'bridge_width', type: "VARCHAR(50) DEFAULT '18 mm'" },
      { name: 'temple_length', type: "VARCHAR(50) DEFAULT '140 mm'" },
      { name: 'face_shapes', type: "VARCHAR(255) DEFAULT 'Ovale, Rond, Carré'" },
      { name: 'material', type: "VARCHAR(255) DEFAULT 'Acétate bio-sourcé italien'" },
      { name: 'uv_protection', type: "VARCHAR(255) DEFAULT 'UV400 Catégorie 3'" }
    ];

    for (const col of columns) {
      const [rows] = await pool.query(`SHOW COLUMNS FROM products LIKE '${col.name}'`);
      if (rows.length === 0) {
        console.log(`Adding column '${col.name}'...`);
        await pool.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Column '${col.name}' added successfully.`);
      } else {
        console.log(`Column '${col.name}' already exists.`);
      }
    }
    console.log("ALL SPECS COLUMNS VERIFIED AND READY!");
  } catch (e) {
    console.error("Error adding columns:", e.message);
  } finally {
    process.exit(0);
  }
}
main();
