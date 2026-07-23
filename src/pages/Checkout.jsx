import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    placeOrder(formData);
    clearCart(); // Make sure to clear cart upon order
    setIsSubmitted(true);
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
    border: '1px solid var(--color-border)',
    borderRadius: '0px',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    backgroundColor: 'transparent'
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-text-light)'
  };

  return (
    <div className="section container animate-fade-in" style={{ paddingTop: '150px', maxWidth: '800px', minHeight: '80vh' }}>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>Informations de Livraison</h1>
      
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '0px', backgroundColor: '#fafafa', border: '1px solid var(--color-border)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="prenom" style={labelStyle}>Prénom</label>
              <input type="text" id="prenom" required value={formData.prenom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="nom" style={labelStyle}>Nom</label>
              <input type="text" id="nom" required value={formData.nom} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label htmlFor="adresse" style={labelStyle}>Adresse de livraison</label>
            <input type="text" id="adresse" placeholder="Numéro et rue" required value={formData.adresse} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
          </div>

          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="ville" style={labelStyle}>Ville / Quartier</label>
              <input type="text" id="ville" required value={formData.ville} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label htmlFor="phone" style={labelStyle}>Numéro de téléphone</label>
              <input type="tel" id="phone" placeholder="+221 ..." required value={formData.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', padding: '1.2rem' }}>
            Confirmer la commande
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
