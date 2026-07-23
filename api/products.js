import pool from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [products] = await pool.query('SELECT * FROM products');
      const [thumbnails] = await pool.query('SELECT * FROM product_thumbnails');
      
      const productsMap = products.map(p => ({
        ...p,
        thumbnails: thumbnails.filter(t => t.product_id === p.id).map(t => t.url)
      }));
      
      return res.status(200).json(productsMap);
    }
    
    if (req.method === 'POST') {
      const { id, ref, name, price, gender, image, groupId, thumbnails } = req.body;
      await pool.query(
        'INSERT INTO products (id, ref, name, price, gender, image, groupId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, ref, name, price, gender, image, groupId || null]
      );
      
      if (thumbnails && thumbnails.length > 0) {
        for (const url of thumbnails) {
          await pool.query('INSERT INTO product_thumbnails (product_id, url) VALUES (?, ?)', [id, url]);
        }
      }
      return res.status(201).json({ success: true });
    }
    
    if (req.method === 'PUT') {
      const { id, groupId, action } = req.body;
      if (action === 'updateGroup') {
        await pool.query('UPDATE products SET groupId = ? WHERE id = ?', [groupId, id]);
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ error: 'Unknown action' });
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
