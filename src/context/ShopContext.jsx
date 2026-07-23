import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kaia_cart_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState(1245);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();
    setOrders(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/stats`);
    const data = await res.json();
    setVisitors(data.visitors);
    setDailyVisits(data.daily || []);
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([fetchProducts(), fetchOrders(), fetchStats()]);
        
        // Simuler une visite (incrément backend) uniquement si c'est une nouvelle session
        const hasVisited = sessionStorage.getItem('kaia_session_visit');
        if (!hasVisited) {
          const res = await fetch(`${API_URL}/stats/visit`, { method: 'POST' });
          const data = await res.json();
          setVisitors(data.visitors);
          sessionStorage.setItem('kaia_session_visit', 'true');
        }
      } catch (err) {
        console.error('Erreur connexion backend', err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Le panier reste stocké localement pour ne pas perdre les articles non achetés
  useEffect(() => {
    localStorage.setItem('kaia_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (deliveryInfo) => {
    const orderTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const orderData = {
      deliveryInfo,
      items: cart,
      total: orderTotal
    };

    try {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      // Rafraichir les données depuis le serveur après commande
      await fetchOrders();
      await fetchProducts();
      clearCart();
    } catch (error) {
      console.error("Erreur lors de la commande", error);
    }
  };

  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? data : p));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE'
      });
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      orders,
      visitors,
      dailyVisits,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      isLoading
    }}>
      {children}
    </ShopContext.Provider>
  );
};
