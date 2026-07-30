import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deliveryInfo = {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    phone: '123456789',
    city: 'Dakar'
  };
  const items = [
    {
      product: { id: 'NDL8298', price: 10000, costPrice: 5000 },
      quantity: 1
    }
  ];
  const total = 10000;
  
  try {
    const order = await prisma.$transaction(async (tx) => {
      console.log('Creating order...');
      const newOrder = await tx.orders.create({
        data: {
          total_amount: total,
          customer_name: (deliveryInfo.firstName + ' ' + deliveryInfo.lastName).trim() || 'Inconnu',
          address: deliveryInfo.address || 'Inconnue',
          phone: deliveryInfo.phone || 'Inconnu',
          order_items: {
            create: items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity
            }))
          }
        }
      });
      console.log('Order created:', newOrder.id);
      
      console.log('Updating stock...');
      for (const item of items) {
        await tx.products.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      return newOrder;
    });
    console.log('Success!', order);
  } catch (e) {
    console.error('TRANSACTION ERROR:', e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
