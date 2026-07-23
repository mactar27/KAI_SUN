import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element programmatically to avoid DOM clutter
    const audio = new Audio('/ambiance.webm');
    audio.loop = true;
    audio.volume = 0.4; // Soft background volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <style>{`
        @keyframes pointToButton {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
      
      {!isPlaying && (
        <div style={{
          position: 'fixed',
          bottom: '36px',
          right: '85px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#111',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'pointToButton 1.5s infinite ease-in-out'
        }}>
          <span>Mettre l'ambiance</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </div>
      )}

      <button
        onClick={togglePlay}
        title={isPlaying ? "Désactiver la musique" : "Activer la musique"}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: isPlaying ? '#111' : '#fff',
          color: isPlaying ? '#fff' : '#111',
          border: isPlaying ? 'none' : '2px solid #e5e5e5',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.3s ease',
        }}
      >
        {isPlaying ? (
          // Pause icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          // Play icon (Music note)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        )}
      </button>
    </>
  );
};

export default AudioPlayer;
