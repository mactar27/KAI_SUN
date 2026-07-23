import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function init() {
  console.log('Connecting to TiDB...');
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: 4000,
    ssl: { rejectUnauthorized: true }
  });

  console.log('Creating tables...');
  
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      ref VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      gender VARCHAR(20) NOT NULL,
      image VARCHAR(255) NOT NULL,
      groupId VARCHAR(50)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_thumbnails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id VARCHAR(50),
      url VARCHAR(255),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      total_amount INT NOT NULL,
      status VARCHAR(50) DEFAULT 'Nouvelle',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id VARCHAR(50) NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      product_ref VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Tables created successfully.');

  // Migrate data
  console.log('Migrating products...');
  const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/products.json'), 'utf8'));

  for (const product of productsData) {
    // Check if product exists
    const [rows] = await connection.query('SELECT id FROM products WHERE id = ?', [product.id]);
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO products (id, ref, name, price, gender, image, groupId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.id, product.ref, product.name, product.price, product.gender, product.image, product.groupId || null]
      );
      
      if (product.thumbnails) {
        for (const url of product.thumbnails) {
          await connection.query(
            'INSERT INTO product_thumbnails (product_id, url) VALUES (?, ?)',
            [product.id, url]
          );
        }
      }
    }
  }

  console.log('Migration completed successfully.');
  await connection.end();
}

init().catch(console.error);
