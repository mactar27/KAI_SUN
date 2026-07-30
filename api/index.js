import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { handleUpload } from '@vercel/blob/client';
import pool from './db.js';

// Force explicit TiDB connection string to guarantee sslaccept=strict is present
// because the user's Vercel DATABASE_URL might be missing it.
const dbUrl = process.env.TIDB_USER 
  ? `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:4000/${process.env.TIDB_DATABASE}?sslaccept=strict` 
  : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  ...(dbUrl && { datasources: { db: { url: dbUrl } } })
});
const app = express();

app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: true }));

// --- AUTH MIDDLEWARE ---
const ADMIN_PASSWORD = 'Pita999!!';
const ADMIN_TOKEN = 'kaia-admin-token-2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ')[1] === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Accès non autorisé' });
  }
};

// --- AUTHENTICATION API ---
app.post('/api/auth/login', (req, res) => {
  try {
    const password = req.body?.password;
    if (password && password.trim() === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error: ' + error.message });
  }
});

// --- PRODUCTS API ---

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', authMiddleware, async (req, res) => {
  const product = await prisma.product.create({
    data: req.body
  });
  res.json(product);
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const product = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(product);
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  await prisma.product.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

// --- ORDERS API ---

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            products: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Re-format pour correspondre au format du Frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      date: order.created_at ? order.created_at.toISOString() : new Date().toISOString(),
      total: order.total_amount,
      status: order.status || 'Nouvelle',
      deliveryInfo: {
        prenom: order.customer_name.split(' ')[0] || '',
        nom: order.customer_name.split(' ').slice(1).join(' ') || '',
        adresse: order.address,
        phone: order.phone,
        ville: 'Dakar'
      },
      items: order.order_items.map(item => ({
        quantity: item.quantity,
        product: {
          ...(item.products || {}),
          price: item.products ? item.products.price : 0,
          costPrice: 0
        }
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('GET /api/orders Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { deliveryInfo, items, total, promoCodeId } = req.body;

  try {
    // Transaction pour créer la commande ET mettre à jour les stocks
    const order = await prisma.$transaction(async (tx) => {
      // 1. Créer la commande
      const newOrder = await tx.orders.create({
        data: {
          total_amount: total,
          customer_name: [deliveryInfo.prenom, deliveryInfo.nom].filter(Boolean).join(' ') || 'Inconnu',
          address: deliveryInfo.adresse || 'Inconnue',
          phone: deliveryInfo.phone || 'Inconnu',
          order_items: {
            create: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity
            }))
          }
        }
      });

      // 2. Mettre à jour les stocks
      for (const item of items) {
        await tx.products.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 3. Désactiver le code promo si utilisé (usage unique)
      if (promoCodeId) {
        await tx.promoCode.update({
          where: { id: promoCodeId },
          data: { isActive: false }
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

// --- ANALYTICS API ---

app.get('/api/analytics', authMiddleware, async (req, res) => {
  try {
    const [totalStats] = await pool.query(`
      SELECT event_type, product_ref, COUNT(*) as count 
      FROM analytics 
      GROUP BY event_type, product_ref
    `);
    const [dailyStats] = await pool.query(`
      SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, event_type, product_ref, COUNT(*) as count 
      FROM analytics 
      WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d'), event_type, product_ref
      ORDER BY date ASC
    `);
    const result = { views: {}, cart: {}, daily: {} };
    totalStats.forEach(row => {
      if (row.event_type === 'view') result.views[row.product_ref] = row.count;
      if (row.event_type === 'cart') result.cart[row.product_ref] = row.count;
    });
    dailyStats.forEach(row => {
      if (!result.daily[row.date]) result.daily[row.date] = { views: {}, cart: {} };
      if (row.event_type === 'view') result.daily[row.date].views[row.product_ref] = row.count;
      if (row.event_type === 'cart') result.daily[row.date].cart[row.product_ref] = row.count;
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analytics', async (req, res) => {
  try {
    const { event_type, product_ref } = req.body;
    if (!event_type || !product_ref) return res.status(400).json({ error: 'Missing parameters' });
    await pool.query('INSERT INTO analytics (event_type, product_ref) VALUES (?, ?)', [event_type, product_ref]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// --- CHAT API ---

app.post('/api/chat', async (req, res) => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' });
    const [products] = await pool.query('SELECT * FROM products');
    const catalogText = products.map(p => `- Modèle: ${p.name} (Réf: ${p.ref}, Genre: ${p.gender})`).join('\n');
    const systemInstruction = `Tu es l'assistant virtuel de KAÏA SUNGLASSES, une marque premium basée à Dakar. Réponds en français, avec un ton chic et chaleureux. Prix unique: 25 000 FCFA. Catalogue: ${catalogText}`;
    const geminiMessages = messages.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] }));
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: geminiMessages, config: { systemInstruction, temperature: 0.7 } });
    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
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
// --- MUSIC API ---
app.get('/api/music', async (req, res) => {
  try {
    const tracks = await prisma.musicTrack.findMany();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/music', authMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;
    const count = await prisma.musicTrack.count();
    const track = await prisma.musicTrack.create({
      data: { title, url, isActive: count === 0 }
    });
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/music/:id/activate', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.musicTrack.updateMany({ data: { isActive: false } });
    const track = await prisma.musicTrack.update({
      where: { id },
      data: { isActive: true }
    });
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/music/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.musicTrack.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPLOAD API ---
app.post('/api/upload-music', async (request, response) => {
  const body = request.body;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['audio/mpeg', 'audio/webm', 'audio/wav', 'audio/ogg', 'video/webm', 'audio/mp4', 'audio/x-m4a'],
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload completed:", blob.url);
      },
    });
    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// --- NEWSLETTER API ---
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email manquant' });
    
    // Create or ignore if already exists (using Prisma)
    // To handle unique constraint failure, we can upsert or catch error
    const subscriber = await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email }
    });
    
    res.json({ success: true, subscriber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/newsletter', authMiddleware, async (req, res) => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// --- PROMO CODES API ---
app.get('/api/promocodes', authMiddleware, async (req, res) => {
  try {
    const codes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(codes);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/promocodes', authMiddleware, async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    const newCode = await prisma.promoCode.create({ data: { code: code.toUpperCase(), discountPercent: parseInt(discountPercent) } });
    res.json(newCode);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/promocodes/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive } = req.body;
    const updated = await prisma.promoCode.update({ where: { id }, data: { isActive } });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/promocodes/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.promoCode.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/promocodes/validate', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Code manquant' });
    const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (!promo || !promo.isActive) return res.status(404).json({ error: 'Code invalide ou expiré' });
    res.json(promo);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- REVIEWS API ---
app.get('/api/reviews', async (req, res) => {
  try {
    const { productId, all } = req.query;
    const where = {};
    if (productId) where.productId = productId;
    if (all !== 'true') where.isApproved = true; // Public only sees approved

    const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(reviews);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, authorName, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { productId, authorName, rating: parseInt(rating), comment }
    });
    res.json(review);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/reviews/:id/approve', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isApproved } = req.body;
    const review = await prisma.review.update({ where: { id }, data: { isApproved } });
    res.json(review);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/reviews/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.review.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- SITE SETTINGS API ---
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Convert array to key-value object
    const settingsObj = settings.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
    res.json(settingsObj);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(setting);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Erreur interne du serveur',
    details: err.message 
  });
});

const PORT = 3000;
// Pour Vercel : Exporter l'application au lieu d'écouter un port
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('🚀 Backend running on http://localhost:3000');
  });
}

export default app;
