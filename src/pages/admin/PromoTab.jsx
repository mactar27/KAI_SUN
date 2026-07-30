import React, { useState, useEffect } from 'react';

const PromoTab = ({ adminToken }) => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promocodes', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) setPromos(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!code) return;
    try {
      await fetch('/api/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ code, discountPercent })
      });
      setCode('');
      setDiscountPercent(10);
      fetchPromos();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la création du code.");
    }
  };

  const togglePromo = async (id, isActive) => {
    try {
      await fetch(`/api/promocodes/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ isActive })
      });
      fetchPromos();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePromo = async (id) => {
    if (!confirm("Supprimer ce code promo ?")) return;
    try {
      await fetch(`/api/promocodes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchPromos();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>🎟️ Codes Promo</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '16px', marginBottom: '32px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Code (ex: KAIA10)</label>
          <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e5e5' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Réduction (%)</label>
          <input type="number" min="1" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e5e5' }} />
        </div>
        <button type="submit" style={{ padding: '12px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Créer</button>
      </form>

      {loading ? <p>Chargement...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>Code</th>
                <th style={{ padding: '12px 8px' }}>Réduction</th>
                <th style={{ padding: '12px 8px' }}>Statut</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
            </thead>
            <tbody>
              {promos.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#666' }}>Aucun code promo créé.</td></tr>
              ) : promos.map(promo => (
                <tr key={promo.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{promo.code}</td>
                  <td style={{ padding: '12px 8px' }}>{promo.discount_percent}%</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: promo.is_active ? '#e6f4ea' : '#fce8e6', color: promo.is_active ? '#137333' : '#c5221f' }}>
                      {promo.is_active ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button onClick={() => togglePromo(promo.id, !promo.is_active)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      {promo.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromoTab;
