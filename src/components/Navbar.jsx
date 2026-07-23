import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="promo-bar" id="promoBar">
        <div className="promo-track">
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>GARANTIE 2 ANS SUR TOUTES LES MONTURES</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
          <span>LIVRAISON OFFERTE DÈS 2 PAIRES ACHETÉES</span>
          <span>GARANTIE 2 ANS SUR TOUTES LES MONTURES</span>
          <span>PAIEMENT À LA LIVRAISON DISPONIBLE À DAKAR</span>
        </div>
      </div>

      <nav id="nav">
        <div className="wrap">
          <Link to="/" className="logo">
            KAIA <span>SUN</span>
          </Link>
          <div className="nav-links">
            <Link to="/#collection">Collection</Link>
            <Link to="/#savoir-faire">Savoir-faire</Link>
            <Link to="/#avis">Avis</Link>
            {/* Added a link to the cart so we don't lose that functionality */}
            <Link to="/panier">Panier</Link>
          </div>
          <Link to="/#collection" className="nav-cta">Voir la collection</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
