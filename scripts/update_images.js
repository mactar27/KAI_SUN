import fs from 'fs';
import * as cheerio from 'cheerio';
import pool from '../api/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const brokenRefs = [
  'NDL9860',
  'NDL9867',
  'NDL9869',
  'NDL9572',
  'NDL9775',
  'NDL9776',
  'NDL9845',
  'NDL9864',
  'NDL9952'
];

async function updateImages() {
  try {
    for (const ref of brokenRefs) {
      console.log(`Fetching ${ref}...`);
      const url = `https://www.solo-solis.com/${ref.toLowerCase()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch ${ref}: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract og:image
      const ogImage = $('meta[property="og:image"]').attr('content');
      
      if (ogImage) {
        // Remove query parameters from the image URL to get the clean high-res image
        const cleanUrl = ogImage.split('?')[0];
        console.log(`Found new image for ${ref}: ${cleanUrl}`);
        
        // Update database
        await pool.query('UPDATE products SET image = ? WHERE ref = ?', [cleanUrl, ref]);
        console.log(`Updated ${ref} in database.`);
      } else {
        console.error(`Could not find image for ${ref}`);
      }
    }
    console.log('Finished updating images!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateImages();
