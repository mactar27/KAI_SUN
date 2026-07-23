import pool from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      const [items] = await pool.query('SELECT * FROM order_items');
      
      const ordersMap = orders.map(o => ({
        ...o,
        items: items.filter(i => i.order_id === o.id)
      }));
      
      return res.status(200).json(ordersMap);
    }
    
    if (req.method === 'POST') {
      const { customer_name, phone, address, total_amount, items } = req.body;
      
      const [result] = await pool.query(
        'INSERT INTO orders (customer_name, phone, address, total_amount) VALUES (?, ?, ?, ?)',
        [customer_name, phone, address, total_amount]
      );
      
      const orderId = result.insertId;
      
      if (items && items.length > 0) {
        for (const item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
            [orderId, item.id, item.quantity]
          );
        }
      }
      
      return res.status(201).json({ success: true, orderId });
    }
    
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
