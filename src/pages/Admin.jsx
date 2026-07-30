import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import { ShopContext } from '../context/ShopContext';
import Login from './admin/Login';
import MusicTab from './admin/MusicTab';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const Admin = () => {
  const { adminToken, logoutAdmin } = useContext(ShopContext);
  const { products, refreshProducts } = useContext(ProductsContext);

  if (!adminToken) {
    return <Login />;
  }
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'analytics'
  
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

  // Group Management State
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState('groups'); // 'groups' | 'select' | 'edit-group'
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  // Load Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
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
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'newsletter') fetchNewsletter();
  }, [activeTab]);

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
          // If user is on the orders tab, silently update the list
          if (activeTab === 'orders') {
            setOrders(data);
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    // Initial fetch to set baseline
    pollOrders();

    // Poll every 15 seconds
    const interval = setInterval(pollOrders, 15000);
    return () => clearInterval(interval);
  }, [activeTab, notificationsEnabled]);

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

  const getWhatsAppLink = (order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('221') ? cleanPhone : '221' + cleanPhone;
    const msg = encodeURIComponent(`Bonjour ${order.customer_name},\n\nNous avons bien reçu votre commande chez KAIA SUN d'un montant de ${order.total_amount} FCFA.\nVotre commande est en cours de traitement. N'hésitez pas si vous avez des questions !`);
    return `https://wa.me/${phone}?text=${msg}`;
  };

  // --- PRODUCTS & GROUPS LOGIC ---
  const groups = {};
  products.forEach(p => {
    const groupKey = p.groupId || p.ref.substring(0, p.ref.length - 1);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(p);
  });

  const filteredProducts = products.filter(p => {
    const matchSearch = p.ref.toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === 'all' || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const groupSelected = async () => {
    if (selected.length < 2) return;
    const newGroupId = 'GRP_' + products.find(p => p.id === selected[0]).ref;
    
    // Call API for each to update group
    for (const id of selected) {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, groupId: newGroupId, action: 'updateGroup' })
      });
    }
    
    await refreshProducts();
    setSelected([]);
    setMode('groups');
  };

  const startEditGroup = (groupId) => {
    const memberIds = (groups[groupId] || []).map(p => p.id);
    setSelected(memberIds);
    setEditingGroupId(groupId);
    setSearch('');
    setFilterGender('all');
    setMode('edit-group');
  };

  const [isSaving, setIsSaving] = useState(false);

  const saveGroupEdit = async () => {
    if (selected.length === 0) return;
    setIsSaving(true);
    
    try {
      const requests = [];
      for (const p of products) {
        const isSelected = selected.includes(p.id);
        const groupKey = p.groupId || p.ref.substring(0, p.ref.length - 1);
        const wasInGroup = groupKey === editingGroupId;
        
        if (isSelected && !wasInGroup) {
          requests.push(fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, groupId: editingGroupId, action: 'updateGroup' })
          }));
        } else if (!isSelected && wasInGroup) {
          requests.push(fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, groupId: 'SOLO_' + p.ref, action: 'updateGroup' })
          }));
        }
      }
      
      if (requests.length > 0) {
        const responses = await Promise.all(requests);
        const failed = responses.filter(r => !r.ok);
        if (failed.length > 0) {
          const errorData = await failed[0].json().catch(() => ({}));
          throw new Error(errorData.error || "Certaines mises à jour ont échoué côté serveur.");
        }
      }
      
      await refreshProducts();
      setSelected([]);
      setEditingGroupId(null);
      setMode('groups');
      alert("✅ Groupe mis à jour avec succès !");
    } catch (e) {
      console.error(e);
      alert("❌ Erreur lors de la modification du groupe : " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const ungroup = async (productId) => {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, groupId: 'SOLO_' + p.ref, action: 'updateGroup' })
    });
    await refreshProducts();
  };

  const deleteGroup = async (groupId) => {
    if (!confirm("Voulez-vous vraiment dégrouper tous ces produits ?")) return;
    const members = groups[groupId] || [];
    const requests = members.map(p => 
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, groupId: 'SOLO_' + p.ref, action: 'updateGroup' })
      })
    );
    await Promise.all(requests);
    await refreshProducts();
  };

  const groupEntries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', background: '#f8f8f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '2px solid #e5e5e5', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', margin: 0 }}>⚙️ Centre de Contrôle</h1>
              <button 
                onClick={requestNotifications}
                style={{ padding: '6px 12px', background: notificationsEnabled ? '#e8f5e9' : '#fff3e0', color: notificationsEnabled ? '#2e7d32' : '#e65100', border: notificationsEnabled ? '1px solid #c8e6c9' : '1px solid #ffe0b2', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {notificationsEnabled ? '🔔 Notifications : ON' : '🔕 Activer les notifs (Son)'}
              </button>
              <button 
                onClick={logoutAdmin}
                style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Se déconnecter
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setActiveTab('products')}
                style={{ padding: '8px 16px', background: activeTab === 'products' ? '#111' : '#eee', color: activeTab === 'products' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                🛍️ Produits
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                style={{ padding: '8px 16px', background: activeTab === 'orders' ? '#111' : '#eee', color: activeTab === 'orders' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                📦 Commandes
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                style={{ padding: '8px 16px', background: activeTab === 'analytics' ? '#111' : '#eee', color: activeTab === 'analytics' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                📊 Statistiques
              </button>
              <button 
                onClick={() => setActiveTab('music')}
                style={{ padding: '8px 16px', background: activeTab === 'music' ? '#111' : '#eee', color: activeTab === 'music' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                🎵 Ambiance Sonore
              </button>
              <button 
                onClick={() => setActiveTab('newsletter')}
                style={{ padding: '8px 16px', background: activeTab === 'newsletter' ? '#111' : '#eee', color: activeTab === 'newsletter' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                💌 Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* --- TAB: MUSIC --- */}
        {activeTab === 'music' && (
          <MusicTab adminToken={adminToken} />
        )}

        {/* --- TAB: ORDERS --- */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? <p>Chargement des commandes...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.length === 0 ? <p>Aucune commande pour le moment.</p> : orders.map(order => (
                  <div key={order.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Commande #{order.id}</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                          Passée le {new Date(order.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', fontWeight: 700, background: order.status === 'Nouvelle' ? '#fee2e2' : order.status === 'Livrée' ? '#dcfce7' : '#f3f4f6' }}
                        >
                          <option value="Nouvelle">🔴 Nouvelle</option>
                          <option value="En cours">🟡 En cours</option>
                          <option value="Livrée">🟢 Livrée</option>
                          <option value="Annulée">⚫️ Annulée</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888', textTransform: 'uppercase' }}>Client</strong>
                        <p style={{ margin: 0, fontWeight: 700 }}>{order.customer_name}</p>
                        <p style={{ margin: '4px 0' }}>📞 {order.phone}</p>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>📍 {order.address}</p>
                        
                        <a 
                          href={getWhatsAppLink(order)} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '8px 16px', background: '#25D366', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
                        >
                          💬 Contacter sur WhatsApp
                        </a>
                      </div>
                      
                      <div>
                        <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#888', textTransform: 'uppercase' }}>Produits</strong>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {order.items?.map(item => (
                            <li key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{item.quantity}x {item.product_id}</span>
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: '16px', fontSize: '1.2rem', fontWeight: 900, textAlign: 'right' }}>
                          Total : {order.total_amount.toLocaleString()} FCFA
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: '#111' }}>Interactions sur le site</h2>
            {loadingAnalytics ? <p>Chargement des statistiques...</p> : (
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', overflow: 'hidden' }}>
                {products.some(p => (analytics.views[p.ref] || 0) > 0 || (analytics.cart[p.ref] || 0) > 0) ? (
                  <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={products.map(p => ({
                          name: p.ref,
                          vues: analytics.views[p.ref] || 0,
                          paniers: analytics.cart[p.ref] || 0,
                        })).filter(d => d.vues > 0 || d.paniers > 0)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="vues" name="👀 Vues" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="paniers" name="🛒 Ajouts au panier" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>Aucune donnée d'interaction pour le moment.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: PRODUCTS & GROUPS --- */}
        {activeTab === 'products' && (
          <>
            {mode === 'groups' && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button
                    onClick={() => { setMode('select'); setSelected([]); setEditingGroupId(null); }}
                    style={{ background: '#fff', color: '#111', border: '2px solid #ddd', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                  >
                    ➕ Nouveau groupe
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {groupEntries.map(([groupId, members]) => (
                    <div key={groupId} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                            background: members.length > 1 ? '#ede9fe' : '#f3f4f6',
                            color: members.length > 1 ? '#7c3aed' : '#6b7280'
                          }}>
                            {members.length > 1 ? `${members.length} coloris` : '1 produit seul'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {members.length > 1 && (
                            <button
                              onClick={() => deleteGroup(groupId)}
                              title="Dégrouper tout"
                              style={{
                                background: '#fef2f2', color: '#b91c1c', border: '1.5px solid #fecaca',
                                padding: '7px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              🗑️
                            </button>
                          )}
                          <button
                            onClick={() => startEditGroup(groupId)}
                            style={{
                              background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #bae6fd',
                              padding: '7px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            ✏️ Modifier le groupe
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {members.map(product => (
                          <div key={product.id} style={{ textAlign: 'center', position: 'relative' }}>
                            <img
                              src={product.image + (product.image.startsWith('http') ? '?width=80&height=80' : '')}
                              alt={product.ref}
                              style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '10px', border: '2px solid #e5e5e5', display: 'block', background: '#f3f4f6' }}
                              onError={e => { e.target.src = 'https://placehold.co/70x70/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                            />
                            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#444', marginTop: '4px', fontWeight: 600 }}>{product.ref}</div>
                            {members.length > 1 && (
                              <button
                                onClick={() => ungroup(product.id)}
                                title="Retirer du groupe"
                                style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}
                              >✕</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* EDIT GROUP MODE */}
            {mode === 'edit-group' && (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800 }}>✏️ Modifier le groupe</h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      <strong>{selected.length} produit(s) sélectionné(s).</strong>
                    </p>
                  </div>
                  <button onClick={saveGroupEdit} disabled={selected.length === 0 || isSaving} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                    {isSaving ? '⏳ Enregistrement...' : '✅ Valider'}
                  </button>
                  <button onClick={() => { setMode('groups'); setSelected([]); setEditingGroupId(null); }} style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                  {products.map(product => {
                    const isSelected = selected.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => toggleSelect(product.id)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '3px solid #16a34a' : '2px solid #e5e5e5',
                          borderRadius: '12px',
                          background: isSelected ? '#f0fdf4' : '#fff',
                          padding: '10px',
                          textAlign: 'center',
                          position: 'relative'
                        }}
                      >
                        {isSelected && <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✓</div>}
                        <img src={product.image + '?width=90'} alt={product.ref} style={{ width: '85px', height: '85px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto 8px', background: '#f9fafb' }} />
                        <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>{product.ref}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NEW GROUP MODE */}
            {mode === 'select' && (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800 }}>➕ Nouveau groupe</h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}><strong>{selected.length} sélectionné(s).</strong></p>
                  </div>
                  {selected.length >= 2 && (
                    <button onClick={groupSelected} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                      🔗 Grouper {selected.length} produits
                    </button>
                  )}
                  <button onClick={() => { setMode('groups'); setSelected([]); }} style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                  {products.map(product => {
                    const isSelected = selected.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => toggleSelect(product.id)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '3px solid #7c3aed' : '2px solid #e5e5e5',
                          borderRadius: '12px',
                          background: isSelected ? '#f5f3ff' : '#fff',
                          padding: '10px',
                          textAlign: 'center',
                          position: 'relative',
                        }}
                      >
                        {isSelected && <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✓</div>}
                        <img src={product.image + '?width=85'} alt={product.ref} style={{ width: '85px', height: '85px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto 8px', background: '#f9fafb' }} />
                        <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>{product.ref}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- TAB: NEWSLETTER --- */}
        {activeTab === 'newsletter' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Abonnés Newsletter ({subscribers.length})</h2>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(subscribers.map(s => s.email).join(', '));
                  alert('Emails copiés dans le presse-papiers !');
                }}
                style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Copier les emails
              </button>
            </div>
            
            {loadingSubscribers ? (
              <p>Chargement des abonnés...</p>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                      <th style={{ padding: '12px 16px', color: '#6b7280', fontWeight: 600, fontSize: '0.9rem' }}>Email</th>
                      <th style={{ padding: '12px 16px', color: '#6b7280', fontWeight: 600, fontSize: '0.9rem' }}>Date d'inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{sub.email}</td>
                        <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                          {new Date(sub.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                    {subscribers.length === 0 && (
                      <tr>
                        <td colSpan="2" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>Aucun abonné pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
