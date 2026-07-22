const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeAndInsert() {
  console.log('Fetching page...');
  try {
    const { data } = await axios.get('https://www.solo-solis.com/fr/lunettes-de-soleil-hommes');
    
    // Extract images using Regex
    const regex = /https:\/\/www\.solo-solis\.com\/media\/catalog\/product\/[^"]*\.jpg/g;
    const matches = data.match(regex) || [];
    
    // Deduplicate
    const uniqueImages = [...new Set(matches)];

    const products = [];
    
    // Process unique images
    for (const image of uniqueImages) {
      if (image.includes('placeholder') || image.includes('base.jpg')) continue;

      // Extract model number from URL: e.g. 9623_1_1.jpg -> 9623
      const filenameMatch = image.match(/\/(\d+)[^\/]*\.jpg$/);
      const modelNum = filenameMatch ? filenameMatch[1] : null;

      if (!modelNum) continue;

      // Check if we already added this model (some have _1.jpg and _1_1.jpg)
      if (products.some(p => p.name.includes(modelNum))) continue;

      const costPrice = Math.floor(Math.random() * 15) + 15; // 15 to 30
      const price = costPrice * 3 + Math.floor(Math.random() * 20); // 45 to 110

      products.push({
        name: `Solo Solis ${modelNum}`,
        price: price,
        costPrice: costPrice,
        category: 'homme',
        image: image,
        hoverImage: image.replace('.jpg', '_1.jpg'), // guess hover image
        isNew: Math.random() > 0.7,
        stock: Math.floor(Math.random() * 50) + 5
      });
    }

    console.log(`Found ${products.length} products. Inserting into database...`);

    for (const p of products) {
      await prisma.product.create({
        data: p
      });
      console.log(`Added: ${p.name}`);
    }

    console.log('Scraping and insertion complete!');

  } catch (error) {
    console.error('Error scraping:', error);
  } finally {
    await prisma.$disconnect();
  }
}

scrapeAndInsert();
