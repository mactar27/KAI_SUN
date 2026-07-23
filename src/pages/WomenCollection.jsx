import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { ShopContext } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const WomenCollection = () => {
  const { products } = useContext(ProductsContext);
  const womenProducts = products.filter(p => p.gender === 'femme' || p.category === 'femme');

  return (
    <div className="section container" style={{ paddingTop: '150px' }}>
      <h1 className="text-center" style={{ marginBottom: '3rem', fontSize: '3rem' }}>Collection Femme</h1>
      <div className="grid grid-cols-4">
        {womenProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WomenCollection;
