const fs = require('fs');
const axios = require('axios');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

async function check(url) {
  try {
    const res = await axios.get(url, { responseType: 'stream', timeout: 5000 });
    return res.status === 200;
  } catch(e) {
    return false;
  }
}

async function run() {
  let valid = [];
  for (let p of data) {
    const ok = await check(p.image);
    if (ok) {
      valid.push(p);
    } else {
      console.log(`Removing broken image product: ${p.ref}`);
    }
  }
  fs.writeFileSync('src/data/products.json', JSON.stringify(valid, null, 2));
  console.log(`Done. ${valid.length} products remaining.`);
}
run();
