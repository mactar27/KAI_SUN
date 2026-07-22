import React, { useContext } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { products } = useContext(ShopContext);
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <HeroBanner />
      
      <section className="section container animate-fade-in">
        <h2 className="text-center" style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Nouveautés</h2>
        <div className="grid grid-cols-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#F9F8F6', color: 'var(--color-primary)' }}>
        <div className="container text-center" style={{ padding: '4rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 400 }}>L'Excellence du Soleil</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
            Découvrez une sélection rigoureuse de montures alliant style intemporel et protection optimale. 
            Chez Kaia Sun, nous croyons que chaque visage mérite son propre éclat. Dessinées pour vous.
          </p>
          <button className="btn btn-outline" style={{ marginTop: '2rem' }}>Découvrir notre histoire</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
