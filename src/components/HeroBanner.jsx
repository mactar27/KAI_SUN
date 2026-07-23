import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="hero-content animate-fade-in">
          <h1>L'Élégance<br/>au Soleil</h1>
          <div className="hero-separator"></div>
          <p>Découvrez notre nouvelle collection<br/>inspirée par la chaleur de l'été.</p>
          <div className="hero-buttons">
            <Link to="/homme" className="btn btn-primary" style={{ minWidth: '150px' }}>HOMME</Link>
            <Link to="/femme" className="btn btn-outline-white" style={{ minWidth: '150px' }}>FEMME</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
