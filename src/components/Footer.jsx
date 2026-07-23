import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import './Footer.css';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2>KAIA SUN</h2>
          <p>
            L'excellence visuelle au service de votre style. Découvrez notre collection de lunettes de soleil premium, 
            dessinées pour allier confort, élégance et protection absolue.
          </p>
        </div>

        <div className="footer-links">
          <h4>Boutique</h4>
          <ul>
            <li><Link to="/homme">Collection Homme</Link></li>
            <li><Link to="/femme">Collection Femme</Link></li>
            <li><Link to="#">Nouveautés</Link></li>
            <li><Link to="#">Guide des Tailles</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Assistance</h4>
          <ul>
            <li><Link to="#">Contactez-nous</Link></li>
            <li><Link to="#">Livraison & Retours</Link></li>
            <li><Link to="#">FAQ</Link></li>
            <li><Link to="#">Entretien des verres</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Restez Informé(e)</h4>
          <p>Rejoignez le club Kaia Sun pour des offres exclusives et avant-premières.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Votre email" required />
            <button type="submit">→</button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Kaia Sun. Tous droits réservés.</p>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram"><InstagramIcon /></a>
          <a href="#" aria-label="Facebook"><FacebookIcon /></a>
          <a href="#" aria-label="Twitter"><TwitterIcon /></a>
          <a href="#" aria-label="Mail"><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
