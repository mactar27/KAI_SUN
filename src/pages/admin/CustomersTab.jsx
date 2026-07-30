import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react';

const CustomersTab = () => {
  const { orders } = useContext(ShopContext);

  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach(order => {
      const phone = order.phone || 'Inconnu';
      if (!map.has(phone)) {
        map.set(phone, {
          phone: phone,
          name: order.customer_name || 'Inconnu',
          address: order.address || 'Inconnu',
          totalSpent: 0,
          orderCount: 0,
          firstOrder: order.created_at || order.date,
          lastOrder: order.created_at || order.date
        });
      }
      const c = map.get(phone);
      c.totalSpent += (order.total_amount || order.total || 0);
      c.orderCount += 1;
      // update last order date
      if (new Date(order.created_at || order.date) > new Date(c.lastOrder)) {
        c.lastOrder = order.created_at || order.date;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Fichier Clients ({customers.length})</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700 }}>Client</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700 }}>Contact</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700 }}>Adresse</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>Commandes</th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>Total Dépensé</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#888' }}>Client depuis le {new Date(c.firstOrder).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
                    <Phone size={16} /> {c.phone}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
                    <MapPin size={16} /> {c.address.split(',')[0]} {/* show only street */}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                    <ShoppingBag size={14} /> {c.orderCount}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem' }}>
                  {c.totalSpent.toLocaleString()} FCFA
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                  Aucun client trouvé pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTab;
