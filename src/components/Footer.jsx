import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-col">
          <div className="logo" style={{ fontWeight: 'bold' }}>KAIA SUN</div>
          <p className="foot-tagline">Lunettes de soleil pour la lumière franche de Dakar. Qualité premium, design intemporel.</p>
          <div style={{ marginTop: 'auto' }}>
            <div className="foot-rating">★★★★★ 4.9/5</div>
            <div style={{ fontSize: '11px', color: '#B9B6AC', marginTop: '4px' }}>Basé sur +500 avis vérifiés</div>
          </div>
        </div>

        <div className="foot-col">
          <div className="foot-heading">Boutique</div>
          <a href="/#collection">Femme</a>
          <a href="/#collection">Homme</a>
          <a href="/#collection">Nouveautés</a>
          <a href="/#collection">Accessoires</a>
        </div>

        <div className="foot-col">
          <div className="foot-heading">Service client</div>
          <Link to="/">Contact</Link>
          <Link to="/">Livraison & Retours</Link>
          <Link to="/">FAQ</Link>
          <Link to="/">Suivi de commande</Link>
        </div>

        <div className="foot-col">
          <div className="foot-heading">Légal</div>
          <Link to="/">Conditions Générales</Link>
          <Link to="/">Politique de confidentialité</Link>
          <Link to="/">Mentions légales</Link>
        </div>
      </div>
      
      <div className="wrap">
        <div className="foot-bottom">
          <span>© 2026 Kaia. Tous droits réservés. | Réalisé par <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>WockyTeh</a></span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/">Instagram</Link>
            <Link to="/">TikTok</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
