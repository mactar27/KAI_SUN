import React from 'react';
import { products } from '../data/products';

const LaunchPage = () => {
  // We can select a few top products or all of them. Let's show all of them.
  const displayProducts = products;

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <header style={{
        padding: '32px 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--line)',
        backgroundColor: '#fff'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.05em' }}>KAÏA SUN</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Dakar, Sénégal
        </p>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        backgroundColor: 'var(--kaia-cream)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontStyle: 'italic' }}>
            La nouvelle collection arrive très bientôt
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '32px' }}>
            Découvrez en exclusivité nos modèles premium. Le site officiel est en cours de finalisation, mais vous pouvez déjà repérer vos coups de cœur.
          </p>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--kaia-gold)', margin: '0 auto' }}></div>
        </div>
      </section>

      {/* Collection Grid */}
      <section style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>Notre Collection</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '40px',
        }}>
          {displayProducts.map((product) => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                position: 'relative',
                aspectRatio: '1',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--kaia-gold)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Teasing
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{product.name}</h4>
                <div style={{ 
                  display: 'inline-block',
                  border: '1px solid var(--kaia-gold)',
                  color: 'var(--kaia-gold)',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginTop: '12px'
                }}>
                  Bientôt disponible
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 20px',
        backgroundColor: 'var(--ink)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.5rem' }}>Restons en contact</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Pour toute question ou demande de réservation anticipée, n'hésitez pas à nous contacter sur WhatsApp ou Instagram.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '48px' }}>
            <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span>WhatsApp</span>
            </a>
            <a href="https://instagram.com/kaiasun" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span>Instagram</span>
            </a>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Kaïa Sun. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaunchPage;
