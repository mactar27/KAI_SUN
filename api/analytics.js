import pool from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get counts of views and cart adds per product
      const [stats] = await pool.query(`
        SELECT event_type, product_ref, COUNT(*) as count 
        FROM analytics 
        GROUP BY event_type, product_ref
      `);
      
      const result = { views: {}, cart: {} };
      stats.forEach(row => {
        if (row.event_type === 'view') result.views[row.product_ref] = row.count;
        if (row.event_type === 'cart') result.cart[row.product_ref] = row.count;
      });
      
      return res.status(200).json(result);
    }
    
    if (req.method === 'POST') {
      const { event_type, product_ref } = req.body;
      
      if (!event_type || !product_ref) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
      
      await pool.query(
        'INSERT INTO analytics (event_type, product_ref) VALUES (?, ?)',
        [event_type, product_ref]
      );
      
      return res.status(201).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
