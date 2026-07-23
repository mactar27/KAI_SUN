const fs = require('fs');
const axios = require('axios');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

async function checkImage(url) {
  try {
    const res = await axios.head(url, { timeout: 3000 });
    const size = parseInt(res.headers['content-length'], 10);
    return size !== 16509; // Valid if not placeholder
  } catch (err) {
    return false;
  }
}

async function run() {
  console.log(`Checking thumbnails for ${data.length} products...`);
  
  for (let i = 0; i < data.length; i++) {
    let p = data[i];
    p.thumbnails = [p.image];
    
    const url2 = p.image.replace('_1.jpg', '_2.jpg');
    const url3 = p.image.replace('_1.jpg', '_3.jpg');
    
    const [isValid2, isValid3] = await Promise.all([
      checkImage(url2),
      checkImage(url3)
    ]);
    
    if (isValid2) p.thumbnails.push(url2);
    if (isValid3) p.thumbnails.push(url3);
    
    process.stdout.write(`\rProcessed ${i + 1}/${data.length}`);
  }
  
  fs.writeFileSync('src/data/products.json', JSON.stringify(data, null, 2));
  console.log("\nFinished checking thumbnails!");
}

run();
