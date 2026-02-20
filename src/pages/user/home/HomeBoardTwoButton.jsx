import React from 'react';
import { FaCar, FaTruck, FaArrowRight } from 'react-icons/fa';

/**
 * HomeBoardTwoButton – Replicates the Flutter UI with two tappable boards.
 *
 * @param {Object} props
 * @param {Function} props.onOwnBoardTap - Callback for OWN BOARD tap
 * @param {Function} props.onTBoardTap   - Callback for T BOARD tap
 */
const HomeBoardTwoButton = ({ onOwnBoardTap, onTBoardTap }) => {
  return (
    <div style={styles.row}>
      {/* OWN BOARD */}
      <div style={styles.buttonWrapper}>
        <BoardButton
          title="OWN BOARD"
          subtitle="White boards"
          icon={<FaCar size={18} color="black" />}
          bgColor="rgba(255, 255, 255, 0.4)"
          onTap={onOwnBoardTap}
        />
      </div>

      {/* 10px gap between buttons */}
      <div style={styles.spacer} />

      {/* T BOARD */}
      <div style={styles.buttonWrapper}>
        <BoardButton
          title="T BOARD"
          subtitle="Taxi Travels"
          icon={<FaTruck size={18} color="black" />}
          bgColor="rgba(255, 243, 205, 0.5)"   // #FFF3CD with 50% opacity
          onTap={onTBoardTap}
        />
      </div>
    </div>
  );
};

/**
 * Internal button component that matches the Flutter design.
 */
const BoardButton = ({ title, subtitle, icon, bgColor, onTap }) => {
  return (
    <div
      onClick={onTap}
      style={{
        ...styles.buttonBase,
        backgroundColor: bgColor,
      }}
    >
      {/* Icon inside white circle */}
      <div style={styles.iconContainer}>{icon}</div>

      {/* Text block */}
      <div style={styles.textContainer}>
        <div style={styles.title}>{title}</div>
        <div style={styles.subtitle}>{subtitle}</div>
      </div>

      {/* Forward arrow */}
      <FaArrowRight size={14} color="black" />
    </div>
  );
};

// Inline styles – easy to adjust or move to a separate CSS file
const styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1, // each button takes equal width
  },
  spacer: {
    width: 10,
  },
  buttonBase: {
    display: 'flex',
    alignItems: 'center',
    height: 56,
    padding: '0 12px',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
    // Backdrop blur (matches Flutter's BackdropFilter with sigma 10)
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    overflow: 'hidden',                  // keeps blur inside border radius
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 1.2,
    marginTop: 1,
  },
};

export default HomeBoardTwoButton;