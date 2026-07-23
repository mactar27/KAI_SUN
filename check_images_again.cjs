const fs = require('fs');
const axios = require('axios');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

async function check() {
  for(let i=0; i<12; i++) {
    try {
      const url = data[i].image + '?width=600&height=600';
      const res = await axios.head(url);
      console.log(`Product ${data[i].ref} image OK. Size: ${res.headers['content-length']}`);
    } catch(e) {
      console.log(`Product ${data[i].ref} image FAILED!`);
    }
  }
}
check();
