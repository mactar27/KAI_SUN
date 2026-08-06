import React, { useState } from 'react';
import { products } from '../data/products';

// Curated collection with elegant Kaïa naming
const kaiaCurated = [
  { id: 1, code: 'KAÏA 01', desc: 'Écaille classique', image: products[0]?.image },
  { id: 2, code: 'KAÏA 02', desc: 'Rose translucide',  image: products[3]?.image },
  { id: 3, code: 'KAÏA 03', desc: 'Brun caramel',      image: products[2]?.image },
  { id: 4, code: 'KAÏA 04', desc: 'Noir intemporel',   image: products[4]?.image },
  { id: 5, code: 'KAÏA 05', desc: 'Écaille solaire',   image: products[1]?.image },
];

const NAV_LINKS = ['Accueil', 'Collection', 'À propos', 'Contact'];

export default function LaunchPage() {
  const [navOpen, setNavOpen] = useState(false);

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: '#F9F7F2',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '72px'
      }}>
        {/* Left links */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {NAV_LINKS.slice(0, 2).map(l => (
            <span key={l} style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>

        {/* Center logo */}
        <div style={{ textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: '0.06em', lineHeight: 1 }}>KAÏA SUN</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: 'var(--kaia-gold)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Dakar, Sénégal</p>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {NAV_LINKS.slice(2).map(l => (
            <span key={l} style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111', cursor: 'pointer', display: 'none' }}>{l}</span>
          ))}
          {/* WhatsApp */}
          <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" title="WhatsApp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="https://instagram.com/kaiasun" target="_blank" rel="noopener noreferrer" title="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          {/* Reserve CTA */}
          <button onClick={scrollToCollection} style={{
            backgroundColor: 'var(--kaia-green)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}>
            Réserver
          </button>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section style={{
        paddingTop: '72px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '88vh'
      }}>
        {/* Left - Text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 60px 60px 60px',
          backgroundColor: '#F9F7F2'
        }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#111',
            marginBottom: '24px'
          }}>
            L'élégance<br />
            à la sénégalaise,<br />
            <span style={{ fontStyle: 'italic', color: 'var(--kaia-gold)' }}>très bientôt.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.7, maxWidth: '340px', marginBottom: '36px' }}>
            Découvrez en avant-première nos modèles de lunettes premium.
          </p>
          <button onClick={scrollToCollection} style={{
            alignSelf: 'flex-start',
            backgroundColor: 'var(--kaia-gold)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            Découvrir la collection →
          </button>
        </div>

        {/* Right - Hero video */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/images/hero_video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ─── COLLECTION ─────────────────────────────────────── */}
      <section id="collection" style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#111' }}></div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#111' }}>
              Aperçu de la collection
            </span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#111' }}></div>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#888', fontStyle: 'italic' }}>
            Des montures uniques, pensées pour sublimer chaque regard.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {kaiaCurated.map((item) => (
            <div key={item.id} style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '4px',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s',
            }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Image */}
              <div style={{ padding: '32px 24px 24px', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <img
                  src={item.image}
                  alt={item.code}
                  style={{ width: '85%', height: 'auto', objectFit: 'contain', transition: 'transform 0.4s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              {/* Info */}
              <div style={{ padding: '18px 24px 22px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 6px', fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {item.code}
                </h4>
                <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#888', fontStyle: 'italic' }}>{item.desc}</p>
                <div style={{ width: '28px', height: '2px', backgroundColor: 'var(--kaia-gold)', margin: '0 auto' }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES BAR ──────────────────────────────────── */}
      <section style={{
        backgroundColor: 'var(--kaia-green)',
        padding: '40px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        textAlign: 'center'
      }}>
        {[
          { icon: '🛡', title: 'Qualité Premium', sub: 'Matériaux de haute qualité' },
          { icon: '☀', title: 'Protection UV400', sub: 'Protection maximale' },
          { icon: '🚚', title: 'Livraison rapide', sub: 'Rapide & sécurisée' },
        ].map(f => (
          <div key={f.title} style={{ color: '#fff' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px', filter: 'brightness(2)' }}>{f.icon}</div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--kaia-gold)' }}>{f.title}</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{f.sub}</p>
          </div>
        ))}
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: 'var(--kaia-green)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '60px 40px 40px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: 'var(--kaia-gold)', marginBottom: '16px' }}>
          KAÏA SUN
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px', fontSize: '0.9rem' }}>
          Contactez-nous pour toute demande de réservation anticipée.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
          <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(255,255,255,0.4)', borderRadius: '4px',
            padding: '10px 20px', color: '#fff', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            WhatsApp
          </a>
          <a href="https://instagram.com/kaiasun" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(255,255,255,0.4)', borderRadius: '4px',
            padding: '10px 20px', color: '#fff', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} Kaïa Sun. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
