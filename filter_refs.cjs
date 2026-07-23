const fs = require('fs');

const refs = `NDL9971
NDL9973
NDL9970
NDL9919
NDL9921
NDL9922
NDL9920
NDL9916
NDL9915
NDL9917
NDL9910 
NDL9912
NDL9914
NDL9971
NDL9880
NDL9815
NDL9816
NDL8298
NDL8299
NDL9871
NDL9872
NDL9873
NDL9776
NDL9775
NDL9572
NDL9570
NDL9571
NDL9518
NDL9952
NDL9338
NDL9340
NDL9583`
.split('\n')
.map(r => r.trim().replace('NDL', ''))
.filter(Boolean);

console.log('Unique required refs:', [...new Set(refs)]);

const content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

let foundCount = 0;
for (const ref of new Set(refs)) {
  if (content.includes(`RÉF. ${ref}`)) {
    foundCount++;
    console.log(`Found ${ref} in Home.jsx`);
  } else {
    console.log(`MISSING ${ref} in Home.jsx`);
  }
}
console.log(`Total found: ${foundCount} out of ${new Set(refs).size}`);
