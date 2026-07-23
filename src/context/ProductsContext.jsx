import React, { createContext, useState, useEffect } from 'react';
import fallbackProducts from '../data/products.json';

export const ProductsContext = createContext({
  products: [],
  loading: true,
  refreshProducts: async () => {},
});

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.warn('Failed to fetch from API, using fallback.');
      }
    } catch (e) {
      console.warn('API not available, using fallback.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
