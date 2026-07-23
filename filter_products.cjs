const fs = require('fs');
const axios = require('axios');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

async function isValidImage(url) {
  try {
    const res = await axios.head(url, { timeout: 3000 });
    const size = parseInt(res.headers['content-length'], 10);
    return size !== 16509 && res.status !== 404;
  } catch (err) {
    return false;
  }
}

async function run() {
  console.log(`Checking main images for ${data.length} products...`);
  let validProducts = [];
  
  for (let i = 0; i < data.length; i++) {
    let p = data[i];
    const isValid = await isValidImage(p.image);
    
    if (isValid) {
      validProducts.push(p);
    }
    process.stdout.write(`\rProcessed ${i + 1}/${data.length}. Valid: ${validProducts.length}`);
  }
  
  console.log(`\nFiltered out ${data.length - validProducts.length} broken products.`);
  
  fs.writeFileSync('src/data/products.json', JSON.stringify(validProducts, null, 2));
}

run();
