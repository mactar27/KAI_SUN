import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const VariantSliderCard = ({ group, addToCart }) => {
  const { variants } = group;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = variants[currentIndex];
  
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const swipeOccurred = useRef(false);

  React.useEffect(() => {
    if (variants.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % variants.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [variants.length]);

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % variants.length);
  };
  
  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + variants.length) % variants.length);
  };

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    swipeOccurred.current = false;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 30) {
      swipeOccurred.current = true;
      setCurrentIndex((prev) => (prev + 1) % variants.length);
    } else if (distance < -30) {
      swipeOccurred.current = true;
      setCurrentIndex((prev) => (prev - 1 + variants.length) % variants.length);
    }
  };

  const handleLinkClick = (e) => {
    if (swipeOccurred.current) {
      e.preventDefault(); // Prevent navigating if we just swiped
    }
  };

  return (
    <div className="card" data-gender={currentProduct.gender}>
      <Link 
        to={`/product/${currentProduct.id}`} 
        style={{ display: 'block', textDecoration: 'none' }}
        onClick={handleLinkClick}
      >
        <div 
          className="card-photo" 
          style={{ 
            position: 'relative', 
            touchAction: 'pan-y',
            background: 'var(--kaia-cream)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img 
            src={currentProduct.image + '?width=600&height=600'} 
            alt={currentProduct.name} 
            loading="lazy" 
            style={{ 
              mixBlendMode: 'multiply',
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/f0f0f0/a0a0a0?text=Image+Indisponible' }} 
          />
          {variants.length > 1 && (
            <>
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
                {variants.map((v, idx) => (
                  <div key={v.id} style={{ width: 6, height: 6, borderRadius: '50%', background: idx === currentIndex ? 'var(--ink)' : 'rgba(0,0,0,0.2)' }} />
                ))}
              </div>
            </>
          )}
        </div>
      </Link>
      <div className="card-top">
        <span className="ref mono">RÉF. {currentProduct.ref}</span>
        <span className="badge-new">NOUVEAU</span>
      </div>
      <div className="colorway">
        Fournisseur — {currentProduct.gender.charAt(0).toUpperCase() + currentProduct.gender.slice(1)}
        {variants.length > 1 && <span style={{display: 'block', color: 'var(--ink)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500}}>{variants.length} coloris disponibles</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart({ id: currentProduct.id, name: currentProduct.name, price: 25000, image: currentProduct.image + '?width=600&height=600' });
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart } = useContext(ShopContext);
  const { products, loading } = useContext(ProductsContext);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <header className="hero" style={{ background: 'var(--kaia-green)', minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px', textAlign: 'center', color: '#fff' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Floating Gold Ball */}
          <div className="floating-gold-ball" style={{
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle at 30% 30%, #e2c079, #cba75c)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            marginBottom: '40px',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="12" r="7" />
              <circle cx="42" cy="12" r="7" />
              <path d="M25 12 Q30 7 35 12" />
              <path d="M11 12 L4 12" />
              <path d="M49 12 L56 12" />
            </svg>
          </div>

          {/* Title */}
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(32px, 8vw, 56px)', 
            fontWeight: 500, 
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: '40px',
            letterSpacing: '0.02em'
          }}>
            Là où le regard <br />
            <span style={{ fontStyle: 'italic', color: 'var(--kaia-gold)' }}>prend forme.</span>
          </h1>

          {/* Button */}
          <a href="#collection" style={{
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            padding: '16px 32px',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            marginBottom: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'background 0.2s'
          }}>
            Découvrir la collection
          </a>

          {/* Notre Histoire Link */}
          <a href="#histoire" style={{
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            NOTRE HISTOIRE <ArrowRight size={14} />
          </a>

        </div>
      </header>

      <section id="histoire" style={{ background: 'var(--kaia-green)', color: 'var(--kaia-gold)', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', alignItems: 'center' }}>
          
          <div style={{ zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#fff', letterSpacing: '0.1em' }}>KAIA SUN</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', opacity: 0.6 }}>HISTOIRE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', lineHeight: 1 }}>2</div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginTop: '8px' }}>CONTINENTS</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', lineHeight: 1 }}>3</div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginTop: '8px' }}>LIGNES DE MONTURE</div>
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', lineHeight: 1 }}>100%</div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginTop: '8px' }}>PROTECTION UV400</div>
            </div>
          </div>

          <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '60vw', maxWidth: '600px', opacity: 0.2, pointerEvents: 'none', zIndex: 1 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', transform: 'rotate(-15deg)' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--kaia-gold)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="var(--kaia-gold)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="var(--kaia-gold)" strokeWidth="0.5" />
              <circle cx="80" cy="50" r="2" fill="var(--kaia-gold)" />
            </svg>
          </div>

        </div>
      </section>




      
      <section id="collection" style={{ padding: '80px 20px', background: '#fff' }}>
        <div className="wrap">
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--kaia-gold)', marginBottom: '16px', textTransform: 'uppercase' }}>
              — LA COLLECTION
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 600, color: 'var(--kaia-green)', lineHeight: 1.1, maxWidth: '500px' }}>
              Trois lignes, une seule <br />lumière
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '60px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleFilter('all')}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeFilter === 'all' ? 'var(--ink)' : '#fff',
                color: activeFilter === 'all' ? '#fff' : 'var(--ink)',
                border: `1px solid ${activeFilter === 'all' ? 'var(--ink)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              Tout
            </button>
            <button 
              onClick={() => handleFilter('femme')}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeFilter === 'femme' ? 'var(--ink)' : '#fff',
                color: activeFilter === 'femme' ? '#fff' : 'var(--ink)',
                border: `1px solid ${activeFilter === 'femme' ? 'var(--ink)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              Femme
            </button>
            <button 
              onClick={() => handleFilter('homme')}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeFilter === 'homme' ? 'var(--ink)' : '#fff',
                color: activeFilter === 'homme' ? '#fff' : 'var(--ink)',
                border: `1px solid ${activeFilter === 'homme' ? 'var(--ink)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              Homme
            </button>
          </div>
          
          <div className="grid">
            {(() => {
              const filteredProducts = products.filter(p => activeFilter === 'all' || p.gender === activeFilter);
              const groupedProductsMap = new Map();
              filteredProducts.forEach(p => {
                const groupKey = p.groupId || p.ref.substring(0, p.ref.length - 1);
                if (!groupedProductsMap.has(groupKey)) {
                  groupedProductsMap.set(groupKey, { variants: [p] });
                } else {
                  groupedProductsMap.get(groupKey).variants.push(p);
                }
              });
              
              return Array.from(groupedProductsMap.values()).map((group) => (
                <VariantSliderCard key={group.variants[0].id} group={group} addToCart={addToCart} />
              ));
            })()}
          </div>
        </div>
      </section>

      <section id="savoir-faire" className="wrap">
        <div className="craft">
          <div className="craft-visual">
            <div className="sun-element"></div>
            <span className="kaia-floating-text" style={{ fontSize: 'clamp(70px, 12vw, 120px)', marginTop: '-10px' }}>KAIA</span>
            <div className="wave-container">
              <svg className="wave-svg" viewBox="0 0 800 130" preserveAspectRatio="none">
                <path d="M0,70 C50,40 100,100 150,70 C200,40 250,100 300,70 C350,40 400,100 450,70 C500,40 550,100 600,70 C650,40 700,100 750,70 C775,55 790,65 800,70 L800,130 L0,130 Z" fill="#9FDBFF" opacity="0.9"/>
                <path d="M0,90 C60,60 120,120 180,90 C240,60 300,120 360,90 C420,60 480,120 540,90 C600,60 660,120 720,90 C750,75 780,85 800,90 L800,130 L0,130 Z" fill="#CDEEFF"/>
              </svg>
            </div>
          </div>
          <div className="craft-copy">
            <span className="eyebrow">Studio & Atelier</span>
            <p>Notre atelier situé au cœur de la ville assemble chaque paire avec précision. L'acétate de cellulose, extrait de fibres de coton, offre une finition et une robustesse que le plastique injecté ne pourra jamais égaler.</p>
            <p>Le polissage est manuel, les charnières rivetées et les verres rigoureusement contrôlés pour assurer une optique sans faille. On prend le temps qu'il faut pour que vous gardiez vos lunettes des années.</p>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="spec-card">
          <div className="spec-item">
            <span className="label">Monture</span>
            <span className="value">Acétate bio-sourcé</span>
          </div>
          <div className="spec-item">
            <span className="label">Verres</span>
            <span className="value">Nylon polarisé cat. 3</span>
          </div>
          <div className="spec-item">
            <span className="label">Charnières</span>
            <span className="value">Acier 5 barillets</span>
          </div>
          <div className="spec-item">
            <span className="label">Poids</span>
            <span className="value">32 grammes</span>
          </div>
        </div>
      </section>

      <section className="trust-strip wrap">
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-title">Livraison gratuite</span>
            <span className="trust-sub">Dès 2 paires achetées. Sur Dakar et Abidjan.</span>
          </div>
          <div className="trust-item">
            <span className="trust-title">Paiement à la livraison</span>
            <span className="trust-sub">Possible pour les commandes sur Dakar.</span>
          </div>
        </div>
      </section>

      <section id="avis" className="wrap">
        <div className="section-head">
          <h2>Ils voient la différence.</h2>
        </div>
        <div className="reviews">
          <div className="review">
            <p>"La clarté des verres polarisés est dingue. Le soleil de midi n'est plus un problème, même en conduisant. Et la monture est super légère."</p>
            <div className="who">— Amadou L.</div>
          </div>
          <div className="review">
            <p>"Commande passée le matin, livrée l'après-midi au bureau à Dakar. Service impeccable et les lunettes respirent le premium."</p>
            <div className="who">— Karim N.</div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: '110px' }}>
        <div className="section-head">
          <h2>Questions fréquentes.</h2>
        </div>
        <div className="faq-list">
          <details className="faq-item">
            <summary>Quelle est la protection des verres ?</summary>
            <p>Tous nos verres offrent une protection UV400 (filtrant 100% des UVA et UVB) et sont polarisés pour réduire l'éblouissement sur les surfaces planes.</p>
          </details>
          <details className="faq-item">
            <summary>Faites-vous des verres à la vue ?</summary>
            <p>Pas pour le moment. Mais nos montures en acétate sont compatibles avec le montage optique. Vous pouvez acheter la monture et faire poser des verres chez votre opticien.</p>
          </details>
          <details className="faq-item">
            <summary>Comment fonctionne la livraison ?</summary>
            <p>Livraison express (24/48h) sur Dakar. Pour Abidjan et le reste de la région, comptez 3 à 5 jours ouvrés via notre partenaire logistique.</p>
          </details>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Rejoignez le club Kaia.</h2>
          <p style={{ color: 'var(--ink)' }}>Accès anticipé aux collections en édition limitée.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Votre adresse email..." required />
            <button className="btn-primary" type="submit">S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
