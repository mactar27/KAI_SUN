const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- PRODUCTS API ---

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const product = await prisma.product.create({
    data: req.body
  });
  res.json(product);
});

app.put('/api/products/:id', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  await prisma.product.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

// --- ORDERS API ---

app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Re-format pour correspondre au format du Frontend
  const formattedOrders = orders.map(order => ({
    id: order.id,
    date: order.date.toISOString(),
    total: order.total,
    deliveryInfo: {
      prenom: order.prenom,
      nom: order.nom,
      adresse: order.adresse,
      cp: order.cp,
      ville: order.ville
    },
    items: order.items.map(item => ({
      quantity: item.quantity,
      product: {
        ...item.product,
        price: item.price, // Utiliser le snapshot du prix
        costPrice: item.costPrice
      }
    }))
  }));

  res.json(formattedOrders);
});

app.post('/api/orders', async (req, res) => {
  const { deliveryInfo, items, total } = req.body;

  try {
    // Transaction pour créer la commande ET mettre à jour les stocks
    const order = await prisma.$transaction(async (tx) => {
      // 1. Créer la commande
      const newOrder = await tx.order.create({
        data: {
          total,
          prenom: deliveryInfo.prenom,
          nom: deliveryInfo.nom,
          adresse: deliveryInfo.adresse,
          cp: deliveryInfo.cp,
          ville: deliveryInfo.ville,
          items: {
            create: items.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              costPrice: item.product.costPrice
            }))
          }
        }
      });

      // 2. Mettre à jour les stocks
      for (const item of items) {
        await tx.product.update({
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

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// --- STATS API (Visitors) ---

app.get('/api/stats', async (req, res) => {
  const visits = await prisma.dailyVisit.findMany({
    orderBy: { date: 'asc' }
  });
  
  const totalVisitors = visits.reduce((sum, v) => sum + v.count, 0) + 1240; // Base history 1240
  
  res.json({
    visitors: totalVisitors,
    daily: visits
  });
});

app.post('/api/stats/visit', async (req, res) => {
  // Obtenir la date du jour à minuit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await prisma.dailyVisit.upsert({
    where: { date: today },
    update: { count: { increment: 1 } },
    create: { date: today, count: 1 }
  });
  
  // Renvoyer les stats globales mises à jour
  const allVisits = await prisma.dailyVisit.findMany();
  const totalVisitors = allVisits.reduce((sum, v) => sum + v.count, 0) + 1240;
  
  res.json({ visitors: totalVisitors });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
