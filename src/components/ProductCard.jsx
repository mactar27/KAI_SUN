import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  return (
    <div className="product-card group">
      <div className="product-image-container" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1533692328991-08159ff19fca?q=80&w=800&auto=format&fit=crop")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {product.isNew && <span className="product-badge">Nouveau</span>}
        {product.stock === 0 && <span className="product-badge" style={{ background: 'black', color: 'white' }}>Rupture</span>}
        <img src={product.image} alt={product.name} className="product-image" style={{ mixBlendMode: 'multiply' }} />
        <img src={product.hoverImage} alt={`${product.name} hover`} className="product-image-hover" style={{ mixBlendMode: 'multiply' }} />
      </div>
      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 className="product-name">{product.name}</h3>
          <p className="price">{product.price} FCFA</p>
        </div>
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          style={{ cursor: product.stock === 0 ? 'not-allowed' : 'pointer', opacity: product.stock === 0 ? 0.5 : '' }}
        >
          {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
