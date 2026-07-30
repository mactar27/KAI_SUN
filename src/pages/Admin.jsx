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
import { Home, Package, ShoppingBag, Users, Star, Ticket, Mail, BarChart2, Settings, LogOut, Bell, Music } from 'lucide-react';

const Admin = () => {
  const { adminToken, logoutAdmin } = useContext(ShopContext);
  const { products, refreshProducts } = useContext(ProductsContext);

  if (!adminToken) {
    return <Login />;
  }

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', etc.
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const lastOrderCountRef = useRef(null);
  
  // Analytics State
  const [analytics, setAnalytics] = useState({ views: {}, cart: {} });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Newsletter State
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // Load Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
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
      const res = await fetch('/api/analytics');
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
    fetchOrders();
    fetchAnalytics();
    fetchNewsletter();
  }, []);

  // Polling for new orders
  useEffect(() => {
    const pollOrders = async () => {
      try {
        const res = await fetch('/api/orders');
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

  // Handle Orders
  const updateOrderStatus = async (id, status) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#0A0A0A', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', color: '#D4AF37', textTransform: 'uppercase' }}>
            KAÏA
          </h2>
          <div style={{ fontSize: '0.65rem', letterSpacing: '4px', marginTop: '4px', color: '#888' }}>SUNGLASSES</div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
              MN
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Administrateur</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Mactar Ndiaye</div>
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
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Top Header */}
        <div style={{ height: '80px', background: '#fff', borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px', position: 'sticky', top: 0, zIndex: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
        <div style={{ padding: '40px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {activeTab === 'dashboard' && <DashboardTab orders={orders} products={products} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} loadingOrders={loadingOrders} updateOrderStatus={updateOrderStatus} products={products} />}
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#111' }}>💌 Newsletter</h2>
            {loadingSubscribers ? <p>Chargement...</p> : (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <p style={{ margin: '0 0 16px 0', fontWeight: 600 }}>{subscribers.length} abonnés</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                  {subscribers.map((sub, i) => (
                    <div key={i} style={{ background: '#fafafa', padding: '12px 16px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '0.9rem', color: '#333' }}>
                      {sub.email}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* We dropped 'analytics' tab from here because we built a robust dashboard, but we can still render the legacy bar chart if needed, 
              but the dashboard is much better. Let's just leave it empty or map it to the old view */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#111' }}>📊 Statistiques Détaillées</h2>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <p>Les statistiques de vente globales sont désormais sur le <strong>Dashboard</strong>. 
                <br/><br/>
                <em>Note: Les graphiques d'interactions approfondis seront migrés ici prochainement.</em></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
