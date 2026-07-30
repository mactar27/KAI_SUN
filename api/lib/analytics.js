import pool from '../db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get total counts
      const [totalStats] = await pool.query(`
        SELECT event_type, product_ref, COUNT(*) as count 
        FROM analytics 
        GROUP BY event_type, product_ref
      `);
      
      // Get daily counts for the last 30 days
      const [dailyStats] = await pool.query(`
        SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, event_type, product_ref, COUNT(*) as count 
        FROM analytics 
        WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d'), event_type, product_ref
        ORDER BY date ASC
      `);
      
      const result = { 
        views: {}, 
        cart: {},
        daily: {}
      };
      
      // Populate totals
      totalStats.forEach(row => {
        if (row.event_type === 'view') result.views[row.product_ref] = row.count;
        if (row.event_type === 'cart') result.cart[row.product_ref] = row.count;
      });
      
      // Populate daily
      dailyStats.forEach(row => {
        if (!result.daily[row.date]) result.daily[row.date] = { views: {}, cart: {} };
        if (row.event_type === 'view') result.daily[row.date].views[row.product_ref] = row.count;
        if (row.event_type === 'cart') result.daily[row.date].cart[row.product_ref] = row.count;
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
