const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

let models = {};
for (let p of data) {
  // Assume base model is ref without the last digit
  // e.g. NDL9971 -> base NDL997
  let base = p.ref.substring(0, p.ref.length - 1);
  if (!models[base]) models[base] = [];
  models[base].push(p.ref);
}
console.log(JSON.stringify(models, null, 2));
