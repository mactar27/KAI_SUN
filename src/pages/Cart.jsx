import React, { useContext } from 'react';
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

  const total = calculateCartTotal(cart);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await placeOrder(formData, 0, null);
      setIsSubmitted(true);
    } catch (err) {
      alert("Une erreur s'est produite lors de la validation. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="section container text-center animate-fade-in" style={{ paddingTop: '150px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 className="section-title" style={{ marginBottom: '1rem' }}>Commande Confirmée !</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#555', maxWidth: '500px' }}>
          Merci {formData.prenom} ! Votre commande de <strong>{total.toLocaleString()} FCFA</strong> a bien été enregistrée. 
          Notre équipe va vous contacter sur WhatsApp au <strong>{formData.phone}</strong> pour organiser la livraison.
        </p>
        <Link to="/" onClick={() => setIsSubmitted(false)} className="btn btn-primary">Continuer vos achats</Link>
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
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Prénom & Nom *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Mactar Ndiaye"
                  value={formData.prenom} 
                  onChange={(e) => setFormData({...formData, prenom: e.target.value, nom: e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Téléphone WhatsApp *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="Ex: 77 123 45 67"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', color: '#555' }}>Adresse / Quartier de livraison *</label>
                <input 
                  type="text" 
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
