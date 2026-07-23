const fs = require('fs');

const content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const regex = /<div className="card" data-gender="([^"]+)">[\s\S]*?<img src="([^"]+)"[^>]*>[\s\S]*?RÉF\. ([^<]+)<\/span>[\s\S]*?onClick=\{\(\) => addToCart\(\{ id: '([^']+)'/g;

let products = [];
let match;
while ((match = regex.exec(content)) !== null) {
  products.push({
    id: match[4],
    ref: match[3],
    gender: match[1],
    image: match[2],
    price: 25000,
    name: `RÉF. ${match[3]} - Fournisseur ${match[1].charAt(0).toUpperCase() + match[1].slice(1)}`
  });
}

fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
console.log(`Extracted ${products.length} products.`);
