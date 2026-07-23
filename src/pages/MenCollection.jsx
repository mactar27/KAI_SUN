import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { ShopContext } from '../context/ShopContext';
import { ProductsContext } from '../context/ProductsContext';

const MenCollection = () => {
  const { products } = useContext(ProductsContext);
  const menProducts = products.filter(p => p.gender === 'homme' || p.category === 'homme');

  return (
    <div className="section container" style={{ paddingTop: '150px' }}>
      <h1 className="text-center" style={{ marginBottom: '3rem', fontSize: '3rem' }}>Collection Homme</h1>
      <div className="grid grid-cols-4">
        {menProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MenCollection;
