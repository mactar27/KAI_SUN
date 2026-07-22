import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CONVERSION_RATE = 655;

async function migrateToFCFA() {
  console.log('Migrating prices to FCFA...');
  
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.price < 5000) { // Safety check to not run it twice
      await prisma.product.update({
        where: { id: p.id },
        data: {
          price: p.price * CONVERSION_RATE,
          costPrice: p.costPrice * CONVERSION_RATE
        }
      });
    }
  }

  const orders = await prisma.order.findMany();
  for (const o of orders) {
    if (o.total < 5000) {
      await prisma.order.update({
        where: { id: o.id },
        data: { total: o.total * CONVERSION_RATE }
      });
    }
  }

  const orderItems = await prisma.orderItem.findMany();
  for (const item of orderItems) {
    if (item.price < 5000) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          price: item.price * CONVERSION_RATE,
          costPrice: item.costPrice * CONVERSION_RATE
        }
      });
    }
  }

  console.log('Migration complete!');
  await prisma.$disconnect();
}

migrateToFCFA();
