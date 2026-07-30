import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';

const OrdersTab = ({ orders, loadingOrders, updateOrderStatus, products }) => {
  const getWhatsAppLink = (order) => {
    const phone = (order.deliveryInfo?.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('221') ? phone : '221' + phone;
    const fullName = `${order.deliveryInfo?.prenom || ''} ${order.deliveryInfo?.nom || ''}`.trim() || 'Client';
    const msg = encodeURIComponent(`Bonjour ${fullName},\n\nNous avons bien reçu votre commande chez KAIA SUN d'un montant de ${order.total} FCFA.\nVotre commande est en cours de traitement. N'hésitez pas si vous avez des questions !`);
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  const statusConfig = {
    'En attente': { bg: '#fefce8', color: '#a16207', border: '#fef08a', label: 'En attente', nextStatus: 'Préparation', actionLabel: 'Préparer', actionIcon: 'Package' },
    'Préparation': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'En préparation', nextStatus: 'Livrée', actionLabel: 'Valider', actionIcon: 'Check' },
    'Livrée': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Livrée', nextStatus: null, actionLabel: null, actionIcon: null },
    'Nouvelle': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Nouvelle (Alerte)', nextStatus: 'En attente', actionLabel: 'Traiter', actionIcon: 'ArrowRight' }
  };

  const getStatusStyle = (status) => {
    const conf = statusConfig[status] || statusConfig['Nouvelle'];
    return { background: conf.bg, color: conf.color, border: `1px solid ${conf.border}` };
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
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
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
              const firstProduct = firstItem?.product;
              
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #eaeaea', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  {/* Commande */}
                  <td data-label="Commande" style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#111' }}>#{order.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  
                  {/* Client */}
                  <td data-label="Client" style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#333' }}>{`${order.deliveryInfo?.prenom || ''} ${order.deliveryInfo?.nom || ''}`.trim() || 'Inconnu'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px', whiteSpace: 'nowrap' }}>{order.deliveryInfo?.phone || 'Inconnu'}</div>
                  </td>
                  
                  {/* Produits */}
                  <td data-label="Produits" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {firstProduct && firstProduct.image && (
                        <img src={firstProduct.image + '?width=40&height=40'} alt="product" style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '1px solid #eaeaea' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{firstProduct ? (firstProduct.ref || firstProduct.name) : 'Produit'}</div>
                        {totalItems > 1 && (
                          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>+ {totalItems - 1} autre(s)</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Total */}
                  <td data-label="Total" style={{ padding: '20px 24px', fontWeight: 700, color: '#111' }}>
                    {order.total?.toLocaleString()} FCFA
                  </td>
                  
                  <td data-label="Statut" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, ...getStatusStyle(order.status || 'Nouvelle') }}>
                      {(statusConfig[order.status] || statusConfig['Nouvelle']).label}
                    </div>
                  </td>
                  
                  <td data-label="Actions" style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                      {(() => {
                        const currentStatus = order.status || 'Nouvelle';
                        const conf = statusConfig[currentStatus];
                        if (conf && conf.nextStatus) {
                          return (
                            <button
                              onClick={() => updateOrderStatus(order.id, conf.nextStatus)}
                              style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, 
                                borderRadius: '8px', cursor: 'pointer', border: 'none',
                                background: currentStatus === 'Préparation' ? '#22c55e' : '#111', 
                                color: '#fff', transition: 'opacity 0.2s' 
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                              onMouseLeave={e => e.currentTarget.style.opacity = 1}
                            >
                              {conf.actionLabel}
                            </button>
                          );
                        }
                        return null;
                      })()}
                      
                      <div style={{ width: '1px', height: '24px', background: '#eaeaea', margin: '0 4px' }}></div>
                      
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
