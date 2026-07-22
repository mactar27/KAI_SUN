import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { cart, removeFromCart } = useContext(ShopContext);

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="section container text-center" style={{ paddingTop: '150px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Votre Panier</h1>
        <p style={{ marginBottom: '2rem' }}>Votre panier est actuellement vide.</p>
        <Link to="/" className="btn btn-primary">Continuer vos achats</Link>
      </div>
    );
  }

  return (
    <div className="section container" style={{ paddingTop: '120px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Votre Panier</h1>
      
      <div className="grid grid-cols-3">
        <div style={{ gridColumn: 'span 2' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
              <img src={item.product.image} alt={item.product.name} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.product.name}</h3>
                <p style={{ color: 'var(--color-text-light)' }}>Quantité: {item.quantity}</p>
                <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>{item.product.price} FCFA</p>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ background: 'none', border: 'none', color: 'red', textDecoration: 'underline', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Récapitulatif</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Sous-total</span>
              <span>{total} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span>Livraison</span>
              <span>Calculée à l'étape suivante</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span>{total} FCFA</span>
            </div>
            
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
              Passer à la caisse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
