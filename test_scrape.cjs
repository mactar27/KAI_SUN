const axios = require('axios');

async function run() {
  const { data } = await axios.get('https://www.solo-solis.com/fr/lunettes-de-soleil-hommes');
  const regex = /https:\/\/www\.solo-solis\.com\/media\/catalog\/product\/[^\"]*\.jpg/g;
  const matches = data.match(regex) || [];
  const uniqueImages = [...new Set(matches)];
  
  let validImages = 0;
  for(const image of uniqueImages) {
    if (image.includes('placeholder')) continue;
    validImages++;
  }
  console.log('Total valid images:', validImages);
}

run();
