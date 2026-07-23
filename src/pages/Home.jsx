import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const [tintValue, setTintValue] = useState(30);
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart } = useContext(ShopContext);

  const getTintName = (val) => {
    if (val < 45 || val > 330) return 'Ambre';
    if (val < 90) return 'Moutarde';
    if (val < 160) return 'Vert Forêt';
    if (val < 220) return 'Océan';
    if (val < 280) return 'Bleu Nuit';
    return 'Améthyste';
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <header className="hero">
        <div className="wrap" style={{ display: 'contents' }}>
          <div className="hero-copy">
            <span className="hero-tag">Collection 2026 — Dakar</span>
            <h1 className="hero-title">Le soleil ne <span className="accent">négocie</span> pas.</h1>
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

      <section className="cat-tiles">
        <div class="wrap">
          <div class="cat-grid">
            <a href="#collection" class="cat-tile">
              <span class="cat-tile-label">Pour elle</span>
              <span class="cat-tile-cta">Découvrir →</span>
            </a>
            <a href="#collection" class="cat-tile">
              <span class="cat-tile-label">Pour lui</span>
              <span class="cat-tile-cta">Découvrir →</span>
            </a>
            <a href="#essai-teintes" class="cat-tile">
              <span class="cat-tile-label">Édition limitée</span>
              <span class="cat-tile-cta">Découvrir →</span>
            </a>
          </div>
        </div>
      </section>

      <section id="essai-teintes" style={{ paddingTop: '70px', paddingBottom: '70px' }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Essayez la teinte.</h2>
            <p>Faites glisser le curseur pour découvrir tous les coloris de verres disponibles sur ce modèle.</p>
          </div>
          <div className="tint-demo">
            <div className="tint-frame">
              <svg viewBox="0 0 220 100" width="100%" style={{ maxWidth: '520px' }}>
                <ellipse id="lensL" cx="62" cy="52" rx="46" ry="38" fill="#8a5a2c" style={{ filter: `hue-rotate(${tintValue}deg)` }}/>
                <ellipse id="lensR" cx="158" cy="52" rx="46" ry="38" fill="#8a5a2c" style={{ filter: `hue-rotate(${tintValue}deg)` }}/>
                <ellipse cx="62" cy="52" rx="46" ry="38" fill="none" stroke="#111111" strokeWidth="6"/>
                <ellipse cx="158" cy="52" rx="46" ry="38" fill="none" stroke="#111111" strokeWidth="6"/>
                <path d="M108 46 Q110 40 112 46" fill="none" stroke="#111111" strokeWidth="6" strokeLinecap="round"/>
                <path d="M16 48 L2 40" stroke="#111111" strokeWidth="6" strokeLinecap="round"/>
                <path d="M204 48 L218 40" stroke="#111111" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="tint-controls">
              <span className="tint-name mono" id="tintName">{getTintName(tintValue)}</span>
              <input 
                type="range" min="0" max="360" 
                value={tintValue} 
                onChange={(e) => setTintValue(e.target.value)} 
                id="tintSlider" className="tint-slider" aria-label="Choisir la teinte du verre" 
              />
            </div>
          </div>
        </div>
      </section>

      <section id="collection">
        <div className="wrap">
          <div className="section-head">
            <h2>Le catalogue.</h2>
            <p>Nos montures maison et les nouveautés du fournisseur, réunies au même endroit. Cliquez une pastille pour changer la teinte du verre quand elle est disponible.</p>
          </div>

          <div className="cat-filter">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>Tout</button>
            <button className={`filter-btn ${activeFilter === 'femme' ? 'active' : ''}`} onClick={() => handleFilter('femme')}>Femme</button>
            <button className={`filter-btn ${activeFilter === 'homme' ? 'active' : ''}`} onClick={() => handleFilter('homme')}>Homme</button>
          </div>

          <div className="grid" id="supplierGrid">
            {(activeFilter === 'all' || activeFilter === 'femme') && (
              <>
                <div className="card" data-gender="femme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #8a5a2c33, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><ellipse cx="25" cy="20" rx="20" ry="17" stroke="#111111" strokeWidth="3"/><ellipse cx="75" cy="20" rx="20" ry="17" stroke="#111111" strokeWidth="3"/><line x1="45" y1="20" x2="55" y2="20" stroke="#111111" strokeWidth="3"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. K-01</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway" data-name>Ambre</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#8a5a2c' }} data-color="#8a5a2c" data-name="Ambre" aria-label="Ambre"></button>
                    <button className="swatch" style={{ background: '#2c2c2c' }} data-color="#2c2c2c" data-name="Noir" aria-label="Noir"></button>
                    <button className="swatch" style={{ background: '#5a7a6a' }} data-color="#5a7a6a" data-name="Vert" aria-label="Vert"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFK01', name: 'RÉF. K-01 - Ambre', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>
                
                <div className="card" data-gender="femme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #ffd10033, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><rect x="8" y="8" width="35" height="24" rx="4" stroke="#111111" strokeWidth="3"/><rect x="57" y="8" width="35" height="24" rx="4" stroke="#111111" strokeWidth="3"/><line x1="43" y1="20" x2="57" y2="20" stroke="#111111" strokeWidth="3"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. K-03</span></div>
                  <div className="colorway" data-name>Ambre clair</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#ffd100' }} data-color="#ffd100" data-name="Ambre clair" aria-label="Ambre clair"></button>
                    <button className="swatch" style={{ background: '#3d3d3d' }} data-color="#3d3d3d" data-name="Fumé" aria-label="Fumé"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFK03', name: 'RÉF. K-03 - Ambre clair', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="femme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #8a3a2a33, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><path d="M6 30 L20 8 H42 L48 20 L58 20 L64 8 H86 L100 30" stroke="#111111" strokeWidth="3" fill="none"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. K-05</span></div>
                  <div className="colorway" data-name>Brique</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#8a3a2a' }} data-color="#8a3a2a" data-name="Brique" aria-label="Brique"></button>
                    <button className="swatch" style={{ background: '#1a1a1a' }} data-color="#1a1a1a" data-name="Noir mat" aria-label="Noir mat"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFK05', name: 'RÉF. K-05 - Brique', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 7076" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 7076</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF7076', name: 'RÉF. 7076 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 9973" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9973</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF9973', name: 'RÉF. 9973 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 9971" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9971</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF9971', name: 'RÉF. 9971 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/2/8232_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 8232" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 8232</span></div>
                  <div className="colorway">Fournisseur — Femme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF8232', name: 'RÉF. 8232 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/2/8232_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>
              </>
            )}

            {(activeFilter === 'all' || activeFilter === 'homme') && (
              <>
                <div className="card" data-gender="homme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #c64fe033, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><path d="M5 22 Q25 2 45 20 Q55 24 55 20 Q75 2 95 22 L95 30 Q75 15 55 26 Q50 30 45 26 Q25 15 5 30 Z" stroke="#111111" strokeWidth="3"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. K-02</span></div>
                  <div className="colorway" data-name>Violet</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#8b5cf6' }} data-color="#8b5cf6" data-name="Violet" aria-label="Violet"></button>
                    <button className="swatch" style={{ background: '#ff3b5c' }} data-color="#ff3b5c" data-name="Corail" aria-label="Corail"></button>
                    <button className="swatch" style={{ background: '#2c2c2c' }} data-color="#2c2c2c" data-name="Noir" aria-label="Noir"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFK02', name: 'RÉF. K-02 - Violet', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="homme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #e0b84f33, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><circle cx="25" cy="20" r="17" stroke="#111111" strokeWidth="3"/><circle cx="75" cy="20" r="17" stroke="#111111" strokeWidth="3"/><line x1="42" y1="18" x2="58" y2="18" stroke="#111111" strokeWidth="3"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. K-04</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway" data-name>Or</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#e0b84f' }} data-color="#e0b84f" data-name="Or" aria-label="Or"></button>
                    <button className="swatch" style={{ background: '#2f6fed' }} data-color="#2f6fed" data-name="Bleu" aria-label="Bleu"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFK04', name: 'RÉF. K-04 - Or', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 7075" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 7075</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF7075', name: 'RÉF. 7075 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>

                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9972_1.jpg?width=600&height=600&store=solosolisfr&image-type=image" alt="Monture solaire réf. 9972" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9972</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RF9972', name: 'RÉF. 9972 - Lunettes', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9972_1.jpg?width=600&height=600&store=solosolisfr&image-type=image' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>
                
                <div className="card" data-gender="homme">
                  <div className="card-lens" data-lens style={{ background: 'radial-gradient(circle, #5B463233, var(--surface))' }}>
                    <svg viewBox="0 0 100 40" fill="none"><circle cx="25" cy="20" r="17" stroke="#111111" strokeWidth="3"/><circle cx="75" cy="20" r="17" stroke="#111111" strokeWidth="3"/><line x1="42" y1="18" x2="58" y2="18" stroke="#111111" strokeWidth="3"/></svg>
                  </div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8317</span></div>
                  <div className="colorway" data-name>Écaille</div>
                  <div className="swatches">
                    <button className="swatch active" style={{ background: '#5B4632' }} data-color="#5B4632" data-name="Écaille" aria-label="Écaille"></button>
                    <button className="swatch" style={{ background: '#E8DCC8' }} data-color="#E8DCC8" data-name="Crème" aria-label="Crème"></button>
                  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: 'RFNDL8317', name: 'RÉF. NDL8317 - Écaille', price: 25000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600' })}
        >
          Ajouter
        </button>
      </div>
  </div>
</div>
              
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg?width=600&height=600" alt="Monture solaire réf. 7076" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 7076</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-7076', name: 'RÉF. 7076 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/7/0/7076_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg?width=600&height=600" alt="Monture solaire réf. 7075" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 7075</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-7075', name: 'RÉF. 7075 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/7/0/7075_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600" alt="Monture solaire réf. 9973" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9973</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9973', name: 'RÉF. 9973 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9972_1.jpg?width=600&height=600" alt="Monture solaire réf. 9972" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9972</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9972', name: 'RÉF. 9972 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9972_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600" alt="Monture solaire réf. 9971" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9971</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9971', name: 'RÉF. 9971 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg?width=600&height=600" alt="Monture solaire réf. 8318" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 8318</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-8318', name: 'RÉF. 8318 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8320_1.jpg?width=600&height=600" alt="Monture solaire réf. 8320" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 8320</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-8320', name: 'RÉF. 8320 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8320_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9925_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9925" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9925</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9925', name: 'RÉF. 9925 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9925_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg?width=600&height=600" alt="Monture solaire réf. 9924" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9924</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9924', name: 'RÉF. 9924 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9928_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9928" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9928</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9928', name: 'RÉF. 9928 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9928_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9927_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9927" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9927</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9927', name: 'RÉF. 9927 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9927_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9926.jpg?width=600&height=600" alt="Monture solaire réf. 9926" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9926</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9926', name: 'RÉF. 9926 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9926.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9920_1.jpg?width=600&height=600" alt="Monture solaire réf. 9920" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9920</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9920', name: 'RÉF. 9920 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9920_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9919_1.jpg?width=600&height=600" alt="Monture solaire réf. 9919" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9919</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9919', name: 'RÉF. 9919 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9919_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9923_1.jpg?width=600&height=600" alt="Monture solaire réf. 9923" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9923</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9923', name: 'RÉF. 9923 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9923_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9921_1.jpg?width=600&height=600" alt="Monture solaire réf. 9921" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9921</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9921', name: 'RÉF. 9921 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9921_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9922_1.jpg?width=600&height=600" alt="Monture solaire réf. 9922" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9922</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9922', name: 'RÉF. 9922 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9922_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9907_fv.jpg?width=600&height=600" alt="Monture solaire réf. 9907" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9907</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9907', name: 'RÉF. 9907 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9907_fv.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9905_1.jpg?width=600&height=600" alt="Monture solaire réf. 9905" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9905</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9905', name: 'RÉF. 9905 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9905_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9909_1.jpg?width=600&height=600" alt="Monture solaire réf. 9909" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9909</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9909', name: 'RÉF. 9909 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9909_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9906_fv_1.jpg?width=600&height=600" alt="Monture solaire réf. 9906" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9906</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9906', name: 'RÉF. 9906 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9906_fv_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9908_1.jpg?width=600&height=600" alt="Monture solaire réf. 9908" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9908</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9908', name: 'RÉF. 9908 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9908_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9898_1.jpg?width=600&height=600" alt="Monture solaire réf. 9898" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9898</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9898', name: 'RÉF. 9898 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9898_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9901_1.jpg?width=600&height=600" alt="Monture solaire réf. 9901" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9901</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9901', name: 'RÉF. 9901 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9901_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9650_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9650" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9650</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9650', name: 'RÉF. 9650 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9650_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9649_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9649" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9649</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9649', name: 'RÉF. 9649 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9649_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9903_1.jpg?width=600&height=600" alt="Monture solaire réf. 9903" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9903</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9903', name: 'RÉF. 9903 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9903_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9651_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9651" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9651</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9651', name: 'RÉF. 9651 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9651_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9963.jpg?width=600&height=600" alt="Monture solaire réf. 9963" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9963</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9963', name: 'RÉF. 9963 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9963.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9904.jpg?width=600&height=600" alt="Monture solaire réf. 9904" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9904</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9904', name: 'RÉF. 9904 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9904.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9765_1.jpg?width=600&height=600" alt="Monture solaire réf. 9765" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9765</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9765', name: 'RÉF. 9765 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9765_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9763_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9763" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9763</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9763', name: 'RÉF. 9763 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9763_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9893_1.jpg?width=600&height=600" alt="Monture solaire réf. 9893" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9893</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9893', name: 'RÉF. 9893 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9893_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9766_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9766" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9766</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9766', name: 'RÉF. 9766 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9766_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9625_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9625" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9625</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9625', name: 'RÉF. 9625 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9625_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9623_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9623" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9623</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9623', name: 'RÉF. 9623 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9623_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9624_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9624" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9624</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9624', name: 'RÉF. 9624 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9624_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9626_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9626" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9626</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9626', name: 'RÉF. 9626 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9626_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/6/9627_1_1.jpg?width=600&height=600" alt="Monture solaire réf. 9627" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9627</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9627', name: 'RÉF. 9627 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/6/9627_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9960_fv.jpg?width=600&height=600" alt="Monture solaire réf. 9960" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9960</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9960', name: 'RÉF. 9960 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9960_fv.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9961_fv.jpg?width=600&height=600" alt="Monture solaire réf. 9961" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9961</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9961', name: 'RÉF. 9961 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9961_fv.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9867.jpg?width=600&height=600" alt="Monture solaire réf. 9867" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. 9867</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'K-9867', name: 'RÉF. 9867 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9867.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

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
