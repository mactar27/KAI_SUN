import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import './Footer.css';

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
          <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
          <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
          <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
          <a href="#" aria-label="Mail"><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
