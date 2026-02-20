import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

/* ✅ IMPORT ICONS (VITE SAFE) */
import financeIcon from "@/assets/icons/1.webp";
import insuranceIcon from "@/assets/icons/2.webp";
import contactIcon from "@/assets/icons/3.webp";
import helpIcon from "@/assets/icons/4.webp";

/* ================= HOME BUTTONS ================= */

const HomeButtons = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: (custom) => ({
      opacity: 0,
      x: custom?.x ?? 0,
      y: custom?.y ?? 0,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.65 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate={controls}>
      
      {/* ROW 1 */}
      <div style={styles.row}>
        <motion.div style={styles.buttonWrapper} variants={itemVariants} custom={{ x: -80 }}>
          <SwipeActionItem
            imagePath={financeIcon}
            value="Finance"
            activeColor="#f44336"
            onTap={() => console.log("Finance")}
          />
        </motion.div>

        <div style={styles.spacer} />

        <motion.div style={styles.buttonWrapper} variants={itemVariants} custom={{ x: 80 }}>
          <SwipeActionItem
            imagePath={insuranceIcon}
            value="Insurance"
            activeColor="#2196f3"
            onTap={() => console.log("Insurance")}
          />
        </motion.div>
      </div>

      <div style={styles.rowGap} />

      {/* ROW 2 */}
      <div style={styles.row}>
        <motion.div style={styles.buttonWrapper} variants={itemVariants} custom={{ y: 60 }}>
          <SwipeActionItem
            imagePath={contactIcon}
            value="Contact"
            activeColor="#4caf50"
            onTap={() => (window.location.href = "tel:8270149856")}
          />
        </motion.div>

        <div style={styles.spacer} />

        <motion.div style={styles.buttonWrapper} variants={itemVariants} custom={{ y: 60 }}>
          <SwipeActionItem
            imagePath={helpIcon}
            value="Help"
            activeColor="#9c27b0"
            multiArrow
            onTap={() => console.log("Help")}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ================= SWIPE ITEM ================= */

const SwipeActionItem = ({
  imagePath,
  value,
  onTap,
  activeColor,
  multiArrow = false,
}) => {
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef(null);
  const dragStartRef = useRef(null);

  const getMaxDrag = () => {
    if (!containerRef.current) return 0;
    return containerRef.current.offsetWidth - 55;
  };

  const handleDragStart = (clientX) => {
    dragStartRef.current = { x: clientX };
  };

  const handleDragMove = (clientX) => {
    if (!dragStartRef.current) return;

    const delta = clientX - dragStartRef.current.x;
    const maxDrag = getMaxDrag();

    setDragX(Math.max(0, Math.min(maxDrag, delta)));
  };

  const handleDragEnd = () => {
    const maxDrag = getMaxDrag();

    if (dragX > maxDrag * 0.9) onTap();

    setDragX(0);
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      style={styles.cardContainer}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => dragStartRef.current && handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      onClick={onTap}
    >
      <div style={styles.cardBackdrop}>
        <div style={styles.contentRow}>
          <div style={styles.iconPlaceholder} />

          <div style={styles.textWrapper}>
            <span style={styles.title}>{value}</span>

            <div style={styles.arrowWrapper}>
              {multiArrow ? (
                <>
                  <FaArrowRight />
                  <FaArrowRight />
                  <FaArrowRight />
                </>
              ) : (
                <FaArrowRight />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.draggableCircle,
            backgroundColor: activeColor,
            transform: `translateY(-50%) translateX(${dragX}px)`,
          }}
        >
          <img src={imagePath} alt={value} style={styles.circleImage} />
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  row: { display: "flex", width: "100%" },
  buttonWrapper: { flex: 1 },
  spacer: { width: 12 },
  rowGap: { height: 14 },

  cardContainer: {
    position: "relative",
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
  },

  cardBackdrop: {
    height: "100%",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 16,
    padding: "10px 12px",
  },

  contentRow: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  iconPlaceholder: { width: 53 },

  textWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: 700,
  },

  arrowWrapper: {
    display: "flex",
    gap: 4,
  },

  draggableCircle: {
    position: "absolute",
    left: 12,
    top: "50%",
    width: 45,
    height: 45,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  circleImage: {
    width: 42,
    height: 42,
  },
};

export default HomeButtons;