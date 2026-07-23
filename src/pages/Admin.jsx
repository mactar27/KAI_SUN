import React, { useState } from 'react';
import productsData from '../data/products.json';

const Admin = () => {
  const [products, setProducts] = useState(productsData);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [saved, setSaved] = useState(false);

  // Compute groups
  const groups = {};
  products.forEach(p => {
    const key = p.groupId || p.ref.substring(0, p.ref.length - 1);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  const filteredProducts = products.filter(p => {
    const matchSearch = p.ref.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === 'all' || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      groupId: product.groupId || '',
      gender: product.gender,
      price: product.price,
    });
  };

  const handleSave = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        groupId: editForm.groupId.trim() || undefined,
        gender: editForm.gender,
        price: Number(editForm.price),
      };
    }));
    setEditingProduct(null);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', background: '#f9f9f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', margin: 0 }}>🛠️ Administration</h1>
            <p style={{ color: '#666', marginTop: '4px' }}>{products.length} produits · {Object.keys(groups).length} groupes</p>
          </div>
          <button
            onClick={exportJSON}
            style={{
              background: '#111', color: '#fff', border: 'none', padding: '12px 24px',
              borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            {saved ? '✅ Téléchargé !' : '⬇️ Exporter products.json'}
          </button>
        </div>

        {/* Notice */}
        <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#92400e' }}>
          <strong>💡 Mode lecture/édition locale :</strong> Les modifications faites ici sont temporaires. Pour les appliquer au site, cliquez sur "Exporter products.json", remplacez le fichier dans le projet, puis faites un <code>git push</code>.
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher une référence..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1', minWidth: '200px', padding: '10px 16px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
          <select
            value={filterGender}
            onChange={e => setFilterGender(e.target.value)}
            style={{ padding: '10px 16px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
          >
            <option value="all">Tous les genres</option>
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#111', color: '#fff' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Photo</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Référence</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Genre</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Groupe (ID)</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Prix</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} style={{ borderTop: '1px solid #f0f0f0', background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img
                      src={product.image + '?width=60&height=60'}
                      alt={product.ref}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                      onError={e => { e.target.src = 'https://placehold.co/50x50/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>{product.ref}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {editingProduct === product.id ? (
                      <select
                        value={editForm.gender}
                        onChange={e => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                        style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                      >
                        <option value="femme">Femme</option>
                        <option value="homme">Homme</option>
                      </select>
                    ) : (
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                        background: product.gender === 'femme' ? '#fce7f3' : '#dbeafe',
                        color: product.gender === 'femme' ? '#9d174d' : '#1e40af',
                      }}>{product.gender}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        value={editForm.groupId}
                        onChange={e => setEditForm(prev => ({ ...prev, groupId: e.target.value }))}
                        placeholder="Laisser vide = auto"
                        style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', width: '180px', fontFamily: 'monospace' }}
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: product.groupId ? '#7c3aed' : '#9ca3af', fontFamily: 'monospace' }}>
                        {product.groupId || `auto: ${product.ref.substring(0, product.ref.length - 1)}`}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                        style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', width: '100px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{product.price.toLocaleString()} FCFA</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {editingProduct === product.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleSave(product.id)}
                          style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >Sauvegarder</button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                        >Annuler</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >✏️ Modifier</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Groups Summary */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Résumé des groupes ({Object.keys(groups).length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {Object.entries(groups).map(([key, members]) => (
              <div key={key} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#7c3aed', fontWeight: 700, marginBottom: '10px' }}>{key}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {members.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <img
                        src={m.image + '?width=40&height=40'}
                        alt={m.ref}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #eee' }}
                        onError={e => { e.target.src = 'https://placehold.co/40x40/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                      />
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555' }}>{m.ref.replace('NDL', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
