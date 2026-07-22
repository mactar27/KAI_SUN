const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Classic Clubmaster (Solo Solis 7076)',
    price: 89,
    costPrice: 20,
    category: 'homme',
    image: 'https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg',
    hoverImage: 'https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg',
    isNew: true,
    stock: 12
  },
  {
    name: 'Aviator Black (Solo Solis 9973)',
    price: 115,
    costPrice: 25,
    category: 'homme',
    image: 'https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg',
    hoverImage: 'https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg',
    isNew: false,
    stock: 5
  },
  {
    name: 'Vintage Square (Solo Solis 8318)',
    price: 95,
    costPrice: 18,
    category: 'homme',
    image: 'https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg',
    hoverImage: 'https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg',
    isNew: true,
    stock: 8
  },
  {
    name: 'Cat Eye Glamour (Solo Solis 7075)',
    price: 110,
    costPrice: 22,
    category: 'femme',
    image: 'https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg',
    hoverImage: 'https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg',
    isNew: true,
    stock: 15
  },
  {
    name: 'Oversized Havana (Solo Solis 9924)',
    price: 125,
    costPrice: 30,
    category: 'femme',
    image: 'https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg',
    hoverImage: 'https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg',
    isNew: false,
    stock: 3
  }
];

async function main() {
  console.log('Start seeding...');
  await prisma.stats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, visitors: 1245 }
  });

  for (const p of initialProducts) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
