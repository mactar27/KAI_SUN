import React from 'react';
import { products } from '../data/products';

const LaunchPage = () => {
  // Take first 12 products or all, remove the supplier name from display
  const displayProducts = products.map(p => ({
    ...p,
    displayName: p.name.split('(')[0].trim()
  }));

  return (
    <div style={{ backgroundColor: '#FCFBF7', minHeight: '100vh', width: '100%', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <header style={{
        padding: '40px 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2.5rem', 
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--ink)'
        }}>KAÏA SUN</h1>
        <p style={{ 
          margin: '12px 0 0', 
          color: 'var(--kaia-gold)', 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em',
          fontWeight: 600
        }}>
          Dakar, Sénégal
        </p>
      </header>

      {/* Hero Section - Fullscreen Video */}
      <section style={{
        position: 'relative',
        height: '90vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src="/images/hero_video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
          zIndex: 1
        }}></div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#fff',
            marginBottom: '24px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
          }}>
            L'élégance à la sénégalaise,<br />
            <span style={{ fontStyle: 'italic', color: 'var(--kaia-gold)' }}>très bientôt.</span>
          </h2>
          <p style={{ 
            fontSize: '1.05rem', 
            color: 'rgba(255,255,255,0.85)', 
            lineHeight: 1.8, 
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            Découvrez en avant-première nos modèles de lunettes premium.<br />
            La collection officielle sera disponible prochainement.
          </p>
        </div>
      </section>


      {/* Collection Grid */}
      <section style={{ padding: '40px 40px 100px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--line)' }}></div>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            Aperçu de la collection
          </h3>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--line)' }}></div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '60px 40px',
        }}>
          {displayProducts.map((product) => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', group: 'true' }}>
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                backgroundColor: '#fff',
                overflow: 'hidden',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <img 
                  src={product.image} 
                  alt={product.displayName}
                  style={{
                    width: '90%',
                    height: 'auto',
                    objectFit: 'contain',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '12px', 
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 500,
                  color: 'var(--ink)'
                }}>
                  {product.displayName}
                </h4>
                
                <span style={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: 'var(--kaia-gold)',
                  fontWeight: 600
                }}>
                  Disponible Bientôt
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '80px 20px',
        backgroundColor: 'var(--kaia-green)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ 
            fontFamily: '"Playfair Display", serif', 
            fontSize: '2rem', 
            marginBottom: '24px',
            color: 'var(--kaia-gold)'
          }}>KAÏA SUN</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Contactez-nous pour toute demande de réservation anticipée.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '60px' }}>
            <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem'
            }}>
              WhatsApp
            </a>
            <a href="https://instagram.com/kaiasun" target="_blank" rel="noopener noreferrer" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem'
            }}>
              Instagram
            </a>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            &copy; {new Date().getFullYear()} KAÏA SUN. TOUS DROITS RÉSERVÉS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaunchPage;
