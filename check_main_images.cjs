const fs = require('fs');
const axios = require('axios');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

async function checkImage(url) {
  try {
    const res = await axios.head(url, { timeout: 3000 });
    const size = parseInt(res.headers['content-length'], 10);
    if (res.statusCode === 404) return false;
    return size !== 16509; // Valid if not placeholder
  } catch (err) {
    return false;
  }
}

async function run() {
  console.log(`Checking main images for ${data.length} products...`);
  let broken = [];
  
  for (let i = 0; i < data.length; i++) {
    let p = data[i];
    const isValid = await checkImage(p.image);
    
    if (!isValid) {
      broken.push(p.ref);
    }
  }
  
  console.log("\nBroken main images found:", broken.length);
  if (broken.length > 0) {
    console.log("Broken Refs:", broken.join(", "));
  }
}

run();
