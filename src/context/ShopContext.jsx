import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const calculateCartTotal = (cart) => {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  return Math.floor(totalQuantity / 2) * 30000 + (totalQuantity % 2) * 25000;
};

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
  
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('kaia_admin_token') || null);

  // Fetch initial data
  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
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
    const res = await fetch(`${API_URL}/stats`);
    const data = await res.json();
    setVisitors(data.visitors);
    setDailyVisits(data.daily || []);
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([fetchProducts(), fetchStats()]);
        if (adminToken) await fetchOrders();
        
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
  }, [adminToken]);

  // Le panier reste stocké localement pour ne pas perdre les articles non achetés
  useEffect(() => {
    localStorage.setItem('kaia_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Analytics tracking
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'cart', product_ref: product.ref || product.id })
    }).catch(e => console.error(e));

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
    const orderTotal = calculateCartTotal(cart);
    const orderData = {
      customer_name: `${deliveryInfo.prenom} ${deliveryInfo.nom}`,
      phone: deliveryInfo.phone,
      address: `${deliveryInfo.adresse}, ${deliveryInfo.ville}`,
      total_amount: orderTotal,
      items: cart.map(item => ({ id: item.product.id, quantity: item.quantity }))
    };

    try {
      await fetch(`/api/orders`, {
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
        return false;
      }
      if (data && data.success) {
        setAdminToken(data.token);
        localStorage.setItem('kaia_admin_token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
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
      logoutAdmin
    }}>
      {children}
    </ShopContext.Provider>
  );
};
