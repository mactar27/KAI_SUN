import React, { useState, useEffect } from 'react';

const ReviewTab = ({ adminToken }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?all=true', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) setReviews(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id, isApproved) => {
    try {
      await fetch(`/api/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ isApproved })
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Supprimer définitivement cet avis ?")) return;
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>⭐ Avis Clients</h2>
      
      {loading ? <p>Chargement...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Date</th>
              <th style={{ padding: '12px 8px' }}>Produit</th>
              <th style={{ padding: '12px 8px' }}>Client & Note</th>
              <th style={{ padding: '12px 8px' }}>Commentaire</th>
              <th style={{ padding: '12px 8px' }}>Statut</th>
              <th style={{ padding: '12px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#666' }}>Aucun avis reçu.</td></tr>
            ) : reviews.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td data-label="Date" style={{ padding: '12px 8px', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                <td data-label="Produit" style={{ padding: '12px 8px', fontWeight: 'bold' }}>{r.productId}</td>
                <td data-label="Client & Note" style={{ padding: '12px 8px' }}>
                  {r.authorName}<br/>
                  <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </td>
                <td data-label="Commentaire" style={{ padding: '12px 8px', maxWidth: '300px', fontSize: '0.9rem', whiteSpace: 'normal' }}>"{r.comment}"</td>
                <td data-label="Statut" style={{ padding: '12px 8px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: r.isApproved ? '#e8f5e9' : '#fff3e0', color: r.isApproved ? '#2e7d32' : '#e65100' }}>
                    {r.isApproved ? 'En ligne' : 'En attente'}
                  </span>
                </td>
                <td data-label="Actions" style={{ padding: '12px 8px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => toggleApproval(r.id, !r.isApproved)} style={{ padding: '6px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                    {r.isApproved ? 'Masquer' : 'Publier'}
                  </button>
                  <button onClick={() => deleteReview(r.id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '4px', cursor: 'pointer' }}>
                    Supprimer
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

export default ReviewTab;
