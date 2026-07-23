import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(ShopContext);
  
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product ? product.image : '');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h1>Produit introuvable</h1>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Retour à l'accueil</Link>
      </div>
    );
  }

  const thumbnails = product.thumbnails || [
    product.image,
    product.image.replace('_1.jpg', '_2.jpg')
  ];

  const baseRef = product.ref.substring(0, product.ref.length - 1);
  const variants = products.filter(p => p.ref.substring(0, p.ref.length - 1) === baseRef);

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--ink)', fontWeight: 500, marginBottom: '40px' }}>
          <ArrowLeft /> Retour à la boutique
        </Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'start' }}>
          
          {/* IMAGE SECTION */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{ 
              background: 'var(--surface)', 
              padding: '40px', 
              border: '2px solid var(--ink)', 
              borderRadius: '16px',
            }}>
              <img 
                src={mainImage + '?width=1000&height=1000'} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1000x1000/f0f0f0/a0a0a0?text=Image+Indisponible' }}
              />
            </div>
            
            {/* THUMBNAILS */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
              {thumbnails.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb + '?width=200&height=200'}
                  alt={`Vue ${idx + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    border: mainImage === thumb ? '2px solid var(--ink)' : '2px solid var(--line)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'var(--surface)',
                    padding: '8px'
                  }}
                  onClick={() => setMainImage(thumb)}
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
              ))}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="badge-new">NOUVEAU</span>
              <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-soft)' }}>
                {product.gender.toUpperCase()}
              </span>
            </div>
            
            <h1 className="anton" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1', marginBottom: '20px' }}>
              RÉF. {product.ref}
            </h1>
            
            <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '40px' }}>
              25 000 FCFA
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)', marginBottom: '40px', lineHeight: '1.8' }}>
              Un design audacieux pour ceux qui n'ont pas peur de s'affirmer. 
              Cette monture premium offre une protection UV400 optimale tout en conservant une légèreté exceptionnelle pour un confort tout au long de la journée.
            </p>

            {variants.length > 1 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Coloris disponibles ({variants.length})</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {variants.map(v => (
                    <Link key={v.id} to={`/product/${v.id}`} onClick={() => { window.scrollTo(0, 0); }} title={`RÉF. ${v.ref}`}>
                      <img 
                        src={v.image + '?width=100&height=100'} 
                        alt={v.name}
                        style={{ 
                          width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover',
                          border: v.id === product.id ? '2px solid var(--ink)' : '2px solid transparent',
                          padding: '2px', background: 'var(--surface)'
                        }}
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '20px', fontSize: '1.2rem', marginBottom: '32px' }}
              onClick={() => addToCart({ id: product.id, name: product.name, price: 25000, image: product.image + '?width=600&height=600' })}
            >
              AJOUTER AU PANIER
            </button>
            
            {/* PROMO BOX */}
            <div style={{ background: '#FEF3C7', border: '2px dashed #F59E0B', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '40px' }}>
              <div style={{ background: '#F59E0B', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                !
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: '#B45309' }}>PROMOTION ACTIVE</h4>
                <p style={{ fontSize: '0.9rem', color: '#92400E' }}>Ajoutez une 2ème paire au panier et elle passera automatiquement à <strong>5 000 FCFA</strong> au lieu de 25 000 FCFA !</p>
              </div>
            </div>

            {/* FEATURES */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Protection UV400 certifiée',
                'Verres anti-rayures',
                'Matériaux durables',
                'Livraison express disponible'
              ].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '1rem' }}>
                  <Check style={{ color: 'var(--accent-dark)' }} /> {feat}
                </li>
              ))}
            </ul>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
