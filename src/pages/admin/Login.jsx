import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Lock } from 'lucide-react';

const Login = () => {
  const { loginAdmin } = useContext(ShopContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await loginAdmin(password);
    if (!result.success) {
      setError(result.error || 'Mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div className="section container animate-fade-in" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', borderRadius: '0px', backgroundColor: '#fafafa', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
          <Lock size={40} />
        </div>
        <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Espace Protégé</h2>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-light)' }}>
              Mot de passe administrateur
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0px',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                backgroundColor: 'transparent'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '1.2rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
