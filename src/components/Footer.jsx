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
          <Link to="/contact">Contact</Link>
          <Link to="/cgv">Livraison & Retours</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Suivi de commande</Link>
        </div>

        <div className="foot-col">
          <div className="foot-heading">Légal</div>
          <Link to="/cgv">Conditions Générales</Link>
          <Link to="/confidentialite">Politique de confidentialité</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>
      </div>
      
      <div className="wrap">
        <div className="foot-bottom">
          <span>© 2026 Kaia. Tous droits réservés. | Réalisé par <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>WockyTeh</a></span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="https://www.instagram.com/kai_asun?igsh=MjdkcDUyZHA5ZGtp" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#B9B6AC', display: 'flex', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#B9B6AC'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.facebook.com/share/198aD3athe/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: '#B9B6AC', display: 'flex', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#B9B6AC'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://snapchat.com/t/v4l6U8Ka" target="_blank" rel="noopener noreferrer" title="Snapchat" style={{ color: '#B9B6AC', display: 'flex', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#B9B6AC'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.5 2 6 4.5 6 8v1.5c-.8.2-1.5.8-1.5 1.5 0 .6.4 1.1 1 1.4-.3.8-.8 1.5-1.5 2.1-.3.3-.3.7 0 1 .5.5 1.8.8 3 .5.3.5.8.9 1.5.9.4 0 .8-.1 1.2-.2.3.1.6.2 1 .2.4 0 .7-.1 1-.2.4.1.8.2 1.2.2.7 0 1.2-.4 1.5-.9 1.2.3 2.5 0 3-.5.3-.3.3-.7 0-1-.7-.6-1.2-1.3-1.5-2.1.6-.3 1-.8 1-1.4 0-.7-.7-1.3-1.5-1.5V8c0-3.5-2.5-6-6-6z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
