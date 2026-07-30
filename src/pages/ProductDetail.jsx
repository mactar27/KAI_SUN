import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';
import { ArrowLeft, Check } from 'lucide-react';

const ProductDetail = () => {
  const { products } = useContext(ProductsContext);
  const { id } = useParams();
  const { addToCart } = useContext(ShopContext);
  
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product ? product.image : '');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.image);
      
      // Update SEO Meta Tags
      document.title = `${product.name} | Kaïa Sun`;
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${product.name} - ${product.price.toLocaleString()} FCFA`);
      
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', window.location.origin + product.image);

      fetch(`/api/reviews?productId=${product.id}`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(console.error);

      // Analytics tracking
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'view', product_ref: product.ref })
      }).catch(e => console.error(e));
    }
  }, [product]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...reviewForm })
      });
      setReviewSubmitted(true);
      setReviewForm({ authorName: '', rating: 5, comment: '' });
    } catch (err) { console.error(err); }
  };

  const touchStartX = React.useRef(null);
  const touchEndX = React.useRef(null);

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

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

  const groupKey = product.groupId || product.ref.substring(0, product.ref.length - 1);
  const variants = products.filter(p => {
    const pKey = p.groupId || p.ref.substring(0, p.ref.length - 1);
    return pKey === groupKey;
  });

  const similarProducts = products
    .filter(p => p.gender === product.gender && p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 5.0;

  const onTouchEndHandler = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      if (variants.length > 1) {
        const currentIndex = variants.findIndex(v => v.id === product.id);
        let targetId = null;
        if (isLeftSwipe) {
          const nextIndex = (currentIndex + 1) % variants.length;
          targetId = variants[nextIndex].id;
        } else {
          const prevIndex = (currentIndex - 1 + variants.length) % variants.length;
          targetId = variants[prevIndex].id;
        }
        if (targetId) {
          navigate(`/product/${targetId}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--ink)', fontWeight: 500, marginBottom: '40px' }}>
          <ArrowLeft /> Retour à la boutique
        </Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'start' }}>
          
          {/* IMAGE SECTION */}
          <div style={{ position: 'sticky', top: '120px' }}>
              <div 
              style={{ 
                backgroundImage: 'url(/images/sable_sans_coquillage.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '40px', 
                border: '2px solid var(--ink)', 
                borderRadius: '16px',
                touchAction: 'pan-y'
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndHandler}
            >
              <img 
                src={mainImage + '?width=1000&height=1000'} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', display: 'block', mixBlendMode: 'multiply' }} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1000x1000/f0f0f0/a0a0a0?text=Image+Indisponible' }}
              />
            </div>
            
            {/* THUMBNAILS REMOVED AS REQUESTED */}
          </div>

          {/* DETAILS SECTION */}
          <div>
            {/* Title & Ref */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h1 className="product-title" style={{ fontSize: '2.5rem', margin: '0 0 8px 0', fontWeight: 900, lineHeight: 1.1 }}>
                  {product.name}
                </h1>
                <span className="product-price" style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {product.price.toLocaleString()} FCFA
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <p className="product-ref" style={{ color: '#666', fontSize: '0.9rem', margin: 0, letterSpacing: '2px' }}>
                  RÉF. {product.ref}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#F59E0B' }}>
                  {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                  <span style={{ color: '#666', marginLeft: '4px' }}>({reviews.length} avis)</span>
                </div>
              </div>
            </div>
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
              onClick={() => {
                addToCart({ id: product.id, name: product.name, price: 25000, image: product.image + '?width=600&height=600' });
                navigate('/panier');
              }}
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

        {/* Reviews Section */}
        <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8f8f8', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>Avis Clients ({reviews.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{r.authorName}</strong>
                  <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ color: '#444', fontStyle: 'italic', margin: 0 }}>"{r.comment}"</p>
                <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '12px' }}>Le {new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Laissez votre avis</h3>
            {reviewSubmitted ? (
              <p style={{ color: '#2e7d32', fontWeight: 600 }}>Merci ! Votre avis est en attente de modération.</p>
            ) : (
              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <input required type="text" placeholder="Votre nom" value={reviewForm.authorName} onChange={e => setReviewForm({...reviewForm, authorName: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="5">5 Étoiles - Excellent</option>
                  <option value="4">4 Étoiles - Très bien</option>
                  <option value="3">3 Étoiles - Moyen</option>
                  <option value="2">2 Étoiles - Décevant</option>
                  <option value="1">1 Étoile - Mauvais</option>
                </select>
                <textarea required placeholder="Votre commentaire..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}></textarea>
                <button type="submit" style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Envoyer mon avis</button>
              </form>
            )}
          </div>
        </div>

        {/* Cross-selling */}
        {similarProducts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>Vous aimerez aussi...</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
              {similarProducts.map(sp => (
                <Link to={`/product/${sp.id}`} key={sp.id} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={sp.image} alt={sp.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px' }} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{sp.name}</h4>
                    <p style={{ margin: 0, color: '#666' }}>{sp.price.toLocaleString()} FCFA</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
