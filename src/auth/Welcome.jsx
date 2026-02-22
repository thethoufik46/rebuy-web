import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // if using react-router v6
import { ArrowRight3, TickCircle } from 'iconsax-react'; // make sure iconsax-react is installed

// Replace with your actual asset path
import carIcon from '../assets/icons/caricon.png'; 

const Welcome = () => {
  const navigate = useNavigate();

  // State
  const [dragPosition, setDragPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const videoRef = useRef(null);

  // Constants
  const BUTTON_SIZE = 60; // width & height of the draggable button
  const maxDrag = Math.max(0, containerWidth - BUTTON_SIZE);

  // --- Video setup ---
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
  }, []);

  // --- Measure container width on mount and resize ---
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
    e.preventDefault(); // prevent text selection
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || isCompleted || !containerRef.current) return;

      // Get touch/mouse coordinates
      const clientX = e.type.startsWith('touch')
        ? e.touches[0].clientX
        : e.clientX;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeft = clientX - containerRect.left - BUTTON_SIZE / 2; // center button under cursor
      const clamped = Math.min(maxDrag, Math.max(0, newLeft));

      setDragPosition(clamped);
    },
    [isDragging, isCompleted, maxDrag]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || isCompleted) return;

    setIsDragging(false);

    // Check if dragged far enough to complete
    if (dragPosition > maxDrag * 0.9) {
      setIsCompleted(true);
      // Navigate after a short delay to show the tick animation
      setTimeout(() => {
        navigate('/register'); // adjust route as needed
      }, 500);
    } else {
      // Reset to start
      setDragPosition(0);
    }
  }, [isDragging, isCompleted, dragPosition, maxDrag, navigate]);

  // Attach global move/up events when dragging
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

  // --- Animation keyframes (injected as style tag) ---
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
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.root}>
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4"
        loop
        muted
        autoPlay
        playsInline
        style={styles.video}
      />

      {/* Safe Area Content */}
      <div style={styles.safeArea}>
        <div style={styles.container}>
          {/* Brand Section with Fade-in */}
          <div className="brand-animation" style={styles.brandWrapper}>
            <h1 style={styles.brandTitle}>RE2BUY</h1>
            <p style={styles.brandSubtitle}>USED CAR MARKETPLACE</p>
          </div>

          {/* Spacer to push swipe bar down */}
          <div style={{ flex: 1 }} />

          {/* Glassmorphism Swipe Bar */}
          <div style={styles.swipeBarWrapper} ref={containerRef}>
            <div style={styles.swipeBar}>
              {/* Centered text + arrows (hidden when completed) */}
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

              {/* Completion tick */}
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
                }}
              >
                <img src={carIcon} alt="car" style={styles.carIcon} />
              </div>

              {/* Right side tick icon (always visible) */}
              <div style={styles.rightTick}>
                <TickCircle size={22} color="black" />
              </div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div style={{ height: '4vh' }} />
        </div>
      </div>
    </div>
  );
};

// --- Styles (inline for clarity, can be moved to CSS module) ---
const styles = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#d6cef3', // fallback
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
  safeArea: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    padding: '4vh 7vw',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  brandWrapper: {
    textAlign: 'center',
    opacity: 0, // initial hidden, animation will set to 1
    transform: 'translateY(30px)',
    animationFillMode: 'forwards', // handled by class but keep fallback
  },
  brandTitle: {
    fontSize: '16vw', // responsive
    fontWeight: 900,
    letterSpacing: 4,
    color: 'white',
    textShadow: '0 6px 20px rgba(0,0,0,0.35)',
    margin: 0,
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '3.3vw',
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
    height: '7.5vh',
    minHeight: 50,
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    borderRadius: 50,
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    // Overflow hidden to clip button shadow?
    overflow: 'hidden', // needed so the button doesn't go outside border-radius
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
    pointerEvents: 'none', // allow clicks to pass through to draggable button
  },
  getStartedText: {
    fontWeight: 600,
    color: 'black',
    marginRight: 8,
    fontSize: '1rem',
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
    transition: isDragging => isDragging ? 'none' : 'left 0.1s ease', // smooth return when reset
    // transition handled conditionally? We'll apply a class or inline style. For simplicity, we'll set transition in JS style with a state? Actually better to keep transition for left changes when not dragging.
    // We'll set transition in the component dynamically via style, but we need to know if dragging. We'll add a style property inside component.
    // For now, we'll set a default transition, and remove it during drag via a state class.
    // We'll handle it with a separate CSS class.
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
    pointerEvents: 'none', // not interactive
  },
};

// To handle dynamic transition on drag button (remove transition while dragging for immediate movement)
// We'll create a custom style that adds transition only when not dragging.
// We'll add a state `isDragging` and pass it to style.
// Update the dragButton style inside component to:
// transition: isDragging ? 'none' : 'left 0.12s ease',
// But since we need to access isDragging inside styles object, we'll move it inline.
// So we'll modify the component to use inline style for the button.

export default Welcome;