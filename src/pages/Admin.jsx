import React, { useState } from 'react';
import productsData from '../data/products.json';

const Admin = () => {
  const [products, setProducts] = useState(
    productsData.map(p => ({
      ...p,
      groupId: p.groupId || p.ref.substring(0, p.ref.length - 1)
    }))
  );
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState('groups'); // 'groups' | 'select'
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  // Compute groups map
  const groups = {};
  products.forEach(p => {
    if (!groups[p.groupId]) groups[p.groupId] = [];
    groups[p.groupId].push(p);
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

  const groupSelected = () => {
    if (selected.length < 2) return;
    // Use the first selected product's ref as new groupId
    const newGroupId = 'GRP_' + products.find(p => p.id === selected[0]).ref;
    setProducts(prev => prev.map(p =>
      selected.includes(p.id) ? { ...p, groupId: newGroupId } : p
    ));
    setSelected([]);
    setMode('groups');
  };

  const ungroup = (productId) => {
    const p = products.find(x => x.id === productId);
    // Give it a unique solo groupId
    setProducts(prev => prev.map(x =>
      x.id === productId ? { ...x, groupId: 'SOLO_' + x.ref } : x
    ));
  };

  const exportJSON = () => {
    // Clean up: remove auto-generated groupIds that match the default pattern
    const cleaned = products.map(({ groupId, ...rest }) => {
      // Only keep explicit groupIds (not auto-generated from baseRef)
      const defaultGroupId = rest.ref.substring(0, rest.ref.length - 1);
      if (groupId === defaultGroupId) return rest; // remove groupId
      return { ...rest, groupId };
    });
    const blob = new Blob([JSON.stringify(cleaned, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const groupEntries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', background: '#f8f8f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', margin: 0 }}>🛠️ Gestion des Groupes</h1>
            <p style={{ color: '#666', marginTop: '6px', marginBottom: 0 }}>
              {products.length} produits · {groupEntries.length} groupes
            </p>
          </div>
          <button
            onClick={exportJSON}
            style={{
              background: saved ? '#16a34a' : '#111', color: '#fff', border: 'none',
              padding: '12px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
              transition: 'background 0.3s'
            }}
          >
            {saved ? '✅ products.json téléchargé !' : '⬇️ Exporter products.json'}
          </button>
        </div>

        {/* How-to banner */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', fontSize: '14px', color: '#1e40af', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <strong>Comment regrouper des produits ?</strong>
            <ol style={{ margin: '6px 0 0 0', paddingLeft: '18px', lineHeight: '1.8' }}>
              <li>Cliquez sur <strong>"Sélectionner des produits"</strong></li>
              <li>Cliquez sur les produits que vous voulez regrouper</li>
              <li>Cliquez sur <strong>"Grouper la sélection"</strong></li>
            </ol>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => { setMode(mode === 'select' ? 'groups' : 'select'); setSelected([]); }}
            style={{
              background: mode === 'select' ? '#7c3aed' : '#fff',
              color: mode === 'select' ? '#fff' : '#111',
              border: '2px solid ' + (mode === 'select' ? '#7c3aed' : '#ddd'),
              padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {mode === 'select' ? `✅ Sélection (${selected.length} choisi${selected.length > 1 ? 's' : ''})` : '☑️ Sélectionner des produits'}
          </button>

          {mode === 'select' && selected.length >= 2 && (
            <button
              onClick={groupSelected}
              style={{
                background: '#16a34a', color: '#fff', border: 'none',
                padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
                animation: 'pulse 1s infinite'
              }}
            >
              🔗 Grouper {selected.length} produits ensemble
            </button>
          )}

          {mode === 'select' && selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕ Désélectionner tout
            </button>
          )}
        </div>

        {/* Filters */}
        {mode === 'select' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Rechercher une référence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              style={{ padding: '10px 16px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
            >
              <option value="all">Tous</option>
              <option value="femme">Femme</option>
              <option value="homme">Homme</option>
            </select>
          </div>
        )}

        {/* SELECT MODE — product grid */}
        {mode === 'select' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '40px' }}>
            {filteredProducts.map(product => {
              const isSelected = selected.includes(product.id);
              const currentGroup = groupEntries.find(([, members]) => members.some(m => m.id === product.id));
              const groupSize = currentGroup ? currentGroup[1].length : 1;
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
                    transition: 'all 0.15s',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 0 4px #ddd6fe' : 'none',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✓</div>
                  )}
                  {groupSize > 1 && !isSelected && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{groupSize}</div>
                  )}
                  <img
                    src={product.image + '?width=100&height=100'}
                    alt={product.ref}
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', display: 'block', margin: '0 auto 8px' }}
                    onError={e => { e.target.src = 'https://placehold.co/90x90/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                  />
                  <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#333' }}>{product.ref}</div>
                  <div style={{ fontSize: '10px', color: product.gender === 'femme' ? '#be185d' : '#1d4ed8', marginTop: '2px' }}>
                    {product.gender === 'femme' ? '♀ Femme' : '♂ Homme'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GROUPS MODE — visual groups */}
        {mode === 'groups' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: '#111' }}>
              Tous les groupes
            </h2>
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
                      <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                        {members[0].gender === 'femme' ? '♀ Femme' : '♂ Homme'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {members.map(product => (
                      <div key={product.id} style={{ textAlign: 'center', position: 'relative' }}>
                        <img
                          src={product.image + '?width=80&height=80'}
                          alt={product.ref}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e5e5e5', display: 'block' }}
                          onError={e => { e.target.src = 'https://placehold.co/70x70/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                        />
                        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#444', marginTop: '4px', fontWeight: 600 }}>{product.ref}</div>
                        {members.length > 1 && (
                          <button
                            onClick={() => ungroup(product.id)}
                            title="Retirer du groupe"
                            style={{ position: 'absolute', top: '-6px', left: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                          >✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
