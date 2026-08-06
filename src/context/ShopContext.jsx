import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const calculateCartTotal = (cart, countryCode = 'SN') => {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const basePrice = countryCode === 'CI' ? 35000 : 25000;
  const secondPairPrice = countryCode === 'CI' ? 15000 : 10000;
  return Math.floor(totalQuantity / 2) * (basePrice + secondPairPrice) + (totalQuantity % 2) * basePrice;
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [countryCode, setCountryCode] = useState('SN'); // default to Senegal
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kaia_cart_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState(1245);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('kaia_admin_token') || null);

  // Fetch initial data
  const fetchProducts = async (currentCountry = 'SN') => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    const updatedData = data.map(p => ({
      ...p,
      price: currentCountry === 'CI' ? 35000 : 25000
    }));
    setProducts(updatedData);
  };

  const fetchLocationAndProducts = async () => {
    let detectedCountry = 'SN';
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.country_code === 'CI') {
          detectedCountry = 'CI';
        }
      }
    } catch (e) {
      console.error('Erreur détection IP', e);
    }
    setCountryCode(detectedCountry);
    await fetchProducts(detectedCountry);
  };

  const fetchOrders = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors);
        setDailyVisits(data.daily || []);
      } else {
        const err = await res.text();
        console.error('API Error /stats:', err ? err.substring(0, 50) : 'No error details');
      }
    } catch (e) {
      console.error('Network Error /stats:', e);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([fetchLocationAndProducts(), fetchStats()]);
        if (adminToken) await fetchOrders();
        
        // Simuler une visite (incrément backend) uniquement si c'est une nouvelle session
        const hasVisited = sessionStorage.getItem('kaia_session_visit');
        if (!hasVisited) {
          const res = await fetch(`${API_URL}/stats/visit`, { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            setVisitors(data.visitors);
            sessionStorage.setItem('kaia_session_visit', 'true');
          } else {
            const errData = await res.json().catch(() => ({}));
            console.error('API Error /stats/visit:', errData);
          }
        }
      } catch (err) {
        console.error('Erreur connexion backend', err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, [adminToken]);

  // Le panier reste stocké localement pour ne pas perdre les articles non achetés
  useEffect(() => {
    localStorage.setItem('kaia_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Analytics tracking (internal API)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'cart', product_ref: product.ref || product.id })
    }).catch(e => console.error(e));

    // E-commerce Tracking: AddToCart
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [product.ref || product.id],
          content_name: product.name,
          value: product.price,
          currency: 'XOF'
        });
      }
      if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
          items: [{
            item_id: product.ref || product.id,
            item_name: product.name,
            price: product.price
          }],
          value: product.price,
          currency: 'XOF'
        });
      }
    }

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

  const placeOrder = async (deliveryInfo, discount = 0, promoCodeId = null) => {
    const orderTotal = calculateCartTotal(cart, countryCode);
    const finalTotal = Math.max(0, orderTotal - discount);
    const orderData = {
      deliveryInfo,
      items: cart,
      total: finalTotal,
      promoCodeId
    };

    try {
      const res = await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch(e) {}
        console.error('API Error /orders:', errData);
        throw new Error(errData.error || 'Erreur lors de la création de la commande');
      }
      // Rafraichir les données depuis le serveur après commande
      await fetchOrders();
      await fetchProducts();
      clearCart();
    } catch (error) {
      console.error('Erreur placeOrder:', error);
      throw error;
    }
  };

  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts(prev => [...prev, newProduct]);
      } else {
        alert("Action non autorisée");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? data : p));
      } else {
        alert("Action non autorisée");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        alert("Action non autorisée");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginAdmin = async (password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response:", text);
        return { success: false, error: `Erreur serveur: ${text ? text.substring(0, 60) : 'No error details'}` };
      }
      if (data && data.success) {
        setAdminToken(data.token);
        localStorage.setItem('kaia_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data?.error || 'Mot de passe incorrect' };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('kaia_admin_token');
    setOrders([]);
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
      isLoading,
      adminToken,
      loginAdmin,
      logoutAdmin,
      isSearchOpen,
      setIsSearchOpen,
      countryCode
    }}>
      {children}
    </ShopContext.Provider>
  );
};
