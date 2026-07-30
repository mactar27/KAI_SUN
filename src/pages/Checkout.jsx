import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext, calculateCartTotal } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const Checkout = () => {
  const { products } = useContext(ProductsContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { cart, placeOrder, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    phone: '',
    ville: ''
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

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

  const orderTotal = calculateCartTotal(cart);
  const discountAmount = appliedPromo ? (orderTotal * (appliedPromo.discountPercent / 100)) : 0;
  const finalTotal = Math.max(0, orderTotal - discountAmount);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
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

  if (isSubmitted) {
    return (
      <div className="section container text-center animate-fade-in" style={{ paddingTop: '150px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Merci pour votre commande !</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--color-text-light)' }}>
          Votre commande a bien été prise en compte et sera préparée avec soin très prochainement.
        </p>
        <Link to="/" className="btn btn-primary">Retour à la boutique</Link>
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
              <input type="text" id="prenom" required value={formData.prenom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="nom" style={labelStyle}>Nom</label>
              <input type="text" id="nom" required value={formData.nom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label htmlFor="adresse" style={labelStyle}>Adresse de livraison</label>
            <input type="text" id="adresse" placeholder="Numéro et rue" required value={formData.adresse} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          </div>

          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="ville" style={labelStyle}>Ville / Quartier</label>
              <input type="text" id="ville" required value={formData.ville} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="phone" style={labelStyle}>Numéro de téléphone</label>
              <input type="tel" id="phone" placeholder="+221 ..." required value={formData.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <label style={labelStyle}>Avez-vous un code promo ?</label>
            <div className="promo-row" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input 
                type="text" 
                placeholder="Entrez votre code" 
                value={promoCodeInput}
                onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button 
                type="button" 
                onClick={handleApplyPromo}
                disabled={promoLoading}
                style={{ padding: '0 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                {promoLoading ? '...' : 'Appliquer'}
              </button>
            </div>
            {promoError && <p style={{ color: '#c62828', fontSize: '0.85rem', marginTop: '8px' }}>{promoError}</p>}
            {appliedPromo && <p style={{ color: '#2e7d32', fontSize: '0.85rem', marginTop: '8px', fontWeight: 600 }}>✅ Code {appliedPromo.code} appliqué (-{appliedPromo.discountPercent}%)</p>}
          </div>

          <div style={{ background: '#f8f8f8', padding: '20px', borderRadius: '8px', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Sous-total</span>
              <span>{orderTotal.toLocaleString()} FCFA</span>
            </div>
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2e7d32', fontWeight: 600 }}>
                <span>Réduction ({appliedPromo.code})</span>
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
