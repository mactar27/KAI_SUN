import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Plus, Edit, Trash2, Box, Users, BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { products, orders, stats, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('stats');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    category: 'homme',
    stock: '',
    image: '',
    hoverImage: '',
    isNew: false
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Derived Stats
  const totalOrders = orders.length;
  let totalRevenue = 0;
  let totalProfit = 0;
  orders.forEach(order => {
    totalRevenue += order.total;
    order.items.forEach(item => {
      const marginPerItem = item.product.price - item.product.costPrice;
      totalProfit += marginPerItem * item.quantity;
    });
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product.id);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', costPrice: '', category: 'homme', image: '', stock: '', hoverImage: '', isNew: false });
    }
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productToSave = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      stock: parseInt(formData.stock, 10),
      hoverImage: formData.hoverImage || formData.image // Fallback if no hover image
    };

    if (editingProduct) {
      updateProduct({ ...productToSave, id: editingProduct });
    } else {
      addProduct(productToSave);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Générer les données graphiques basées sur les VRAIES commandes des 7 derniers jours
  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Remonter jusqu'à 6 jours en arrière
    const isToday = i === 6;
    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });

    // Trouver toutes les commandes passées ce jour-là
    const safeOrders = Array.isArray(orders) ? orders : [];
    const dayOrders = safeOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getDate() === d.getDate() && 
             orderDate.getMonth() === d.getMonth() && 
             orderDate.getFullYear() === d.getFullYear();
    });

    // Calculer le revenu réel pour ce jour
    const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

    // Trouver les visiteurs réels de ce jour via la base de données
    const safeDailyVisits = Array.isArray(dailyVisits) ? dailyVisits : [];
    const visitRecord = safeDailyVisits.find(v => {
      const vDate = new Date(v.date);
      return vDate.getDate() === d.getDate() && vDate.getMonth() === d.getMonth();
    });
    
    // Si pas de record en base, on affiche 0 (sauf aujourd'hui où on est au moins à 1)
    const dayVisitors = visitRecord ? visitRecord.count : (isToday ? 1 : 0);

    return {
      name: isToday ? 'Auj.' : dayName.charAt(0).toUpperCase() + dayName.slice(1),
      visiteurs: dayVisitors,
      ventes: dayRevenue
    };
  });

  const handleDeleteAll = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUS les produits ? Cette action est irréversible.")) {
      // Pour chaque produit, appeler la fonction deleteProduct (ou créer une route backend dédiée)
      for (const product of products) {
        await deleteProduct(product.id);
      }
    }
  };

  const renderStats = () => (
    <div>
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Visiteurs Totaux</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{visitors}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Commandes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{totalOrders}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Chiffre d'affaires</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{totalRevenue} FCFA</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Bénéfice Net</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{totalProfit} FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Visiteurs (7 derniers jours)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE6DF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="visiteurs" stroke="var(--color-primary)" fill="rgba(26, 26, 26, 0.1)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Ventes (7 derniers jours)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE6DF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => `${value} FCFA`} />
                <Area type="monotone" dataKey="ventes" stroke="var(--color-accent)" fill="rgba(224, 122, 95, 0.1)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => {
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Catalogue</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', width: '250px' }}
          />
          <button className="btn btn-outline" onClick={handleDeleteAll} style={{ color: 'red', borderColor: 'red' }}>
            Tout supprimer
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Ajouter un produit
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Produit</th>
              <th style={{ padding: '1rem' }}>Catégorie</th>
              <th style={{ padding: '1rem' }}>Prix (Achat / Vente)</th>
              <th style={{ padding: '1rem' }}>Marge</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const margin = product.price - product.costPrice;
              const marginPercentage = Math.round((margin / product.price) * 100);
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/>
                    {product.name} {product.isNew && <span style={{fontSize:'0.7rem', background:'var(--color-accent)', color:'white', padding:'2px 6px', borderRadius:'10px', marginLeft:'5px'}}>Nouveau</span>}
                  </td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{product.category}</td>
                  <td style={{ padding: '1rem' }}>{product.costPrice}FCFA / {product.price}FCFA</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text)', fontWeight: '500' }}>{margin} FCFA ({marginPercentage}%)</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: product.stock > 0 ? 'inherit' : 'red', fontWeight: product.stock === 0 ? 'bold' : 'normal' }}>
                      {product.stock > 0 ? `${product.stock} unités` : 'Rupture'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px', color: 'var(--color-text-light)' }}><Edit size={18} /></button>
                    <button onClick={() => deleteProduct(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Historique des Commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Commande #{order.id}</strong>
                  <br/>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    {new Date(order.date).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '1.2rem' }}>{order.total} FCFA</strong>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <h4 style={{ color: 'var(--color-primary)' }}>Informations Client (Livraison)</h4>
                  <p style={{ margin: '0.3rem 0' }}>{order.deliveryInfo.prenom} {order.deliveryInfo.nom}</p>
                  <p style={{ margin: '0.3rem 0' }}>{order.deliveryInfo.adresse}</p>
                  <p style={{ margin: '0.3rem 0' }}>{order.deliveryInfo.cp} {order.deliveryInfo.ville}</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)' }}>Articles achetés</h4>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.product.name} <br/>
                          <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>({item.product.price}FCFA)</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="section container" style={{ paddingTop: '120px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Espace Administrateur</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <button 
          onClick={() => setActiveTab('stats')}
          style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'stats' ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'stats' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}
        ><BarChart size={18}/> Vue d'ensemble</button>
        <button 
          onClick={() => setActiveTab('catalog')}
          style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'catalog' ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'catalog' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}
        ><Box size={18}/> Catalogue</button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}
        ><Users size={18}/> Commandes & Clients</button>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'orders' && renderOrders()}
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-fade-in" style={{ background: 'var(--color-bg)', padding: '2rem', borderRadius: '8px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{display:'block', marginBottom:'0.3rem'}}>Nom du produit</label><input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}/></div>
              <div className="grid grid-cols-2">
                <div><label style={{display:'block', marginBottom:'0.3rem'}}>Prix de vente (FCFA)</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}/></div>
                <div><label style={{display:'block', marginBottom:'0.3rem'}}>Prix d'achat Solo Solis (FCFA)</label><input type="number" step="0.01" name="costPrice" value={formData.costPrice} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}/></div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <label style={{display:'block', marginBottom:'0.3rem'}}>Catégorie</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
                <div><label style={{display:'block', marginBottom:'0.3rem'}}>Stock initial</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}/></div>
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.3rem'}}>Image du produit</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}/>
                {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: '1rem', width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #eee' }} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} id="isNew" />
                <label htmlFor="isNew" style={{ margin: 0, cursor: 'pointer' }}>Mettre le badge "Nouveau"</label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Mettre à jour' : 'Ajouter au catalogue'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
