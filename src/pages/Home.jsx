import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const VariantSliderCard = ({ group, addToCart }) => {
  const { variants } = group;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = variants[currentIndex];
  const navigate = useNavigate();
  
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
        Fournisseur — {currentProduct.gender ? currentProduct.gender.charAt(0).toUpperCase() + currentProduct.gender.slice(1) : ''}
        {variants.length > 1 && <span style={{display: 'block', color: 'var(--ink)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500}}>{variants.length} coloris disponibles</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({ id: currentProduct.id, name: currentProduct.name, price: 25000, image: currentProduct.image + '?width=600&height=600' });
            navigate('/panier');
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
        minHeight: '100svh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-end', 
        padding: '120px 24px 120px', 
        textAlign: 'left', 
        color: '#3a4a35',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 80%',
            zIndex: 0
          }}
        >
          <source src="/images/hero_video.mp4" type="video/mp4" />
          <source src="/images/hero_video.mov" type="video/quicktime" />
        </video>
        {/* Overlay gradient for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(244, 239, 226, 0.85) 0%, rgba(244, 239, 226, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 2 }}>
          
          {/* Title */}
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(44px, 10vw, 72px)', 
            fontWeight: 400, 
            lineHeight: 1.05,
            color: '#3a4a35',
            marginBottom: '24px',
            letterSpacing: '0.01em'
          }}>
            Là où le regard <br />
            <span style={{ fontStyle: 'italic', color: '#687860' }}>prend forme.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#3a4a35',
            marginBottom: '48px',
            lineHeight: 1.8
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
            fontSize: '11px',
            padding: '16px 32px',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            marginBottom: '24px',
            transition: 'background 0.2s, transform 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
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
            paddingBottom: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            NOTRE HISTOIRE &rarr;
          </a>

        </div>
        
        {/* Curved bottom overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '80px',
          background: 'var(--kaia-cream)',
          borderTopLeftRadius: '100% 100%',
          borderTopRightRadius: '100% 100%',
          zIndex: 1,
          transform: 'scaleX(1.2)'
        }}></div>
      </header>

      <section id="histoire" style={{ padding: '100px 20px', background: 'var(--kaia-cream)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: 'var(--kaia-green)', lineHeight: 1.1 }}>
              KAÏA SUN
            </h2>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--kaia-gold)', marginTop: '8px', textTransform: 'uppercase' }}>
              HISTOIRE
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontStyle: 'italic', color: 'var(--kaia-green)', lineHeight: 1.6 }}>
              « Notre savoir-faire, forgé par 10 ans d’expérience dans l’optique, répond à une exigence claire : offrir des lunettes de soleil qui vont au-delà de l’accessoire. »
            </p>
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
                const groupKey = p.groupId || (p.ref ? p.ref.substring(0, p.ref.length - 1) : p.id);
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
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '60px', alignItems: 'center' }}>
          
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
            <img src="/images/atelier.png" alt="Atelier Kaïa" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
          </div>

        </div>
      </section>

      <section style={{ padding: '60px 20px', background: 'var(--kaia-cream)', color: 'var(--kaia-green)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div style={{ padding: '20px', border: '1px solid rgba(13, 40, 35, 0.1)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>MONTURE</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--kaia-green)' }}>Acétate bio-sourcé</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(13, 40, 35, 0.1)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>VERRES</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--kaia-green)' }}>Nylon polarisé cat. 3</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(13, 40, 35, 0.1)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>CHARNIÈRES</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--kaia-green)' }}>Acier 5 barillets</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid rgba(13, 40, 35, 0.1)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>POIDS</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--kaia-green)' }}>32 grammes</div>
          </div>
        </div>
      </section>



      <section id="avis" style={{ padding: '100px 20px', background: '#fff' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--kaia-gold)', marginBottom: '16px', textTransform: 'uppercase' }}>— TÉMOIGNAGES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--kaia-green)' }}>Ils voient la différence.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '40px' }}>
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
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px', color: 'var(--accent)' }}>Rejoignez le cercle.</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>Recevez nos offres exclusives et un accès anticipé aux nouvelles collections.</p>
          <form 
            style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: '400px', margin: '0 auto', gap: '8px' }} 
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.elements.email.value;
              if (!email) return;
              try {
                await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                alert("Merci ! Votre inscription à la newsletter est confirmée.");
                e.target.reset();
              } catch (error) {
                console.error("Erreur newsletter", error);
              }
            }}
          >
            <label htmlFor="newsletter_email" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Adresse email</label>
            <input id="newsletter_email" name="email" type="email" autoComplete="email" placeholder="Votre adresse email..." required style={{ flex: 1, minWidth: '200px', padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} />
            <button type="submit" style={{ flexShrink: 0, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '12px', cursor: 'pointer', transition: 'opacity 0.2s' }}>S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
