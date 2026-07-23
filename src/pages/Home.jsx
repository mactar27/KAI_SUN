import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sun, Eye } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { products } = useContext(ShopContext);
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <HeroBanner />
      
      <section className="section container animate-fade-in" style={{ backgroundColor: '#F6F6F6', maxWidth: '100%', padding: '5rem 5%' }}>
        <p style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 600 }}>Nouveauté</p>
        <h2 className="section-title">Nouvelle Collection</h2>
        <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/homme" className="btn btn-outline" style={{ padding: '1rem 3rem', backgroundColor: 'white' }}>Découvrir la sélection</Link>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>La Différence Kaia Sun</h2>
          <div className="grid grid-cols-3 text-center" style={{ gap: '4rem' }}>
            <div>
              <ShieldCheck size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Protection UV 400</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Une protection absolue contre les rayons nocifs, certifiée pour votre sécurité visuelle.</p>
            </div>
            <div>
              <Sun size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Filtre Polarisant</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Éliminez les reflets gênants et redécouvrez le monde avec un contraste et une clarté parfaits.</p>
            </div>
            <div>
              <Eye size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Design Avant-Garde</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Des montures dessinées pour allier confort absolu et esthétique intemporelle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
