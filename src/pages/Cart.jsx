import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { cart, removeFromCart } = useContext(ShopContext);

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="section container text-center" style={{ paddingTop: '150px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="section-title">Votre Panier</h1>
        <p style={{ marginBottom: '3rem', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>Votre panier est actuellement vide.</p>
        <Link to="/" className="btn btn-primary">Continuer vos achats</Link>
      </div>
    );
  }

  return (
    <div className="section container animate-fade-in" style={{ paddingTop: '150px', minHeight: '80vh' }}>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>Votre Panier</h1>
      
      <div className="grid grid-cols-3" style={{ gap: '4rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
              <div style={{ width: '140px', height: '140px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product.name}</h3>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Quantité: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 500, fontSize: '1.2rem' }}>{item.product.price} FCFA</p>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-light)', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', transition: 'color 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-light)'}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '0px', backgroundColor: '#fafafa', border: '1px solid var(--color-border)' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', fontFamily: 'var(--font-body)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-light)' }}>
              <span>Sous-total</span>
              <span>{total} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--color-text-light)' }}>
              <span>Livraison</span>
              <span>Calculée à l'étape suivante</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.3rem', marginBottom: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', color: 'var(--color-primary)' }}>
              <span>Total</span>
              <span>{total} FCFA</span>
            </div>
            
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '1.2rem' }}>
              Passer à la caisse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
