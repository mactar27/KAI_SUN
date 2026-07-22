import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Checkout = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { cart, placeOrder } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    cp: '',
    ville: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    placeOrder(formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="section container text-center" style={{ paddingTop: '150px' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Merci pour votre commande !</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Votre commande a bien été prise en compte et sera préparée très prochainement.
        </p>
        <Link to="/" className="btn btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="section container text-center" style={{ paddingTop: '150px' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Votre panier est vide</h1>
        <Link to="/" className="btn btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  return (
    <div className="section container" style={{ paddingTop: '120px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Informations de Livraison</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="prenom">Prénom</label>
              <input type="text" id="prenom" required value={formData.prenom} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="nom">Nom</label>
              <input type="text" id="nom" required value={formData.nom} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="adresse">Adresse de livraison</label>
            <input type="text" id="adresse" placeholder="Numéro et rue" required value={formData.adresse} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
          </div>

          <div className="grid grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cp">Code Postal</label>
              <input type="text" id="cp" required value={formData.cp} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="ville">Ville</label>
              <input type="text" id="ville" required value={formData.ville} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Confirmer la commande
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
