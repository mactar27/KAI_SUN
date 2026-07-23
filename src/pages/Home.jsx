import React, { useState, useContext } from 'react';
import products from '../data/products.json';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart } = useContext(ShopContext);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <header className="hero">
        <div className="wrap" style={{ display: 'contents' }}>
          <div className="hero-copy">
            <span className="hero-tag">Collection 2026 — Dakar</span>
            <h1 className="hero-title" style={{ fontWeight: 900, color: 'var(--ink)' }}>KAIA SUN</h1>
            <p>Verres polarisés UV400 et montures en acétate italien, pensés pour la lumière franche de Dakar. Fait pour durer, pas pour suivre les modes.</p>
            <div className="hero-actions">
              <a href="#collection" className="btn-primary">Découvrir la collection</a>
              <a href="#savoir-faire" className="btn-secondary">Notre savoir-faire</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="lens" id="lens">
              <div className="lens-word">
                <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="6" width="50" height="48" rx="20" stroke="#111111" strokeWidth="8"/>
                  <rect x="82" y="6" width="50" height="48" rx="20" stroke="#111111" strokeWidth="8"/>
                  <line x1="58" y1="26" x2="82" y2="26" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                  <rect x="0" y="26" width="9" height="6" rx="3" fill="#111111"/>
                  <rect x="131" y="26" width="9" height="6" rx="3" fill="#111111"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="marquee">
        <div className="marquee-track" id="marquee">
          <span>Verres polarisés — UV400</span>
          <span>Acétate italien</span>
          <span>Monté à la main</span>
          <span>Garantie 2 ans</span>
          <span>Livraison Dakar & Abidjan</span>
          <span>Verres polarisés — UV400</span>
          <span>Acétate italien</span>
          <span>Monté à la main</span>
          <span>Garantie 2 ans</span>
          <span>Livraison Dakar & Abidjan</span>
        </div>
      </div>





      
      <section id="collection">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Nouveautés</h2>
          </div>
          <div className="filter-bar">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>Tout</button>
            <button className={`filter-btn ${activeFilter === 'femme' ? 'active' : ''}`} onClick={() => handleFilter('femme')}>Femme</button>
            <button className={`filter-btn ${activeFilter === 'homme' ? 'active' : ''}`} onClick={() => handleFilter('homme')}>Homme</button>
          </div>
          
          <div className="grid">
            {(() => {
              const filteredProducts = products.filter(p => activeFilter === 'all' || p.gender === activeFilter);
              const groupedProductsMap = new Map();
              filteredProducts.forEach(p => {
                const baseRef = p.ref.substring(0, p.ref.length - 1);
                if (!groupedProductsMap.has(baseRef)) {
                  groupedProductsMap.set(baseRef, {
                    baseProduct: p,
                    variantsCount: 1
                  });
                } else {
                  groupedProductsMap.get(baseRef).variantsCount++;
                }
              });
              
              return Array.from(groupedProductsMap.values()).map(({ baseProduct: product, variantsCount }) => (
                <div key={product.id} className="card" data-gender={product.gender}>
                  <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="card-photo">
                      <img src={product.image + '?width=600&height=600'} alt={product.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/f0f0f0/a0a0a0?text=Image+Indisponible' }} />
                    </div>
                  </Link>
                  <div className="card-top">
                    <span className="ref mono">RÉF. {product.ref}</span>
                    <span className="badge-new">NOUVEAU</span>
                  </div>
                  <div className="colorway">
                    Fournisseur — {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                    {variantsCount > 1 && <span style={{display: 'block', color: 'var(--ink)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500}}>+ {variantsCount} coloris disponibles</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: product.id, name: product.name, price: 25000, image: product.image + '?width=600&height=600' });
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>      </section>

      <section id="savoir-faire" className="wrap">
        <div className="craft">
          <div className="craft-visual"></div>
          <div className="craft-copy">
            <span className="eyebrow">Studio & Atelier</span>
            <h2>Fait à la main, un par un.</h2>
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
            <span className="trust-title">Garantie de 2 ans</span>
            <span className="trust-sub">Couvre tout défaut de fabrication et casse normale.</span>
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
            <p>"J'ai la réf. K-01 en ambre. Je n'ai eu que des compliments. On sent vraiment la différence de qualité avec mes anciennes lunettes."</p>
            <div className="who">— Fatou S.</div>
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
