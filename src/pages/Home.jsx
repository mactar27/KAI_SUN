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
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9971" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9971</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9971', name: 'RÉF. NDL9971 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9971_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9973" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9973</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9973', name: 'RÉF. NDL9973 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9973_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9970_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9970" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9970</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9970', name: 'RÉF. NDL9970 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9970_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9919_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9919" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9919</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9919', name: 'RÉF. NDL9919 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9919_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9921_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9921" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9921</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9921', name: 'RÉF. NDL9921 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9921_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9922_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9922" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9922</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9922', name: 'RÉF. NDL9922 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9922_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9920_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9920" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9920</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9920', name: 'RÉF. NDL9920 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9920_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9916_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9916" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9916</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9916', name: 'RÉF. NDL9916 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9916_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9915_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9915" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9915</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9915', name: 'RÉF. NDL9915 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9915_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9917_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9917" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9917</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9917', name: 'RÉF. NDL9917 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9917_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9910_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9910" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9910</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9910', name: 'RÉF. NDL9910 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9910_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9912_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9912" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9912</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9912', name: 'RÉF. NDL9912 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9912_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9914_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9914" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9914</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9914', name: 'RÉF. NDL9914 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9914_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9880_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9880" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9880</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9880', name: 'RÉF. NDL9880 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9880_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9815_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9815" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9815</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9815', name: 'RÉF. NDL9815 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9815_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9816_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9816" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9816</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9816', name: 'RÉF. NDL9816 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9816_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/2/8298_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8298" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8298</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8298', name: 'RÉF. NDL8298 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/2/8298_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/2/8299_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8299" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8299</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8299', name: 'RÉF. NDL8299 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/2/8299_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9871_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9871" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9871</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9871', name: 'RÉF. NDL9871 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9871_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9872_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9872" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9872</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9872', name: 'RÉF. NDL9872 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9872_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9873_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9873" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9873</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9873', name: 'RÉF. NDL9873 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9873_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9776_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9776" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9776</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9776', name: 'RÉF. NDL9776 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9776_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9775_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9775" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9775</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9775', name: 'RÉF. NDL9775 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9775_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/5/9572_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9572" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9572</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9572', name: 'RÉF. NDL9572 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/5/9572_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/5/9570_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9570" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9570</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9570', name: 'RÉF. NDL9570 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/5/9570_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/5/9571_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9571" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9571</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9571', name: 'RÉF. NDL9571 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/5/9571_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/5/9518_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9518" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9518</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9518', name: 'RÉF. NDL9518 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/5/9518_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9952_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9952" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9952</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9952', name: 'RÉF. NDL9952 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9952_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/3/9338_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9338" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9338</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9338', name: 'RÉF. NDL9338 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/3/9338_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/3/9340_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9340" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9340</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9340', name: 'RÉF. NDL9340 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/3/9340_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/5/9583_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9583" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9583</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9583', name: 'RÉF. NDL9583 - Fournisseur Femme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/5/9583_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </>
            )}

            {(activeFilter === 'all' || activeFilter === 'homme') && (
              <>

                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9889_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9889" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9889</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9889', name: 'RÉF. NDL9889 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9889_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9713_1_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9713" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9713</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9713', name: 'RÉF. NDL9713 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9713_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9742_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9742" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9742</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9742', name: 'RÉF. NDL9742 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9742_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8318" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8318</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8318', name: 'RÉF. NDL8318 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8318_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/7/9712_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9712" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9712</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9712', name: 'RÉF. NDL9712 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/7/9712_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9864_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9864" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9864</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9864', name: 'RÉF. NDL9864 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9864_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9899_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9899" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9899</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9899', name: 'RÉF. NDL9899 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9899_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9875_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9875" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9875</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9875', name: 'RÉF. NDL9875 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9875_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9858_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9858" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9858</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9858', name: 'RÉF. NDL9858 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9858_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8312_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8312" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8312</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8312', name: 'RÉF. NDL8312 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8312_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8330_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8330" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8330</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8330', name: 'RÉF. NDL8330 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8330_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9867_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9867" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9867</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9867', name: 'RÉF. NDL9867 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9867_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9860_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9860" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9860</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9860', name: 'RÉF. NDL9860 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9860_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9869_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9869" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9869</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9869', name: 'RÉF. NDL9869 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9869_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9901_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9901" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9901</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9901', name: 'RÉF. NDL9901 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9901_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9924" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9924</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9924', name: 'RÉF. NDL9924 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9924_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/9/9927_1_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9927" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9927</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9927', name: 'RÉF. NDL9927 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/9/9927_1_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8313_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8313" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8313</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8313', name: 'RÉF. NDL8313 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8313_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9884_fv.jpg?width=600&height=600" alt="Monture solaire réf. NDL9884" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9884</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9884', name: 'RÉF. NDL9884 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9884_fv.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8315_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8315" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8315</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8315', name: 'RÉF. NDL8315 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8315_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9845_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9845" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9845</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9845', name: 'RÉF. NDL9845 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9845_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8319_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8319" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8319</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8319', name: 'RÉF. NDL8319 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8319_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/8/3/8332_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL8332" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL8332</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL8332', name: 'RÉF. NDL8332 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/8/3/8332_1.jpg?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="https://www.solo-solis.com/media/catalog/product/9/8/9857_1.jpg?width=600&height=600" alt="Monture solaire réf. NDL9857" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL9857</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: 'NDL9857', name: 'RÉF. NDL9857 - Fournisseur Homme', price: 25000, image: 'https://www.solo-solis.com/media/catalog/product/9/8/9857_1.jpg?width=600&height=600' })}
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
