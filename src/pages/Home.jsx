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
    <div style={{ paddingTop: '0' }}>
      <header className="hero" style={{ 
        backgroundImage: 'url(/images/hero_pool.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100svh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        padding: '120px 40px 60px', 
        textAlign: 'left', 
        color: '#3a4a35' 
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          {/* Title */}
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(40px, 8vw, 64px)', 
            fontWeight: 500, 
            lineHeight: 1.1,
            color: '#3a4a35',
            marginBottom: '20px',
            letterSpacing: '0.02em'
          }}>
            Là où le regard <br />
            <span style={{ fontStyle: 'italic', color: '#687860' }}>prend forme.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#3a4a35',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            DES LUNETTES PENSÉES <br/>
            POUR S'ACCORDER À L'ESSENTIEL.
          </p>

          {/* Button */}
          <a href="#collection" style={{
            background: '#8d9983',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '12px',
            padding: '14px 28px',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            marginBottom: '24px',
            transition: 'background 0.2s, transform 0.2s'
          }}>
            DÉCOUVRIR LA COLLECTION &rarr;
          </a>

          {/* Notre Histoire Link */}
          <a href="#histoire" style={{
            color: '#3a4a35',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            borderBottom: '1px solid #3a4a35',
            paddingBottom: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            NOTRE HISTOIRE &rarr;
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

      <section id="savoir-faire" style={{ padding: '100px 20px', background: 'var(--kaia-cream)', color: 'var(--ink)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--kaia-gold)', marginBottom: '16px', textTransform: 'uppercase' }}>
              — SAVOIR-FAIRE
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 600, color: 'var(--kaia-green)', lineHeight: 1.1, marginBottom: '32px' }}>
              L'excellence du <br/>Studio & Atelier
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--kaia-gold)', marginBottom: '32px' }}></div>
          </div>

          <div>
            <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
              Notre atelier situé au cœur de la ville assemble chaque paire avec précision. L'acétate de cellulose, extrait de fibres de coton, offre une finition et une robustesse que le plastique injecté ne pourra jamais égaler.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--ink-soft)' }}>
              Le polissage est manuel, les charnières rivetées et les verres rigoureusement contrôlés pour assurer une optique sans faille. On prend le temps qu'il faut pour que vous gardiez vos lunettes des années.
            </p>
          </div>

        </div>
      </section>

      <section style={{ padding: '60px 20px', background: 'var(--kaia-green)', color: 'var(--kaia-gold)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div style={{ padding: '20px', border: '1px solid rgba(203, 167, 92, 0.2)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>MONTURE</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff' }}>Acétate bio-sourcé</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(203, 167, 92, 0.2)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>VERRES</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff' }}>Nylon polarisé cat. 3</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(203, 167, 92, 0.2)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>CHARNIÈRES</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff' }}>Acier 5 barillets</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(203, 167, 92, 0.2)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>POIDS</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff' }}>32 grammes</div>
          </div>
        </div>
      </section>

      <section id="avis" style={{ padding: '100px 20px', background: '#fff' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--kaia-gold)', marginBottom: '16px', textTransform: 'uppercase' }}>— TÉMOIGNAGES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--kaia-green)' }}>Ils voient la différence.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ padding: '40px', background: 'var(--kaia-cream)' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                "La clarté des verres polarisés est dingue. Le soleil de midi n'est plus un problème, même en conduisant. Et la monture est super légère."
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>— AMADOU L.</div>
            </div>
            <div style={{ padding: '40px', background: 'var(--kaia-cream)' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                "Commande passée le matin, livrée l'après-midi au bureau à Dakar. Service impeccable et les lunettes respirent le premium."
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>— KARIM N.</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: 'var(--kaia-green)', color: '#fff', textAlign: 'center' }}>
        <div className="wrap" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px' }}>Rejoignez le cercle.</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>Accès anticipé aux collections en édition limitée.</p>
          <form style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Votre adresse email..." required style={{ flex: 1, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px 24px', background: 'var(--kaia-gold)', color: 'var(--kaia-green)', border: 'none', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '12px', cursor: 'pointer' }}>S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
