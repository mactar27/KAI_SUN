const fs = require('fs');

let data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

data = data.map(p => {
  if (p.image.includes('?')) {
    p.image = p.image.split('?')[0];
  }
  return p;
});

fs.writeFileSync('src/data/products.json', JSON.stringify(data, null, 2));
console.log('Fixed products.json');
