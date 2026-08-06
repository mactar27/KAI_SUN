import React from 'react';

const NAV_LINKS = ['Accueil', 'À propos', 'Collection', 'Contact'];

export default function LaunchPage() {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      <style>{`
        * { box-sizing: border-box; }
        .lp-nav { padding: 0 48px; }
        .lp-nav-links { display: flex !important; }
        .lp-histoire { grid-template-columns: 1fr 1fr; }
        .lp-features { grid-template-columns: repeat(3, 1fr); padding: 48px 60px; }
        .lp-collection { grid-template-columns: 1fr 2fr; }
        .lp-col-right { grid-template-columns: repeat(3, 1fr); }
        .lp-footer-btns { flex-direction: row; }
        .lp-logo-text { font-family: "Playfair Display", serif; font-size: 1.7rem; font-weight: 600; letter-spacing: 0.05em; color: #111; line-height: 1; }
        .lp-logo-sub { font-size: 0.6rem; color: var(--kaia-gold); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 5px; font-weight: 600; white-space: nowrap; }
        
        @media (max-width: 900px) {
          .lp-nav { padding: 0 16px; }
          .lp-nav-links { display: none !important; }
          .lp-logo-text { font-size: 1.3rem !important; }
          .lp-logo-sub { font-size: 0.5rem !important; }
          .lp-nav-right { gap: 8px !important; }
          .lp-histoire { grid-template-columns: 1fr !important; }
          .lp-features { grid-template-columns: 1fr !important; padding: 48px 24px !important; gap: 40px !important; }
          .lp-collection { grid-template-columns: 1fr !important; }
          .lp-col-right { grid-template-columns: repeat(3, 1fr) !important; }
          .lp-collection-text { padding: 48px 24px !important; }
          .lp-histoire-text { padding: 48px 24px !important; }
          .lp-hero-text { padding: 40px 24px !important; }
          .lp-footer-btns { flex-direction: column !important; align-items: stretch !important; }
          .lp-footer-btns a { justify-content: center !important; }
        }
      `}</style>

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav className="lp-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: '#F5F0E8', borderBottom: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px'
      }}>
        {/* Left spacer for centering */}
        <div style={{ flex: 1 }}></div>

        {/* Center logo */}
        <div style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
          <div className="lp-logo-text">KAÏA SUN</div>
          <div className="lp-logo-sub">Dakar, Sénégal</div>
        </div>

        {/* Right actions */}
        <div className="lp-nav-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', flex: 1 }}>
          <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', color: '#333' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
          <a href="https://instagram.com/kaiasun" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', color: '#333' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <button onClick={scrollToCollection} style={{
            backgroundColor: 'var(--kaia-green)', color: '#fff', border: 'none',
            padding: '10px 18px', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            borderRadius: '3px', whiteSpace: 'nowrap'
          }}>Réserver</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        minHeight: '90vh', overflow: 'hidden', marginTop: '72px'
      }}>
        <img
          src="/images/hderoapp.png"
          alt="Lunettes Kaïa Sun dans leur étui"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,18,14,0.78) 0%, rgba(10,18,14,0.4) 50%, rgba(10,18,14,0) 80%)'
        }} />
        <div className="lp-hero-text" style={{ position: 'relative', zIndex: 2, padding: '80px 60px', maxWidth: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kaia-gold)' }}>Nouvelle Collection</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--kaia-gold)', opacity: 0.6 }} />
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '20px'
          }}>
            <em style={{ color: 'var(--kaia-gold)', fontStyle: 'italic' }}>L'élégance commence par le regard</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '36px', maxWidth: '380px' }}>
            Découvrez en avant-première nos lunettes premium.<br />La collection officielle sera disponible prochainement.
          </p>
          <button onClick={scrollToCollection} style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'var(--kaia-green)', color: '#fff', border: 'none',
            padding: '14px 28px', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            borderRadius: '3px', transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >Être informé →</button>
        </div>
      </section>

      {/* NOTRE HISTOIRE */}
      <section className="lp-histoire" style={{ display: 'grid', backgroundColor: '#F5F0E8' }}>
        <div className="lp-histoire-text" style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kaia-gold)' }}>Notre Histoire</span>
            <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--kaia-gold)' }} />
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 400, lineHeight: 1.2, color: '#111', marginBottom: '28px'
          }}>Façonnée à l'image de chacun</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.8, maxWidth: '400px' }}>
            Des montures intemporelles, des matériaux de qualité, et un savoir-faire sélectif pour sublimer chaque regard.
          </p>
        </div>
        <div style={{ minHeight: '480px', overflow: 'hidden' }}>
          <img src="/images/histoire_chatgpt.png" alt="Ambiance Kaïa Sun" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#F5F0E8' }}>
        <div className="lp-features" style={{ display: 'grid', gap: '32px' }}>
          {[
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, title: 'PROTECTION UV400', sub: 'Une protection maximale contre les rayons UVA & UVB.' },
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: 'MATÉRIAUX PREMIUM', sub: 'Acétate de haute qualité, charnières renforcées, finitions soignées.' },
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6 22v-4a6 6 0 0 1 12 0v4"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/></svg>, title: 'DESIGN INTEMPOREL', sub: 'Des montures élégantes qui traversent le temps.' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{ color: 'var(--kaia-gold)', flexShrink: 0, marginTop: '4px', opacity: 0.85 }}>{f.icon}</div>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#111', marginBottom: '8px' }}>{f.title}</p>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.65 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTION TEASER */}
      <section id="collection" className="lp-collection" style={{ display: 'grid', backgroundColor: '#F5F0E8' }}>
        <div className="lp-collection-text" style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kaia-gold)' }}>Collection</span>
            <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--kaia-gold)' }} />
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 400, lineHeight: 1.2, color: '#111', marginBottom: '36px'
          }}>Un aperçu de ce qui vous attend.</h2>
          <button onClick={() => window.open('https://wa.me/221770000000?text=Bonjour, je souhaite être informé(e) de la collection Kaïa Sun !', '_blank')} style={{
            alignSelf: 'flex-start', backgroundColor: 'var(--kaia-green)', color: '#fff',
            border: 'none', padding: '14px 28px', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '3px'
          }}>Découvrir bientôt</button>
        </div>
        <div className="lp-col-right" style={{ display: 'grid', gap: '2px' }}>
          {['Apercu_1.png', 'Apercu_2.png', 'Apercu_3.png'].map((img, i) => (
            <div key={i} style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={`/images/${img}`} alt={`Aperçu ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: 'var(--kaia-green)', padding: '80px 40px', textAlign: 'center', color: '#fff' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--kaia-gold)', marginBottom: '16px' }}>Réservation Anticipée</p>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: '8px', fontWeight: 400 }}>
          Soyez parmi les premiers à découvrir la collection.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', marginBottom: '40px' }}>Rejoignez la liste d'attente — disponible en exclusivité.</p>
        <div className="lp-footer-btns" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
          {[
            { href: 'https://wa.me/221770000000?text=Bonjour, je souhaite réserver une paire Kaïa Sun !', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>, label: 'Réserver sur WhatsApp' },
            { href: 'https://instagram.com/kaiasun', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, label: 'Suivre sur Instagram' },
          ].map(btn => (
            <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '3px',
              padding: '14px 24px', color: '#fff', textDecoration: 'none',
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >{btn.icon}{btn.label}</a>
          ))}
        </div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--kaia-gold)', letterSpacing: '0.08em', marginBottom: '8px' }}>KAÏA SUN</div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px' }}>Dakar, Sénégal</div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} Kaïa Sun. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
