import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const brandName = "KAÏA";
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

    // Letter-by-letter typing effect for "KAÏA"
    if (currentIndex < brandName.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + brandName[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 120); // Smooth 120ms per letter

      return () => clearTimeout(timeout);
    } else {
      // Once KAÏA is typed, wait briefly then fade out splash overlay
      const fadeTimeout = setTimeout(() => {
        setIsFading(true);
      }, 700);

      const hideTimeout = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem('kaia_seen_splash', 'true');
      }, 1300);

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
        backgroundColor: '#f4efe2', // Exact Kaïa warm cream brand color
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        overflow: 'hidden',
        padding: '20px'
      }}
    >
      {/* Ultra-Luxurious Minimalist Brand Typography */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {/* Main "KAÏA" Letter-by-Letter Serif Title */}
        <h1 
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.8rem, 12vw, 5.2rem)',
            fontWeight: 400,
            letterSpacing: '0.18em',
            color: '#3a4a35', // Signature Kaïa Olive Green
            margin: 0,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {displayedText}
          {currentIndex < brandName.length && (
            <span 
              style={{
                display: 'inline-block',
                width: '3px',
                height: '0.7em',
                backgroundColor: '#c6a664',
                marginLeft: '4px',
                animation: 'pulse 0.5s infinite alternate'
              }}
            />
          )}
        </h1>

        {/* Subtitle "SUNGLASSES" (Identical to Navbar logo styling) */}
        <div 
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(8px, 2.5vw, 11px)',
            fontWeight: 600,
            letterSpacing: '0.6em',
            color: '#3a4a35',
            marginTop: '12px',
            textTransform: 'uppercase',
            opacity: currentIndex >= brandName.length ? 1 : 0,
            transform: currentIndex >= brandName.length ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
          }}
        >
          SUNGLASSES
        </div>

        {/* Delicate Gold Accent Line */}
        <div 
          style={{
            width: currentIndex >= brandName.length ? '40px' : '0px',
            height: '1px',
            background: '#c6a664',
            marginTop: '20px',
            transition: 'width 0.5s ease-out',
            opacity: 0.8
          }}
        />
      </div>

      {/* Pulse animation for cursor */}
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
