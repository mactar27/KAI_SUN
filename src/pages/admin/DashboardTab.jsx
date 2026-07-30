import React, { useMemo } from 'react';
import { ShoppingBag, DollarSign, Users, Glasses } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const DashboardTab = ({ orders, products }) => {
  // Compute KPIs
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || o.total || 0), 0);
  
  const uniqueClients = useMemo(() => {
    const phones = new Set(orders.map(o => o.phone));
    return phones.size;
  }, [orders]);

  const productsSold = useMemo(() => {
    return orders.reduce((sum, o) => {
      const itemsCount = o.items?.reduce((itemSum, i) => itemSum + i.quantity, 0) || 0;
      return sum + itemsCount;
    }, 0);
  }, [orders]);

  // Compute Chart Data (Last 7 days simplified for mockup)
  const chartData = useMemo(() => {
    // Group orders by day
    const grouped = {};
    orders.forEach(o => {
      const date = new Date(o.created_at || o.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += (o.total_amount || o.total || 0);
    });
    
    // Sort chronologically (assuming orders are mostly recent, for simple display)
    return Object.entries(grouped).map(([date, total]) => ({ date, total })).reverse();
  }, [orders]);

  // Compute Top Products
  const topProducts = useMemo(() => {
    const sales = {};
    orders.forEach(o => {
      o.items?.forEach(item => {
        if (!sales[item.product_id]) sales[item.product_id] = { count: 0, revenue: 0 };
        sales[item.product_id].count += item.quantity;
        sales[item.product_id].revenue += item.quantity * (item.price || 25000);
      });
    });
    return Object.entries(sales)
      .map(([id, data]) => {
        const p = products.find(prod => prod.id === id);
        return {
          id,
          ref: p?.ref || 'Inconnu',
          image: p?.image || '',
          ...data
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  }, [orders, products]);

  // Recent Orders
  const recentOrders = orders.slice(0, 5);

  const getStatusBadgeStyle = (status) => {
    if (status === 'Nouvelle') return { background: '#fef2f2', color: '#b91c1c' };
    if (status === 'En cours') return { background: '#fefce8', color: '#a16207' };
    if (status === 'Livrée') return { background: '#f0fdf4', color: '#15803d' };
    return { background: '#f3f4f6', color: '#374151' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header text */}
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 800, color: '#111' }}>Bonjour, Administrateur</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>Voici un aperçu de votre boutique KAÏA.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[
          { title: "COMMANDES", value: totalOrders, icon: <ShoppingBag size={24} color="#111" />, trend: "+12%" },
          { title: "CHIFFRE D'AFFAIRES", value: `${totalRevenue.toLocaleString()} FCFA`, icon: <DollarSign size={24} color="#111" />, trend: "+28%" },
          { title: "NOUVEAUX CLIENTS", value: uniqueClients, icon: <Users size={24} color="#111" />, trend: "+5%" },
          { title: "PRODUITS VENDUS", value: productsSold, icon: <Glasses size={24} color="#111" />, trend: "+18%" }
        ].map((kpi, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eaeaea' }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', letterSpacing: '0.5px' }}>{kpi.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '4px 0' }}>{kpi.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>{kpi.trend} <span style={{ color: '#aaa', fontWeight: 400 }}>vs mois dernier</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent Orders */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Commandes récentes</h2>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Commande</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Client</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>#{order.id}</td>
                    <td style={{ padding: '16px', color: '#444' }}>{order.customer_name}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{(order.total_amount || order.total || 0).toLocaleString()} FCFA</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ ...getStatusBadgeStyle(order.status || 'Nouvelle'), padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {order.status || 'Nouvelle'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Revenue Chart */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 700 }}>Chiffre d'affaires</h2>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} 
                    formatter={(value) => [`${value.toLocaleString()} FCFA`, 'CA']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 700 }}>Meilleurs produits</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProducts.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: i < topProducts.length - 1 ? '1px solid #eaeaea' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={p.image + '?width=48'} alt={p.ref} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#f5f5f5' }} />
                    <div style={{ fontWeight: 600 }}>{p.ref}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{p.revenue.toLocaleString()} FCFA</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.count} ventes</div>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && <p style={{ color: '#888', margin: 0 }}>Pas assez de données.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
