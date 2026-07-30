import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MenCollection from './pages/MenCollection';
import WomenCollection from './pages/WomenCollection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import Chatbot from './components/Chatbot';

// New Pages
import CGV from './pages/legal/CGV';
import MentionsLegales from './pages/legal/MentionsLegales';
import Confidentialite from './pages/legal/Confidentialite';
import ContactFAQ from './pages/ContactFAQ';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [banner, setBanner] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.announcement_text) setBanner(data.announcement_text);
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="app">
      {!isAdmin && banner && (
        <div style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
          {banner}
        </div>
      )}
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/homme" element={<MenCollection />} />
          <Route path="/femme" element={<WomenCollection />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Legal & Contact Routes */}
          <Route path="/cgv" element={<CGV />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/contact" element={<ContactFAQ />} />
          <Route path="/faq" element={<ContactFAQ />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <Chatbot />}
    </div>
  );
}

export default App;
