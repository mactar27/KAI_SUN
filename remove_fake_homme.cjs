const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Replace K-02 block
content = content.replace(/<div className="card" data-gender="homme">\s*<div className="card-lens"[^>]*>[\s\S]*?RÉF\. K-02[\s\S]*?<\/div>\s*<\/div>/, '');

// Replace K-04 block
content = content.replace(/<div className="card" data-gender="homme">\s*<div className="card-lens"[^>]*>[\s\S]*?RÉF\. K-04[\s\S]*?<\/div>\s*<\/div>/, '');

// There is also NDL8317 which was a fake SVG card. Should I remove it?
// The user asked to keep specific women's products, maybe they don't want the fake SVG for men either.
content = content.replace(/<div className="card" data-gender="homme">\s*<div className="card-lens"[^>]*>[\s\S]*?RÉF\. NDL8317[\s\S]*?<\/div>\s*<\/div>/, '');

// There is also 7075 and 9972 which were the original image cards in the template for men. I'll leave them since they are real images.

fs.writeFileSync('src/pages/Home.jsx', content);
console.log('Removed fake homme SVG cards');
