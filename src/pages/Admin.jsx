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
  const [mode, setMode] = useState('groups'); // 'groups' | 'select' | 'edit-group'
  const [editingGroupId, setEditingGroupId] = useState(null);
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
    const newGroupId = 'GRP_' + products.find(p => p.id === selected[0]).ref;
    setProducts(prev => prev.map(p =>
      selected.includes(p.id) ? { ...p, groupId: newGroupId } : p
    ));
    setSelected([]);
    setMode('groups');
  };

  // Start editing a specific group
  const startEditGroup = (groupId) => {
    const memberIds = (groups[groupId] || []).map(p => p.id);
    setSelected(memberIds);
    setEditingGroupId(groupId);
    setSearch('');
    setFilterGender('all');
    setMode('edit-group');
  };

  // Save edits to a group
  const saveGroupEdit = () => {
    if (selected.length === 0) return;
    // Assign all selected to the existing groupId, ungroup removed ones
    setProducts(prev => prev.map(p => {
      if (selected.includes(p.id)) {
        return { ...p, groupId: editingGroupId };
      }
      // If was in this group but now deselected → give solo id
      if (p.groupId === editingGroupId) {
        return { ...p, groupId: 'SOLO_' + p.ref };
      }
      return p;
    }));
    setSelected([]);
    setEditingGroupId(null);
    setMode('groups');
  };

  const ungroup = (productId) => {
    setProducts(prev => prev.map(x =>
      x.id === productId ? { ...x, groupId: 'SOLO_' + x.ref } : x
    ));
  };

  const exportJSON = () => {
    const cleaned = products.map(({ groupId, ...rest }) => {
      const defaultGroupId = rest.ref.substring(0, rest.ref.length - 1);
      if (groupId === defaultGroupId) return rest;
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

        {/* How-to */}
        {mode === 'groups' && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', fontSize: '14px', color: '#1e40af' }}>
            <strong>💡 Comment utiliser :</strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', lineHeight: '1.9' }}>
              <li>Cliquez sur <strong>✏️ Modifier</strong> sur un groupe pour ajouter/retirer des produits</li>
              <li>Cliquez sur le <strong>✕ rouge</strong> sur une photo pour retirer ce produit du groupe</li>
              <li>Cliquez <strong>"Nouveau groupe"</strong> pour créer un groupe depuis zéro</li>
            </ul>
          </div>
        )}

        {/* GROUPS MODE */}
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

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: '#111' }}>Tous les groupes</h2>
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
                    {/* MODIFY BUTTON */}
                    <button
                      onClick={() => startEditGroup(groupId)}
                      style={{
                        background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #bae6fd',
                        padding: '7px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                        fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#e0f2fe'}
                      onMouseOut={e => e.currentTarget.style.background = '#f0f9ff'}
                    >
                      ✏️ Modifier le groupe
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {members.map(product => (
                      <div key={product.id} style={{ textAlign: 'center', position: 'relative' }}>
                        <img
                          src={product.image + (product.image.startsWith('http') ? '?width=80&height=80' : '')}
                          alt={product.ref}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e5e5e5', display: 'block' }}
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
                  Cliquez sur les produits pour les ajouter ou retirer du groupe. <strong>{selected.length} produit(s) sélectionné(s).</strong>
                </p>
              </div>
              <button
                onClick={saveGroupEdit}
                disabled={selected.length === 0}
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
              >
                ✅ Valider
              </button>
              <button
                onClick={() => { setMode('groups'); setSelected([]); setEditingGroupId(null); }}
                style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                Annuler
              </button>
            </div>

            {/* Filters */}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {filteredProducts.map(product => {
                const isSelected = selected.includes(product.id);
                const wasInGroup = product.groupId === editingGroupId;
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
                      transition: 'all 0.15s',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 0 3px #bbf7d0' : 'none',
                      position: 'relative',
                      opacity: 1
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✓</div>
                    )}
                    {wasInGroup && !isSelected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✕</div>
                    )}
                    <img
                      src={product.image + (product.image.startsWith('http') ? '?width=90&height=90' : '')}
                      alt={product.ref}
                      style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '8px', display: 'block', margin: '0 auto 8px' }}
                      onError={e => { e.target.src = 'https://placehold.co/85x85/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#333' }}>{product.ref}</div>
                    <div style={{ fontSize: '10px', color: product.gender === 'femme' ? '#be185d' : '#1d4ed8', marginTop: '2px' }}>
                      {product.gender === 'femme' ? '♀ Femme' : '♂ Homme'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NEW GROUP SELECT MODE */}
        {mode === 'select' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800 }}>➕ Nouveau groupe</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Sélectionnez 2 produits ou plus à regrouper. <strong>{selected.length} sélectionné(s).</strong></p>
              </div>
              {selected.length >= 2 && (
                <button
                  onClick={groupSelected}
                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                >
                  🔗 Grouper {selected.length} produits
                </button>
              )}
              <button
                onClick={() => { setMode('groups'); setSelected([]); }}
                style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                Annuler
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Rechercher..."
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {filteredProducts.map(product => {
                const isSelected = selected.includes(product.id);
                const currentGroupSize = (groups[product.groupId] || []).length;
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
                      boxShadow: isSelected ? '0 0 0 3px #ddd6fe' : 'none',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>✓</div>
                    )}
                    {currentGroupSize > 1 && !isSelected && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{currentGroupSize}</div>
                    )}
                    <img
                      src={product.image + (product.image.startsWith('http') ? '?width=85&height=85' : '')}
                      alt={product.ref}
                      style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '8px', display: 'block', margin: '0 auto 8px' }}
                      onError={e => { e.target.src = 'https://placehold.co/85x85/f0f0f0/aaa?text=?'; e.target.onerror = null; }}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#333' }}>{product.ref}</div>
                    <div style={{ fontSize: '10px', color: product.gender === 'femme' ? '#be185d' : '#1d4ed8', marginTop: '2px' }}>
                      {product.gender === 'femme' ? '♀ Femme' : '♂ Homme'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
