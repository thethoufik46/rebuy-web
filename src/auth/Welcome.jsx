import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight3, TickCircle, VolumeHigh, VolumeSlash } from 'iconsax-react';
import carIcon from '../assets/icons/caricon.png';

const Welcome = () => {
  const navigate = useNavigate();

  // ============================================
  // ✅ AUTO-LOGIN CHECK (SAFEST APPROACH)
  // Runs before everything else – redirects if token exists
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  // ---------- State ----------
  const [dragPosition, setDragPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // ✅ starts with sound ON

  // ---------- Refs ----------
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const videoRef = useRef(null);

  // Constants
  const BUTTON_SIZE = 60;
  const maxDrag = Math.max(0, containerWidth - BUTTON_SIZE);

  // --- Video setup ---
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => console.log('Autoplay blocked:', err));
    }
  }, []);

  // Toggle sound
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // --- Measure container width ---
  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, []);

  // --- Drag handlers ---
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || isCompleted || !containerRef.current) return;

      const clientX = e.type.startsWith('touch')
        ? e.touches[0].clientX
        : e.clientX;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeft = clientX - containerRect.left - BUTTON_SIZE / 2;
      const clamped = Math.min(maxDrag, Math.max(0, newLeft));

      setDragPosition(clamped);
    },
    [isDragging, isCompleted, maxDrag]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || isCompleted) return;
    setIsDragging(false);

    if (dragPosition > maxDrag * 0.9) {
      setIsCompleted(true);
      setTimeout(() => navigate('/register'), 500);
    } else {
      setDragPosition(0);
    }
  }, [isDragging, isCompleted, dragPosition, maxDrag, navigate]);

  // Attach global events
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // --- Inject keyframes ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes glowPulse {
        0% { opacity: 0.4; }
        50% { opacity: 1; }
        100% { opacity: 0.4; }
      }
      .glow-arrow {
        animation: glowPulse 1.2s infinite ease-in-out;
      }
      .glow-arrow:nth-child(1) { animation-delay: 0s; }
      .glow-arrow:nth-child(2) { animation-delay: 0.4s; }
      .glow-arrow:nth-child(3) { animation-delay: 0.8s; }

      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .brand-animation {
        animation: fadeInUp 1.2s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.root}>
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://pub-73dec08cb6464c74a1b1bb96b4279b12.r2.dev/APP%20VIDEOS%20UPLOAD/intro.mp4"
        loop
        muted={isMuted}
        autoPlay
        playsInline
        style={styles.video}
      />

      {/* Sound Toggle Button */}
      <button onClick={toggleSound} style={styles.soundButton}>
        {isMuted ? <VolumeSlash size={24} color="white" /> : <VolumeHigh size={24} color="white" />}
      </button>

      {/* Main Content - Centered on desktop */}
      <div style={styles.safeArea}>
        <div style={styles.container}>
          {/* Brand Section */}
          <div className="brand-animation" style={styles.brandWrapper}>
            <h1 style={styles.brandTitle}>RE2BUY</h1>
            <p style={styles.brandSubtitle}>USED CAR MARKETPLACE</p>
          </div>

          <div style={{ flex: 1 }} />

          {/* Swipe Bar */}
          <div style={styles.swipeBarWrapper} ref={containerRef}>
            <div style={styles.swipeBar}>
              {!isCompleted && (
                <div style={styles.centerContent}>
                  <span style={styles.getStartedText}>Get Started</span>
                  <div style={styles.arrowGroup}>
                    <ArrowRight3 size={20} className="glow-arrow" style={styles.arrowIcon} />
                    <ArrowRight3 size={20} className="glow-arrow" style={styles.arrowIcon} />
                    <ArrowRight3 size={20} className="glow-arrow" style={styles.arrowIcon} />
                  </div>
                </div>
              )}

              {isCompleted && (
                <div style={styles.centerContent}>
                  <TickCircle size={30} color="black" />
                </div>
              )}

              {/* Draggable Button */}
              <div
                ref={buttonRef}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                style={{
                  ...styles.dragButton,
                  left: dragPosition,
                  transition: isDragging ? 'none' : 'left 0.12s ease',
                }}
              >
                <img src={carIcon} alt="car" style={styles.carIcon} />
              </div>

              {/* Right tick */}
              <div style={styles.rightTick}>
                <TickCircle size={22} color="black" />
              </div>
            </div>
          </div>

          <div style={{ height: '4vh' }} />
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  soundButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  safeArea: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    padding: '4vh 7vw',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    // Desktop centering
    '@media (min-width: 768px)': {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
  },
  brandWrapper: {
    textAlign: 'center',
    opacity: 0,
    transform: 'translateY(30px)',
  },
  brandTitle: {
    fontSize: 'clamp(2.8rem, 16vw, 5rem)',
    fontWeight: 900,
    letterSpacing: 4,
    color: 'white',
    textShadow: '0 6px 20px rgba(0,0,0,0.35)',
    margin: 0,
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: 'clamp(0.9rem, 3.3vw, 1.6rem)',
    letterSpacing: 4.5,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.8)',
    margin: '10px 0 0',
  },
  swipeBarWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: '4vh',
  },
  swipeBar: {
    position: 'relative',
    height: 'clamp(50px, 7.5vh, 80px)',
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    borderRadius: 50,
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  getStartedText: {
    fontWeight: 600,
    color: 'black',
    marginRight: 8,
    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
  },
  arrowGroup: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  arrowIcon: {
    color: 'black',
  },
  dragButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  carIcon: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  rightTick: {
    position: 'absolute',
    right: 6,
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
};

export default Welcome;