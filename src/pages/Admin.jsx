import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductsContext } from '../context/ProductsContext';
import { ShopContext } from '../context/ShopContext';
import Login from './admin/Login';
import MusicTab from './admin/MusicTab';
import PromoTab from './admin/PromoTab';
import ReviewTab from './admin/ReviewTab';
import SettingsTab from './admin/SettingsTab';
import CustomersTab from './admin/CustomersTab';
import DashboardTab from './admin/DashboardTab';
import OrdersTab from './admin/OrdersTab';
import ProductsTab from './admin/ProductsTab';
import { Home, Package, ShoppingBag, Users, Star, Ticket, Mail, BarChart2, Settings, LogOut, Bell, Music, Copy, Check, Menu, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const { adminToken, logoutAdmin } = useContext(ShopContext);
  const { products, refreshProducts } = useContext(ProductsContext);


  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const lastOrderCountRef = useRef(null);
  
  // Analytics State
  const [analytics, setAnalytics] = useState({ views: {}, cart: {}, daily: {} });
  const [selectedDate, setSelectedDate] = useState('total');
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Newsletter State
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Load Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        lastOrderCountRef.current = data.length;
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingOrders(false);
  };

  // Load Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingAnalytics(false);
  };

  // Load Newsletter
  const fetchNewsletter = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/newsletter', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingSubscribers(false);
  };

  useEffect(() => {
    if (adminToken) {
      fetchOrders();
      fetchAnalytics();
      fetchNewsletter();
    }
  }, [adminToken]);

  // Polling for new orders
  useEffect(() => {
    const pollOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          // If we have a previous count and the new count is higher, trigger notification
          if (lastOrderCountRef.current !== null && data.length > lastOrderCountRef.current) {
            if (notificationsEnabled) {
              const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
              audio.play().catch(e => console.error("Erreur audio:", e));
              if (Notification.permission === 'granted') {
                new Notification("Nouvelle commande !", { body: "Une nouvelle commande est arrivée sur Kaïa Sun." });
              }
            }
          }
          lastOrderCountRef.current = data.length;
          // Always update orders state so Dashboard/OrdersTab are live
          setOrders(data);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    // Poll every 15 seconds
    const interval = setInterval(pollOrders, 15000);
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          alert("Notifications activées ! Laissez cet onglet ouvert pour entendre le son des nouvelles commandes.");
        } else {
          alert("Vous avez refusé les notifications.");
        }
      });
    } else {
      // Fallback: just enable sound
      setNotificationsEnabled(true);
      alert("Son activé ! Laissez cet onglet ouvert.");
    }
  };

  if (!adminToken) {
    return <Login />;
  }

  // Handle Orders
  const updateOrderStatus = async (id, status) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id, status })
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm("Voulez-vous vraiment supprimer toutes les commandes ? Cette action est irréversible.")) return;
    try {
      await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'products', label: 'Produits', icon: <Package size={18} /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={18} /> },
    { id: 'customers', label: 'Clients', icon: <Users size={18} /> },
    { id: 'reviews', label: 'Avis Clients', icon: <Star size={18} /> },
    { id: 'promocodes', label: 'Codes Promo', icon: <Ticket size={18} /> },
    { id: 'newsletter', label: 'Newsletter', icon: <Mail size={18} /> },
    { id: 'analytics', label: 'Statistiques', icon: <BarChart2 size={18} /> },
    { id: 'music', label: 'Ambiance', icon: <Music size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-layout">
      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: #FAFAFA; font-family: Inter, sans-serif; }
        .admin-sidebar { width: 260px; background: #0A0A0A; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 100; transition: transform 0.3s ease; }
        .admin-main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left 0.3s ease; min-width: 0; }
        .admin-topbar { height: 80px; background: #fff; border-bottom: 1px solid #eaeaea; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 90; }
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; color: #111; padding: 8px; margin-left: -16px; }
        .admin-content { padding: 40px; flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; min-width: 0; }
        .sidebar-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 99; }
        
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; padding-bottom: 80px; }
          .admin-topbar { padding: 0 20px; }
          .mobile-menu-btn { display: none !important; }
          .admin-content { padding: 20px; }
          .sidebar-overlay.open { display: block; }
          
          .admin-bottom-bar {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top: 1px solid #eaeaea;
            z-index: 98;
            padding: 0 10px;
            padding-bottom: env(safe-area-inset-bottom);
            justify-content: space-around;
            align-items: center;
          }
          .admin-bottom-bar button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #a3a3a3;
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            gap: 4px;
            position: relative;
            cursor: pointer;
          }
          .admin-bottom-bar button.active {
            color: #D4AF37;
          }
          
          /* Native App Responsive Tables */
          .responsive-table { width: 100% !important; min-width: 0 !important; border: none !important; }
          .responsive-table thead { display: none; }
          .responsive-table tbody { display: flex; flex-direction: column; gap: 16px; }
          .responsive-table tr { display: flex; flex-direction: column; border: 1px solid #eaeaea; border-radius: 12px; padding: 16px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
          .responsive-table td { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 !important; border-bottom: 1px solid #f5f5f5 !important; text-align: right; white-space: normal !important; }
          .responsive-table td:last-child { border-bottom: none !important; }
          .responsive-table td::before { content: attr(data-label); font-weight: 600; font-size: 0.75rem; color: #888; text-transform: uppercase; margin-right: 16px; text-align: left; }
          .responsive-table td > div { text-align: right; }
          
          /* Native App Responsive Flex Rows (for Products/Music) */
          .responsive-flex-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .responsive-flex-row > div { width: 100% !important; justify-content: flex-start !important; text-align: left !important; }
          .responsive-flex-row > div:last-child { justify-content: space-between !important; }
        }
        .admin-bottom-bar {
          display: none;
        }
      `}</style>
      
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      <div className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {/* SIDEBAR */}
      <div className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', color: '#D4AF37', textTransform: 'uppercase' }}>
              KAÏA
            </h2>
            <div style={{ fontSize: '0.65rem', letterSpacing: '4px', marginTop: '4px', color: '#888' }}>SUNGLASSES</div>
          </div>
          <button className="mobile-menu-btn" style={{ color: '#fff', marginLeft: 0 }} onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px',
                background: activeTab === item.id ? '#D4AF37' : 'transparent',
                color: activeTab === item.id ? '#111' : '#a3a3a3',
                border: 'none', borderRadius: '12px', fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '0.9rem'
              }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.color = '#a3a3a3'; }}
            >
              {item.icon}
              {item.label}
              
              {/* Unread dot for orders if new ones exist (optional enhancement) */}
              {item.id === 'orders' && orders.some(o => o.status === 'Nouvelle') && (
                <span style={{ marginLeft: 'auto', background: activeTab === 'orders' ? '#111' : '#D4AF37', color: activeTab === 'orders' ? '#D4AF37' : '#111', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                  {orders.filter(o => o.status === 'Nouvelle').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
              KA
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>KAÏA SUN</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Administrateur</div>
            </div>
          </div>
          <button
            onClick={logoutAdmin}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px',
              background: 'transparent', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px', fontWeight: 600, cursor: 'pointer', justifyContent: 'center',
              fontSize: '0.85rem', transition: 'background 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        
        {/* Top Header */}
        <div className="admin-topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
            <button 
              onClick={requestNotifications}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: notificationsEnabled ? '#f0fdf4' : '#fff',
                color: notificationsEnabled ? '#15803d' : '#666', border: '1px solid', borderColor: notificationsEnabled ? '#bbf7d0' : '#eaeaea',
                padding: '8px 16px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              <Bell size={16} />
              {notificationsEnabled ? 'Notifications Actives' : 'Activer Notifications'}
            </button>
            <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="admin-content">
          {activeTab === 'dashboard' && <DashboardTab orders={orders} products={products} />}
          {activeTab === 'orders' && <OrdersTab 
            orders={orders} 
            loadingOrders={loadingOrders} 
            updateOrderStatus={updateOrderStatus} 
            deleteAllOrders={deleteAllOrders}
            products={products} 
          />}
          {activeTab === 'products' && <ProductsTab products={products} refreshProducts={refreshProducts} />}
          
          {/* Legacy components injected cleanly */}
          <div style={{ display: activeTab === 'promocodes' ? 'block' : 'none' }}>
            <PromoTab adminToken={adminToken} />
          </div>
          <div style={{ display: activeTab === 'reviews' ? 'block' : 'none' }}>
            <ReviewTab adminToken={adminToken} />
          </div>
          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            <SettingsTab adminToken={adminToken} />
          </div>
          <div style={{ display: activeTab === 'customers' ? 'block' : 'none' }}>
            <CustomersTab adminToken={adminToken} />
          </div>
          <div style={{ display: activeTab === 'music' ? 'block' : 'none' }}>
            <MusicTab adminToken={adminToken} />
          </div>
          <div style={{ display: activeTab === 'newsletter' ? 'block' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111' }}>💌 Newsletter</h2>
              <button 
                onClick={copyEmails}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', background: copied ? '#f0fdf4' : '#111',
                  color: copied ? '#15803d' : '#fff', border: copied ? '1px solid #bbf7d0' : 'none',
                  padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copié !' : 'Copier les emails'}
              </button>
            </div>
            {loadingSubscribers ? <p>Chargement...</p> : (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <p style={{ margin: '0 0 16px 0', fontWeight: 600 }}>{subscribers.length} abonnés</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {subscribers.map((sub, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '12px 16px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '0.9rem', color: '#333' }}>
                      <span>{sub.email}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(sub.email);
                          alert('Email copié !');
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}
                        title="Copier cet email"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Analytics restored */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#111' }}>📊 Statistiques Détaillées</h2>
            
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Interactions (Vues vs Ajouts Panier)</h3>
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', background: '#fafafa', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <option value="total">Total du mois</option>
                  {analytics.daily && Object.keys(analytics.daily).sort((a, b) => new Date(b) - new Date(a)).map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</option>
                  ))}
                </select>
              </div>
              
              {loadingAnalytics ? <p>Chargement des statistiques...</p> : (
                <>
                  {(() => {
                    const dataSource = selectedDate === 'total' ? analytics : (analytics.daily?.[selectedDate] || { views: {}, cart: {} });
                    
                    const viewsKeys = Object.keys(dataSource.views || {});
                    const cartKeys = Object.keys(dataSource.cart || {});
                    const allKeys = Array.from(new Set([...viewsKeys, ...cartKeys]));

                    const chartData = allKeys.map(key => {
                      const prod = products.find(p => p.ref === key || p.id === key);
                      return {
                        name: prod?.ref || key,
                        vues: dataSource.views?.[key] || 0,
                        paniers: dataSource.cart?.[key] || 0
                      };
                    }).filter(d => d.vues > 0 || d.paniers > 0);
                    
                    if (chartData.length === 0) {
                      return <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Aucune donnée d'interaction pour cette période.</p>;
                    }
                    
                    return (
                      <div style={{ width: '100%', height: '450px', minWidth: 300, minHeight: 400 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                          <Tooltip cursor={{ fill: '#fafafa' }} contentStyle={{ borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="vues" name="👀 Vues" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="paniers" name="🛒 Ajouts au panier" fill="#111" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM APP BAR */}
      <div className="admin-bottom-bar">
        <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={activeTab === 'dashboard' ? 'active' : ''}>
          <Home size={22} strokeWidth={1.5} />
          Accueil
        </button>
        <button onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }} className={activeTab === 'products' ? 'active' : ''}>
          <Package size={22} strokeWidth={1.5} />
          Produits
        </button>
        <button onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }} className={activeTab === 'orders' ? 'active' : ''}>
          <ShoppingBag size={22} strokeWidth={1.5} />
          Commandes
          {orders.some(o => o.status === 'Nouvelle') && (
            <span style={{
              position: 'absolute', top: '-5px', right: '5px', background: '#111', color: '#D4AF37', fontSize: '9px', fontWeight: 900, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {orders.filter(o => o.status === 'Nouvelle').length}
            </span>
          )}
        </button>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={22} strokeWidth={1.5} />
          Menu
        </button>
      </div>
    </div>
  );
};

export default Admin;
