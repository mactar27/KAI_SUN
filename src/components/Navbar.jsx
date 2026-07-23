import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from './../context/ShopContext';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { cart } = useContext(ShopContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div className="promo-bar" id="promoBar">
        <div className="promo-track">
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>PROMO : UNE ACHETÉE, LA DEUXIÈME À 5000 FCFA</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>PROMO : UNE ACHETÉE, LA DEUXIÈME À 5000 FCFA</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
        </div>
      </div>

      <nav id="nav">
        <div className="wrap">
          <Link to="/" className="logo" style={{ fontWeight: 'bold', color: '#000000' }}>
            KAIA SUN
          </Link>
          <div className="nav-links">
            <a href="/#collection">Collection</a>
            <a href="/#savoir-faire">Savoir-faire</a>
            <a href="/#avis">Avis</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/panier" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
              <ShoppingBag size={24} strokeWidth={2.5} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#F4C430',
                  color: '#111',
                  fontSize: '10px',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #5EB8EA'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>
            <a href="/#collection" className="nav-cta">Voir la collection</a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
