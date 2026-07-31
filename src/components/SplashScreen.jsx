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
      }, 75); // 75ms per letter

      return () => clearTimeout(timeout);
    } else {
      // Once full text is typed, wait a moment then fade out
      const fadeTimeout = setTimeout(() => {
        setIsFading(true);
      }, 700);

      const hideTimeout = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem('kaia_seen_splash', 'true');
      }, 1400);

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
        backgroundColor: '#0c1b17', // Deep luxury Kaïa dark teal
        color: '#f4efe2',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div 
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Letter-by-Letter Title */}
      <h1 
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 6vw, 3.8rem)',
          fontWeight: 600,
          letterSpacing: '0.25em',
          color: '#f4efe2',
          margin: 0,
          textAlign: 'center',
          minHeight: '1.2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'uppercase'
        }}
      >
        {displayedText}
        {currentIndex < fullText.length && (
          <span 
            style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              backgroundColor: '#D4AF37',
              marginLeft: '6px',
              animation: 'pulse 0.6s infinite alternate'
            }}
          />
        )}
      </h1>

      {/* Subtle Gold Line */}
      <div 
        style={{
          width: currentIndex >= fullText.length ? '80px' : '0px',
          height: '1px',
          background: '#D4AF37',
          marginTop: '20px',
          marginBottom: '16px',
          transition: 'width 0.6s ease-out',
          opacity: 0.8
        }}
      />

      {/* Subtitle */}
      <p 
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#D4AF37',
          margin: 0,
          opacity: currentIndex >= fullText.length ? 1 : 0,
          transform: currentIndex >= fullText.length ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          fontWeight: 600
        }}
      >
        DAKAR • LUNETTES DE SOLEIL
      </p>

      {/* Pulsing animation keyframes */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
