import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './../context/ShopContext';
import { ShoppingBag, Menu, X, Truck, Lock, RefreshCw } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const Navbar = () => {
  const { cart } = useContext(ShopContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  // Determine if we are on the home page with the dark hero image
  const isHomePage = location.pathname === '/';
  const navColor = isHomePage ? '#faf9f6' : '#0d2823';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <div style={{ background: '#111', color: '#fff', fontSize: '0.75rem', fontWeight: 500, padding: '10px 0', display: 'flex', justifyContent: 'center', gap: '30px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 101, letterSpacing: '0.5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Truck size={14} /> Livraison offerte à Dakar
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} /> Paiement sécurisé
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Retours sous 14 jours
        </div>
      </div>

      <nav id="nav" style={{ '--nav-color': navColor, top: '35px' }}>
        <div className="wrap">
          <Link to="/" className="logo">
            KAÏA <span>SUNGLASSES</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-links">
            <a href="/#collection">Collection</a>
            <a href="/#savoir-faire">Savoir-faire</a>
            <a href="/#avis">Avis</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AudioPlayer color={navColor} />
            
            <Link to="/panier" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: navColor }}>
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
            <a href="/#collection" className="nav-cta hide-on-mobile" style={isHomePage ? { background: '#faf9f6', color: '#0d2823' } : {}}>Voir la collection</a>
            
            {/* MOBILE MENU BUTTON */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'none', border: 'none', color: navColor, cursor: 'pointer', padding: '4px' }}
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
