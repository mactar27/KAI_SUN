import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content animate-fade-in">
        <h1>L'Élégance au Soleil</h1>
        <p>Découvrez notre nouvelle collection inspirée par la chaleur de l'été.</p>
        <div className="hero-buttons">
          <Link to="/homme" className="btn btn-primary">Homme</Link>
          <Link to="/femme" className="btn btn-primary">Femme</Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
