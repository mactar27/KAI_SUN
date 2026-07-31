import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const fullText = "KAÏA SUNGLASSES";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw splash during this session
    const hasSeen = sessionStorage.getItem('kaia_seen_splash');
    if (hasSeen) {
      setIsDone(true);
      return;
    }

    // Letter-by-letter typing effect
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 70); // 70ms per letter

      return () => clearTimeout(timeout);
    } else {
      // Once full text is typed, wait a moment then fade out
      const fadeTimeout = setTimeout(() => {
        setIsFading(true);
      }, 650);

      const hideTimeout = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem('kaia_seen_splash', 'true');
      }, 1250);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [currentIndex]);

  if (isDone) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        // Bright Sunny Summer Gradient: Soft Sky Blue -> Luminous Sun Light -> Warm Sand Gold
        background: 'linear-gradient(135deg, #e0f2fe 0%, #fffdf5 45%, #fef3c7 100%)',
        color: '#1e3a34',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Golden Summer Sunburst Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(255, 253, 245, 0) 70%)',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Summer Sun Icon */}
      <div 
        style={{
          fontSize: '2.5rem',
          marginBottom: '16px',
          color: '#d97706',
          opacity: 0.9,
          animation: 'spin 20s linear infinite'
        }}
      >
        ☀️
      </div>

      {/* Main Letter-by-Letter Title */}
      <h1 
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 6vw, 3.8rem)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: '#1e3a34', // Deep Ocean Teal
          margin: 0,
          textAlign: 'center',
          minHeight: '1.2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(255,255,255,0.8)'
        }}
      >
        {displayedText}
        {currentIndex < fullText.length && (
          <span 
            style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              backgroundColor: '#d97706',
              marginLeft: '6px',
              animation: 'pulse 0.6s infinite alternate'
            }}
          />
        )}
      </h1>

      {/* Subtle Warm Gold Line */}
      <div 
        style={{
          width: currentIndex >= fullText.length ? '90px' : '0px',
          height: '2px',
          background: 'linear-gradient(90deg, #d97706, #fbbf24)',
          marginTop: '20px',
          marginBottom: '16px',
          transition: 'width 0.5s ease-out',
          borderRadius: '2px'
        }}
      />

      {/* Subtitle */}
      <p 
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.78rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#2d4a43',
          margin: 0,
          opacity: currentIndex >= fullText.length ? 1 : 0,
          transform: currentIndex >= fullText.length ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          fontWeight: 700
        }}
      >
        DAKAR • LUNETTES DE SOLEIL
      </p>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
