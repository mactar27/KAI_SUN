import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

const ProductsTab = ({ products, refreshProducts }) => {
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState('groups'); // 'groups' | 'select' | 'edit-group'
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Specs Modal state
  const [specsModalProduct, setSpecsModalProduct] = useState(null);
  const [specsForm, setSpecsForm] = useState({
    frame_width: '',
    lens_width: '',
    bridge_width: '',
    temple_length: '',
    face_shapes: '',
    material: '',
    uv_protection: ''
  });

  const openSpecsModal = (productGroup) => {
    const mainProd = productGroup[0];
    setSpecsModalProduct(productGroup);
    setSpecsForm({
      frame_width: mainProd.frame_width || (mainProd.gender === 'homme' ? '146 mm' : mainProd.gender === 'femme' ? '142 mm' : '144 mm'),
      lens_width: mainProd.lens_width || (mainProd.gender === 'homme' ? '53 mm' : mainProd.gender === 'femme' ? '50 mm' : '51 mm'),
      bridge_width: mainProd.bridge_width || (mainProd.gender === 'homme' ? '19 mm' : '18 mm'),
      temple_length: mainProd.temple_length || (mainProd.gender === 'homme' ? '145 mm' : '140 mm'),
      face_shapes: mainProd.face_shapes || (mainProd.gender === 'femme' ? 'Ovale, Rond, Cœur, Diamant' : mainProd.gender === 'homme' ? 'Ovale, Carré, Rectangulaire' : 'Tous Visages, Ovale, Rond, Carré'),
      material: mainProd.material || 'Acétate bio-sourcé italien',
      uv_protection: mainProd.uv_protection || 'UV400 Catégorie 3'
    });
  };

  const saveSpecs = async () => {
    if (!specsModalProduct || specsModalProduct.length === 0) return;
    setIsSaving(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const requests = specsModalProduct.map(p => 
        fetch('/api/products', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            id: p.id,
            action: 'updateSpecs',
            ...specsForm
          })
        })
      );
      await Promise.all(requests);
      await refreshProducts();
      setSpecsModalProduct(null);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la sauvegarde de la fiche technique.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group logic
  const groups = {};
  products.forEach(p => {
    const groupKey = p.groupId || (p.ref ? p.ref.substring(0, p.ref.length - 1) : p.id);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(p);
  });

  const groupEntries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.ref.toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === 'all' || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const groupSelected = async () => {
    if (selected.length < 2) return;
    setIsSaving(true);
    const newGroupId = 'GRP_' + products.find(p => p.id === selected[0]).ref;
    try {
      const requests = selected.map(id => 
        fetch('/api/products', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id, groupId: newGroupId, action: 'updateGroup' })
        })
      );
      await Promise.all(requests);
      await refreshProducts();
      setSelected([]);
      setMode('groups');
    } catch (e) {
      console.error(e);
      alert("Erreur lors du groupement.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditGroup = (groupId) => {
    const memberIds = (groups[groupId] || []).map(p => p.id);
    setSelected(memberIds);
    setEditingGroupId(groupId);
    setSearch('');
    setFilterGender('all');
    setMode('edit-group');
  };

  const saveGroupEdit = async () => {
    if (selected.length === 0) return;
    setIsSaving(true);
    
    try {
      const requests = [];
      for (const p of products) {
        const isSelected = selected.includes(p.id);
        const groupKey = p.groupId || (p.ref ? p.ref.substring(0, p.ref.length - 1) : p.id);
        const wasInGroup = groupKey === editingGroupId;
        
        if (isSelected && !wasInGroup) {
          requests.push(fetch('/api/products', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ id: p.id, groupId: editingGroupId, action: 'updateGroup' })
          }));
        } else if (!isSelected && wasInGroup) {
          requests.push(fetch('/api/products', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ id: p.id, groupId: null, action: 'updateGroup' })
          }));
        }
      }
      
      if (requests.length > 0) {
        const responses = await Promise.all(requests);
        const failed = responses.filter(r => !r.ok);
        if (failed.length > 0) throw new Error("Certaines mises à jour ont échoué.");
      }
      
      await refreshProducts();
      setSelected([]);
      setEditingGroupId(null);
      setMode('groups');
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la modification du groupe.");
    } finally {
      setIsSaving(false);
    }
  };

  const ungroup = async (productId) => {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: p.id, groupId: 'SOLO_' + p.ref, action: 'updateGroup' })
      })
    );
    await Promise.all(requests);
    await refreshProducts();
  };

  const handleUpdateStock = async (id, stock) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ id, stock, action: 'updateStock' })
    });
    setEditingStock(null);
    await refreshProducts();
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>
          {mode === 'groups' ? 'Groupes de produits' : mode === 'edit-group' ? '✏️ Modifier le groupe' : 'Sélectionner des produits'}
        </h2>
        
        {mode === 'groups' && (
          <button
            onClick={() => { setMode('select'); setSelected([]); setEditingGroupId(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', transition: 'opacity 0.2s' }}
          >
            <Plus size={16} /> Nouveau groupe
          </button>
        )}
      </div>

      <div style={{ padding: '24px' }}>
        {/* VIEW MODE: GROUPS */}
        {mode === 'groups' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {groupEntries.map(([groupId, members]) => {
                const totalStock = members.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
              const price = members[0]?.price || 0;
              const groupName = groupId.replace('GRP_', '').replace('SOLO_', '');

              return (
                <div key={groupId} className="responsive-flex-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #eaeaea', borderRadius: '12px', background: '#fafafa', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d4af37'} onMouseLeave={e => e.currentTarget.style.borderColor = '#eaeaea'}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                    {/* Thumbnail Stack */}
                    <div style={{ display: 'flex', width: '80px', position: 'relative', height: '50px' }}>
                      {members.slice(0, 3).map((p, i) => (
                        <img 
                          key={p.id} 
                          src={p.image + '?width=50&height=50'} 
                          alt={p.ref} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fff', position: 'absolute', left: `${i * 15}px`, zIndex: 3 - i, background: '#f0f0f0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} 
                        />
                      ))}
                    </div>
                    
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111', textTransform: 'uppercase' }}>{groupName}</h3>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px', fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap' }}>
                        <span>{members.length > 1 ? `${members.length} variantes` : 'Produit unique'}</span>
                        <span style={{ color: '#eaeaea' }}>|</span>
                        <span>Stock total : <strong style={{ color: totalStock === 0 ? '#dc2626' : '#111' }}>{totalStock}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 700, color: '#111' }}>{price.toLocaleString()} FCFA</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Prix de vente</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => openSpecsModal(members)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fcfbf7', color: '#3a4a35', border: '1px solid #dcd8c8', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a4a35'; e.currentTarget.style.background = '#f5f0e1'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#dcd8c8'; e.currentTarget.style.background = '#fcfbf7'; }}
                    >
                      📐 Tailles & Fiche
                    </button>
                    <button
                      onClick={() => startEditGroup(groupId)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#111', border: '1px solid #eaeaea', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#fafafa'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaeaea'; e.currentTarget.style.background = '#fff'; }}
                    >
                      <Edit2 size={14} /> Modifier
                    </button>
                    {members.length > 1 && (
                      <button
                        onClick={() => deleteGroup(groupId)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        title="Dégrouper tout"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* SELECT / EDIT MODE */}
        {(mode === 'select' || mode === 'edit-group') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fafafa', padding: '16px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#111', marginBottom: '4px' }}>{selected.length} produit(s) sélectionné(s)</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Cliquez sur les produits pour les inclure dans le groupe.</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setMode('groups'); setSelected([]); setEditingGroupId(null); }} style={{ background: '#fff', color: '#111', border: '1px solid #eaeaea', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button 
                  onClick={mode === 'edit-group' ? saveGroupEdit : groupSelected} 
                  disabled={selected.length === 0 || isSaving} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D4AF37', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, cursor: (selected.length === 0 || isSaving) ? 'not-allowed' : 'pointer', opacity: (selected.length === 0 || isSaving) ? 0.5 : 1 }}
                >
                  <Check size={16} /> {isSaving ? 'En cours...' : 'Valider'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                  type="text" 
                  placeholder="Rechercher une référence..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <option value="all">Tous les genres</option>
                <option value="Femme">Femme</option>
                <option value="Homme">Homme</option>
                <option value="Mixte">Mixte</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
              {filteredProducts.map(product => {
                const isSelected = selected.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => toggleSelect(product.id)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #D4AF37' : '1px solid #eaeaea',
                      borderRadius: '12px',
                      background: isSelected ? '#fffcf0' : '#fff',
                      padding: '12px',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 12px rgba(212, 175, 55, 0.15)' : 'none'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: '#D4AF37', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                    <img src={product.image + '?width=100&height=100'} alt={product.ref} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto 12px', background: '#f9f9f9' }} />
                    <div style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{product.ref}</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleUpdateStock(product.id, Math.max(0, (product.stock || 0) - 1))}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                        title="Diminuer le stock"
                      >-</button>
                      
                      {editingStock === product.id ? (
                        <input 
                          type="number" 
                          min="0"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          style={{ width: '50px', padding: '2px 4px', borderRadius: '4px', border: '1px solid #D4AF37', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}
                          autoFocus
                          onBlur={() => handleUpdateStock(product.id, Math.max(0, parseInt(stockValue) || 0))}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateStock(product.id, Math.max(0, parseInt(stockValue) || 0))}
                        />
                      ) : (
                        <span 
                          onClick={() => { setEditingStock(product.id); setStockValue(Math.max(0, product.stock || 0)); }}
                          style={{ fontSize: '0.8rem', fontWeight: 700, color: (product.stock || 0) <= 0 ? '#dc2626' : '#111', cursor: 'pointer', padding: '2px 6px', background: (product.stock || 0) <= 0 ? '#fef2f2' : '#f3f4f6', borderRadius: '4px', border: (product.stock || 0) <= 0 ? '1px solid #fecaca' : '1px solid transparent' }}
                          title="Cliquer pour modifier"
                        >
                          {(product.stock || 0) <= 0 ? '0 (Rupture)' : product.stock}
                        </span>
                      )}

                      <button 
                        onClick={() => handleUpdateStock(product.id, Math.max(0, (product.stock || 0) + 1))}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                        title="Augmenter le stock"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SPECS & DIMENSIONS MODAL */}
        {specsModalProduct && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '550px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>
                  📐 Modifier Tailles & Fiche Technique
                </h3>
                <button onClick={() => setSpecsModalProduct(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>Largeur Monture (mm)</label>
                  <input type="text" value={specsForm.frame_width} onChange={e => setSpecsForm({...specsForm, frame_width: e.target.value})} placeholder="ex: 146 mm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>Largeur Verres (mm)</label>
                  <input type="text" value={specsForm.lens_width} onChange={e => setSpecsForm({...specsForm, lens_width: e.target.value})} placeholder="ex: 53 mm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>Pont de Nez (mm)</label>
                  <input type="text" value={specsForm.bridge_width} onChange={e => setSpecsForm({...specsForm, bridge_width: e.target.value})} placeholder="ex: 19 mm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>Longueur Branches (mm)</label>
                  <input type="text" value={specsForm.temple_length} onChange={e => setSpecsForm({...specsForm, temple_length: e.target.value})} placeholder="ex: 145 mm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>👤 Formes de Visage Recommandées</label>
                <input type="text" value={specsForm.face_shapes} onChange={e => setSpecsForm({...specsForm, face_shapes: e.target.value})} placeholder="ex: Ovale, Rond, Carré, Rectangulaire" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>🌿 Matériau de la Monture</label>
                <input type="text" value={specsForm.material} onChange={e => setSpecsForm({...specsForm, material: e.target.value})} placeholder="ex: Acétate bio-sourcé italien" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#444', marginBottom: '4px' }}>☀️ Protection Solaires & Verres</label>
                <input type="text" value={specsForm.uv_protection} onChange={e => setSpecsForm({...specsForm, uv_protection: e.target.value})} placeholder="ex: UV400 Catégorie 3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setSpecsModalProduct(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  Annuler
                </button>
                <button onClick={saveSpecs} disabled={isSaving} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--kaia-green, #3a4a35)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
