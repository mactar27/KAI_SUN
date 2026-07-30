import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';

const OrdersTab = ({ orders, loadingOrders, updateOrderStatus, products }) => {
  const getWhatsAppLink = (order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('221') ? cleanPhone : '221' + cleanPhone;
    const msg = encodeURIComponent(`Bonjour ${order.customer_name},\n\nNous avons bien reçu votre commande chez KAIA SUN d'un montant de ${order.total_amount} FCFA.\nVotre commande est en cours de traitement. N'hésitez pas si vous avez des questions !`);
    return `https://wa.me/${phone}?text=${msg}`;
  };

  const getStatusBadgeStyle = (status) => {
    if (status === 'Nouvelle') return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
    if (status === 'En cours') return { background: '#fefce8', color: '#a16207', border: '1px solid #fef08a' };
    if (status === 'Livrée') return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    if (status === 'Annulée') return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
  };

  if (loadingOrders) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Chargement des commandes...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <p style={{ margin: 0, color: '#666' }}>Aucune commande pour le moment.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #eaeaea' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>Toutes les commandes</h2>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #eaeaea' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>Commande</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>Client</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>Produits</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>Total</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>Statut</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600, letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
              const firstItem = order.items?.[0];
              const firstProduct = firstItem ? products.find(p => p.id === firstItem.product_id) : null;
              
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #eaeaea', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  {/* Commande */}
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#111' }}>#{order.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                      {new Date(order.created_at || order.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  
                  {/* Client */}
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#333' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px', whiteSpace: 'nowrap' }}>{order.phone}</div>
                  </td>
                  
                  {/* Produits */}
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {firstProduct && (
                        <img src={firstProduct.image + '?width=40&height=40'} alt="product" style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '1px solid #eaeaea' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{firstProduct ? firstProduct.ref : 'Produit'}</div>
                        {totalItems > 1 && (
                          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>+ {totalItems - 1} autre(s)</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Total */}
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#111' }}>
                    {order.total_amount?.toLocaleString() || order.total?.toLocaleString()} FCFA
                  </td>
                  
                  {/* Statut */}
                  <td style={{ padding: '20px 24px' }}>
                    <select 
                      value={order.status || 'Nouvelle'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ 
                        ...getStatusBadgeStyle(order.status || 'Nouvelle'),
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        textAlign: 'center'
                      }}
                    >
                      <option value="Nouvelle">Nouvelle</option>
                      <option value="En cours">En cours</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </td>
                  
                  {/* Actions */}
                  <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <a 
                        href={getWhatsAppLink(order)} 
                        target="_blank" 
                        rel="noreferrer"
                        title="Contacter sur WhatsApp"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#e0f2f1', color: '#00897b', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
                      >
                        <MessageCircle size={18} />
                      </a>
                      <Link 
                        to={`/admin/invoice/${order.id}`} 
                        target="_blank" 
                        title="Générer Facture"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#f3f4f6', color: '#4b5563', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
                      >
                        <FileText size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
