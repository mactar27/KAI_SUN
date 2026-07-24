import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './../context/ShopContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { cart } = useContext(ShopContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <div className="promo-bar" id="promoBar">
        <div className="promo-track">
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>PROMO : UNE ACHETÉE, LA DEUXIÈME À 10 000 FCFA</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>PROMO : UNE ACHETÉE, LA DEUXIÈME À 10 000 FCFA</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
        </div>
      </div>

      <nav id="nav">
        <div className="wrap">
          <Link to="/" className="logo" style={{ fontWeight: 'bold', color: '#000000' }}>
            KAIA SUN
          </Link>

          {/* DESKTOP NAV */}
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
            <a href="/#collection" className="nav-cta hide-on-mobile">Voir la collection</a>
            
            {/* MOBILE MENU BUTTON */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', padding: '4px' }}
            >
              {isMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <a href="/#collection" onClick={() => setIsMenuOpen(false)}>Collection</a>
            <a href="/#savoir-faire" onClick={() => setIsMenuOpen(false)}>Savoir-faire</a>
            <a href="/#avis" onClick={() => setIsMenuOpen(false)}>Avis</a>
            <a href="/#collection" className="mobile-menu-cta" onClick={() => setIsMenuOpen(false)}>Voir la collection</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
