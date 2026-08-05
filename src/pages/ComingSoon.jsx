import React from 'react';

const ComingSoon = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--kaia-cream)',
      color: 'var(--ink)',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '3rem', 
          fontWeight: 700, 
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          KAÏA SUN
        </h1>
        <div style={{
          width: '60px',
          height: '2px',
          background: 'var(--kaia-gold)',
          margin: '24px auto'
        }}></div>
      </div>
      
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '2rem',
        fontWeight: 500,
        marginBottom: '1rem',
        fontStyle: 'italic'
      }}>
        Site en cours de préparation
      </h2>
      
      <p style={{
        color: 'var(--ink-soft)',
        maxWidth: '500px',
        lineHeight: 1.6,
        fontSize: '1.1rem'
      }}>
        Nous préparons quelque chose d'exceptionnel. 
        Revenez très bientôt pour découvrir notre collection.
      </p>
    </div>
  );
};

export default ComingSoon;
