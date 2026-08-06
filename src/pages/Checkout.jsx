import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext, calculateCartTotal } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const Checkout = () => {
  const { products } = useContext(ProductsContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Review State
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [purchasedProductId, setPurchasedProductId] = useState('STORE');
  const { cart, placeOrder, clearCart, countryCode } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    adresse: '',
    ville: 'Dakar',
    notes: ''
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const orderTotal = calculateCartTotal(cart, countryCode);
  const discountAmount = appliedPromo ? (orderTotal * (appliedPromo.discountPercent / 100)) : 0;
  const finalTotal = Math.max(0, orderTotal - discountAmount);

  const handleApplyPromo = async () => {
    if (!promoCodeInput) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch(`/api/promocodes/validate?code=${promoCodeInput}`);
      if (res.ok) {
        const data = await res.json();
        setAppliedPromo(data);
        setPromoError('');
      } else {
        const err = await res.json();
        setPromoError(err.error || 'Code invalide');
        setAppliedPromo(null);
      }
    } catch (e) {
      setPromoError('Erreur de validation');
    }
    setPromoLoading(false);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setPurchasedProductId(cart[0]?.id || 'STORE');

    try {
      // Save to database
      await placeOrder(formData, discountAmount, appliedPromo?.id);

      // E-commerce Tracking: Purchase
      if (typeof window !== 'undefined') {
        if (window.fbq) {
          window.fbq('track', 'Purchase', { value: finalTotal, currency: 'XOF' });
        }
        if (window.gtag) {
          window.gtag('event', 'purchase', { value: finalTotal, currency: 'XOF' });
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      alert("Une erreur s'est produite lors de la validation de votre commande. Veuillez réessayer.");
      console.error(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: purchasedProductId, ...reviewForm })
      });
      setReviewSubmitted(true);
      setReviewForm({ authorName: '', rating: 5, comment: '' });
    } catch (err) { console.error(err); }
  };

  if (isSubmitted) {
    return (
      <div className="checkout-container success">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Commande Confirmée !</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
            Merci pour votre achat. Notre équipe va vous contacter sur WhatsApp dans les plus brefs délais pour organiser la livraison.
          </p>
          
          <div style={{ background: '#f9f9f9', padding: '40px 20px', borderRadius: '12px', marginTop: '40px', maxWidth: '600px', margin: '40px auto 0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>⭐ Laissez-nous un avis !</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>Votre avis compte beaucoup pour nous. Comment s'est passée votre commande ?</p>
            
            {reviewSubmitted ? (
              <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '8px', fontWeight: 600 }}>
                Merci beaucoup ! Votre avis a été envoyé avec succès.
              </div>
            ) : (
              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div>
                  <label htmlFor="review_author" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Votre nom</label>
                  <input id="review_author" name="authorName" required type="text" autoComplete="name" placeholder="Votre nom" value={reviewForm.authorName} onChange={e => setReviewForm({...reviewForm, authorName: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                </div>
                <div>
                  <label htmlFor="review_rating" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Note</label>
                  <select id="review_rating" name="rating" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fff' }}>
                    <option value="5">5 Étoiles - Excellent</option>
                    <option value="4">4 Étoiles - Très bien</option>
                    <option value="3">3 Étoiles - Moyen</option>
                    <option value="2">2 Étoiles - Décevant</option>
                    <option value="1">1 Étoile - Mauvais</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="review_comment" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Votre avis</label>
                  <textarea id="review_comment" name="comment" required placeholder="Partagez votre expérience d'achat..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '120px', fontSize: '1rem', fontFamily: 'inherit' }}></textarea>
                </div>
                <button type="submit" style={{ padding: '16px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem' }}>Envoyer mon avis</button>
              </form>
            )}
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <Link to="/" className="btn btn-primary">Retour à la boutique</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="section container text-center animate-fade-in" style={{ paddingTop: '150px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="section-title">Votre panier est vide</h1>
        <p style={{ marginBottom: '3rem', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>Ajoutez des articles pour pouvoir passer commande.</p>
        <Link to="/" className="btn btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  const inputStyle = {
    padding: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#ffffff'
  };

  const labelStyle = {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#4b5563',
    fontWeight: 600
  };

  return (
    <div className="section container animate-fade-in" style={{ paddingTop: '150px', maxWidth: '800px', minHeight: '80vh' }}>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>Informations de Livraison</h1>
      
      <div className="glass-panel checkout-panel">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="prenom" style={labelStyle}>Prénom</label>
              <input type="text" id="prenom" name="prenom" autoComplete="given-name" required value={formData.prenom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="nom" style={labelStyle}>Nom</label>
              <input type="text" id="nom" name="nom" autoComplete="family-name" required value={formData.nom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label htmlFor="adresse" style={labelStyle}>Adresse de livraison</label>
            <input type="text" id="adresse" name="adresse" autoComplete="street-address" placeholder="Numéro et rue" required value={formData.adresse} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          </div>

          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="ville" style={labelStyle}>Ville / Quartier</label>
              <input type="text" id="ville" name="ville" autoComplete="address-level2" required value={formData.ville} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="phone" style={labelStyle}>Numéro de téléphone</label>
              <input type="tel" id="phone" name="phone" autoComplete="tel" placeholder="+221 ..." required value={formData.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <label htmlFor="promoCodeInput" style={labelStyle}>Avez-vous un code promo ?</label>
            <div className="promo-row" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input 
                id="promoCodeInput"
                name="promoCodeInput"
                type="text" 
                placeholder="Entrez votre code" 
                value={promoCodeInput}
                onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                style={{ ...inputStyle, flex: 1, opacity: appliedPromo ? 0.7 : 1 }}
                disabled={!!appliedPromo}
              />
              {appliedPromo ? (
                <button 
                  type="button" 
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoCodeInput('');
                  }}
                  style={{ padding: '0 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !promoCodeInput}
                  style={{ padding: '0 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: (!promoCodeInput || promoLoading) ? 'not-allowed' : 'pointer', opacity: (!promoCodeInput || promoLoading) ? 0.5 : 1 }}
                >
                  {promoLoading ? '...' : 'Appliquer'}
                </button>
              )}
            </div>
            {promoError && <p style={{ color: '#c62828', fontSize: '0.85rem', marginTop: '8px' }}>{promoError}</p>}
            {appliedPromo && <p style={{ color: '#2e7d32', fontSize: '0.9rem', marginTop: '8px', fontWeight: 700 }}>✅ Code appliqué ! Vous bénéficiez de -{appliedPromo.discountPercent}% de réduction.</p>}
          </div>

          <div style={{ background: '#f8f8f8', padding: '20px', borderRadius: '8px', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Sous-total</span>
              <span>{orderTotal.toLocaleString()} FCFA</span>
            </div>
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2e7d32', fontWeight: 600 }}>
                <span>Réduction ({appliedPromo.discountPercent}%)</span>
                <span>-{discountAmount.toLocaleString()} FCFA</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '12px', marginTop: '12px', fontWeight: 900, fontSize: '1.2rem' }}>
              <span>Total à payer</span>
              <span>{finalTotal.toLocaleString()} FCFA</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1.2rem' }}>
            Confirmer la commande
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
