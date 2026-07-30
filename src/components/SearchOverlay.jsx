import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useContext(ShopContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setQuery('');
      setResults([]);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    const matched = products.filter(p => {
      const searchString = `${p.name} ${p.ref} ${p.colorway} ${p.category} ${p.gender}`.toLowerCase();
      return searchTerms.every(term => searchString.includes(term));
    });
    
    // Group variants by base ref (remove last letter if it's A, B, etc.)
    const grouped = new Map();
    matched.forEach(p => {
      const groupKey = p.groupId || p.ref.substring(0, p.ref.length - 1);
      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, p);
      }
    });
    
    setResults(Array.from(grouped.values()));
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255, 255, 255, 0.98)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out forwards'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      
      {/* Header / Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginTop: 'env(safe-area-inset-top, 20px)'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#f5f5f5',
          borderRadius: '12px',
          padding: '12px 16px'
        }}>
          <Search size={20} color="#888" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Rechercher un modèle, une couleur..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              outline: 'none',
              color: 'var(--ink)'
            }}
          />
        </div>
        <button 
          onClick={() => setIsSearchOpen(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)'
          }}
        >
          <X size={28} />
        </button>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '20px', paddingBottom: '40px' }}>
        {query && results.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
            Aucun résultat trouvé pour "{query}".
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {results.map(product => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => {
              setIsSearchOpen(false);
              navigate('/#collection');
              // Give router time to navigate before scrolling
              setTimeout(() => {
                const el = document.getElementById('collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>
              <div style={{ 
                background: '#f9f9f9', 
                borderRadius: '12px', 
                padding: '16px', 
                marginBottom: '12px',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src={product.images[0]} alt={product.name} style={{ width: '90%', height: 'auto', objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--ink-soft)' }}>{product.ref}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', lineHeight: 1.2, marginTop: '4px' }}>{product.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{product.colorway}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
