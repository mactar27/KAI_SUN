import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './../context/ShopContext';
import { ShoppingBag, Menu, X, Truck, Lock, RefreshCw, Search, User, Home } from 'lucide-react';
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
      <div className="promo-bar">
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
          <div className="nav-links" style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', gap: '30px' }}>
            <a href="/#collection">Collection</a>
            <a href="/#savoir-faire">Savoir-faire</a>
            <a href="/#histoire">Notre Histoire</a>
            <a href="/#avis">Avis</a>
          </div>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', color: navColor }}>
            <AudioPlayer color={navColor} />
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }}>
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }}>
              <User size={22} strokeWidth={1.5} />
            </button>
            <Link to="/panier" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: navColor }}>
              <ShoppingBag size={22} strokeWidth={1.5} />
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
            {/* MOBILE MENU BUTTON (Hidden on app-layout, moved to bottom bar) */}
            {/* The hamburger is kept here in DOM but hidden via CSS .mobile-menu-btn display:none on mobile to enforce bottom bar */}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <a href="/#collection" onClick={() => setIsMenuOpen(false)}>Collection</a>
            <a href="/#histoire" onClick={() => setIsMenuOpen(false)}>Notre Histoire</a>
            <a href="/#avis" onClick={() => setIsMenuOpen(false)}>Avis</a>
            <Link to="/panier" onClick={() => setIsMenuOpen(false)}>Mon Panier</Link>
            <button onClick={() => setIsMenuOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--ink)' }}>
              <X size={32} />
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM APP BAR */}
      <div className="bottom-app-bar">
        <Link to="/" onClick={() => setIsMenuOpen(false)} className={isHomePage ? 'active' : ''}>
          <Home size={22} strokeWidth={1.5} />
          Accueil
        </Link>
        <a href="/#collection" onClick={() => setIsMenuOpen(false)}>
          <Search size={22} strokeWidth={1.5} />
          Boutique
        </a>
        <Link to="/panier" onClick={() => setIsMenuOpen(false)} style={{ position: 'relative' }}>
          <ShoppingBag size={22} strokeWidth={1.5} />
          Panier
          {cartItemCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '15px', background: '#F4C430', color: '#111', fontSize: '9px', fontWeight: 900, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {cartItemCount}
            </span>
          )}
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isMenuOpen ? 'active' : ''}>
          <Menu size={22} strokeWidth={1.5} />
          Menu
        </button>
      </div>
    </>
  );
};

export default Navbar;
