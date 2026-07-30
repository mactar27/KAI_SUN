import React, { useContext, useState } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { ShopContext, calculateCartTotal } from '../context/ShopContext';

const Cart = () => {
  const { products } = useContext(ProductsContext);
  const { cart, removeFromCart, placeOrder, clearCart } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    phone: '',
    ville: 'Dakar'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState(null);

  const total = calculateCartTotal(cart);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    const orderTotal = calculateCartTotal(cart);
    const orderItems = [...cart];
    try {
      await placeOrder(formData, 0, null);
      setConfirmedDetails({
        prenom: formData.prenom,
        phone: formData.phone,
        adresse: formData.adresse,
        total: orderTotal,
        items: orderItems
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("Une erreur s'est produite lors de la validation. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && confirmedDetails) {
    const waText = encodeURIComponent(`Bonjour KAÏA SUN, je viens de passer la commande de ${confirmedDetails.total.toLocaleString()} FCFA pour ${confirmedDetails.prenom} (${confirmedDetails.phone}). Merci de me confirmer la livraison à ${confirmedDetails.adresse} !`);
    const waUrl = `https://wa.me/221773519128?text=${waText}`;

    return (
      <div className="section container animate-fade-in" style={{ paddingTop: '140px', paddingBottom: '80px', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', background: '#fff', borderRadius: '24px', border: '1px solid rgba(13, 40, 35, 0.1)', padding: '40px 30px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          
          <div style={{ width: '72px', height: '72px', background: 'rgba(102, 165, 155, 0.12)', color: '#4a8f84', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
            ✓
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'var(--kaia-green)', marginBottom: '12px', fontWeight: 600 }}>
            Commande Confirmée !
          </h1>
          
          <p style={{ fontSize: '1.05rem', color: '#555', marginBottom: '32px', lineHeight: 1.6 }}>
            Merci <strong>{confirmedDetails.prenom}</strong> ! Votre commande a bien été enregistrée. Notre équipe prépare vos lunettes pour la livraison à <strong>{confirmedDetails.adresse}</strong>.
          </p>

          {/* RECAP CARD */}
          <div style={{ background: '#fcfbf7', border: '1px solid #eee', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '16px', fontWeight: 700 }}>Détail de votre commande</h3>
            
            {confirmedDetails.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: i === confirmedDetails.items.length - 1 ? 'none' : '1px dashed #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '4px', border: '1px solid #eee' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#777' }}>Qté: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>
                  {(item.product.price * item.quantity).toLocaleString()} FCFA
                </div>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #111', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--kaia-green)' }}>
              <span>TOTAL PAYABLE À LA LIVRAISON</span>
              <span>{confirmedDetails.total.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', padding: '16px', background: '#25D366', color: '#fff', fontWeight: 700, borderRadius: '100px', textDecoration: 'none', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
            >
              💬 Contacter le Service Client sur WhatsApp
            </a>
            
            <Link 
              to="/" 
              onClick={() => { setIsSubmitted(false); setConfirmedDetails(null); }} 
              style={{ display: 'block', width: '100%', padding: '16px', background: '#111', color: '#fff', fontWeight: 600, borderRadius: '100px', textDecoration: 'none', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Continuer mes achats
            </Link>
          </div>

        </div>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="glass-panel checkout-panel" style={{ background: '#fafafa', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif & Livraison</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-light)' }}>
              <span>Sous-total</span>
              <span style={{ fontWeight: 600, color: '#111' }}>{total.toLocaleString()} FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
              <span>Livraison</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>Gratuite (Dakar)</span>
            </div>
            
            {totalQuantity >= 2 && (
              <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '0.85rem' }}>
                🎉 Promo appliquée : -10 000 FCFA sur la 2ème paire !
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', color: '#111' }}>
              <span>Total</span>
              <span>{total.toLocaleString()} FCFA</span>
            </div>

            {/* FAST DELIVERY FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label htmlFor="cart_prenom" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Prénom & Nom *</label>
                <input 
                  id="cart_prenom"
                  name="name"
                  type="text" 
                  autoComplete="name"
                  required 
                  placeholder="Ex: Mactar Ndiaye"
                  value={formData.prenom} 
                  onChange={(e) => setFormData({...formData, prenom: e.target.value, nom: e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
              </div>
              
              <div>
                <label htmlFor="cart_phone" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Téléphone WhatsApp *</label>
                <input 
                  id="cart_phone"
                  name="phone"
                  type="tel" 
                  autoComplete="tel"
                  required 
                  placeholder="Ex: 77 123 45 67"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
              </div>

              <div>
                <label htmlFor="cart_adresse" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Adresse / Quartier de livraison *</label>
                <input 
                  id="cart_adresse"
                  name="address"
                  type="text" 
                  autoComplete="street-address"
                  required 
                  placeholder="Ex: Almadies, près du restaurant X"
                  value={formData.adresse} 
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', background: '#111', color: '#fff', border: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              {isSubmitting ? 'Validation en cours...' : 'PASSER MA COMMANDE (PAIEMENT À LA LIVRAISON)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
