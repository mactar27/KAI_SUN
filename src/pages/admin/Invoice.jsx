import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { ProductsContext } from '../../context/ProductsContext';
import { Printer, ArrowLeft } from 'lucide-react';

const Invoice = () => {
  const { id } = useParams();
  const { adminToken } = useContext(ShopContext);
  const { products } = useContext(ProductsContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          const found = data.find(o => o.id === parseInt(id));
          setOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, adminToken]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement de la facture...</div>;
  if (!order) return <div style={{ padding: '50px', textAlign: 'center' }}>Commande introuvable.</div>;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Action Bar (hidden on print) */}
      <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>
        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Printer size={16} /> Imprimer / PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div className="invoice-document" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '60px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #111', paddingBottom: '30px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>KAÏA</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', letterSpacing: '2px', textTransform: 'uppercase' }}>Sunglasses</p>
            <div style={{ marginTop: '20px', color: '#444', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Dakar, Sénégal<br/>
              Contact: contact@kaiasun.com<br/>
              N° RCCM: SN-DKR-2026-X-1234
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#111' }}>FACTURE</h2>
            <div style={{ color: '#444', fontSize: '1rem', lineHeight: '1.6' }}>
              <strong>N° Commande :</strong> #{order.id}<br/>
              <strong>Date :</strong> {new Date(order.created_at || order.date).toLocaleDateString('fr-FR')}<br/>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Facturé à</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginTop: '12px' }}>{order.customer_name}</div>
          <div style={{ color: '#444', marginTop: '4px' }}>{order.address}</div>
          <div style={{ color: '#444', marginTop: '4px' }}>Tél : {order.phone}</div>
        </div>

        {/* Order Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #111' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #111' }}>Qté</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #111' }}>Prix Unitaire</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #111' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => {
              const p = products.find(prod => prod.id === item.product_id);
              const unitPrice = p ? p.price : 25000;
              const rowTotal = unitPrice * item.quantity;
              return (
                <tr key={index}>
                  <td style={{ padding: '16px 12px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 600 }}>{p ? p.name : `Produit ${item.product_id}`}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Réf: {p ? p.ref : item.product_id}</div>
                  </td>
                  <td style={{ padding: '16px 12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{unitPrice.toLocaleString()} FCFA</td>
                  <td style={{ padding: '16px 12px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{rowTotal.toLocaleString()} FCFA</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}>
              <span>Sous-total</span>
              <span>{order.total_amount?.toLocaleString() || order.total?.toLocaleString()} FCFA</span>
            </div>
            {/* Promo deduction would be complex to reconstruct here without saving it in the db, so we just show the final amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #111', fontWeight: 900, fontSize: '1.3rem', marginTop: '8px' }}>
              <span>Total TTC</span>
              <span>{order.total_amount?.toLocaleString() || order.total?.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center', color: '#888', fontSize: '0.85rem', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          Merci pour votre confiance ! <br/>
          Pour toute question concernant cette facture, veuillez nous contacter à contact@kaiasun.com.
        </div>
      </div>
      
      {/* CSS for printing */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .invoice-document { box-shadow: none !important; padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
