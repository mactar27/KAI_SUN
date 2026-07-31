import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw splash during this session
    const hasSeen = sessionStorage.getItem('kaia_seen_splash');
    if (hasSeen) {
      setIsDone(true);
      return;
    }

    // Sequence timing for haute-couture reveal:
    // 0ms: Start letter reveal
    // 1100ms: Reveal SUNGLASSES subtitle
    // 1600ms: Start silky fade out
    // 2300ms: Unmount
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, 1600);

    const hideTimeout = setTimeout(() => {
      setIsDone(true);
      sessionStorage.setItem('kaia_seen_splash', 'true');
    }, 2350);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (isDone) return null;

  const letters = ['K', 'A', 'Ï', 'A'];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f5ee', // Silk warm luxury cream
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        overflow: 'hidden',
        padding: '24px'
      }}
    >
      {/* Delicate Ambient Halo */}
      <div 
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(198, 166, 100, 0.12) 0%, rgba(248, 245, 238, 0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Luxury Brand Typography Container */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* "K A Ï A" Staggered Smooth Fade & Float-Up */}
        <h1 
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 14vw, 5.8rem)',
            fontWeight: 400,
            color: '#3a4a35', // Signature Kaïa Olive Green
            margin: 0,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.18em'
          }}
        >
          {letters.map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                animation: 'luxLetterReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: `${0.12 * index + 0.1}s`,
                opacity: 0,
                transform: 'translateY(16px)'
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Subtitle "S U N G L A S S E S" */}
        <div 
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(9px, 2.6vw, 12px)',
            fontWeight: 600,
            letterSpacing: '0.65em',
            color: '#3a4a35',
            marginTop: '16px',
            textTransform: 'uppercase',
            animation: 'luxSubReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            animationDelay: '0.7s',
            opacity: 0,
            transform: 'translateY(10px)',
            paddingLeft: '0.65em' // Optical alignment for wide tracking
          }}
        >
          SUNGLASSES
        </div>

        {/* Whisper-Thin Gold Accent Line */}
        <div 
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #c6a664, transparent)',
            marginTop: '22px',
            animation: 'luxLineExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            animationDelay: '0.95s',
            width: '0px',
            opacity: 0.8
          }}
        />
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes luxLetterReveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes luxSubReveal {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes luxLineExpand {
          0% {
            width: 0px;
          }
          100% {
            width: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
