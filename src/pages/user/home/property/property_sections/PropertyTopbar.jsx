// src/pages/user/home/Pages/property/property_details/PropertyTopbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toggleWishlist, isInWishlist } from '@/services/wishlistApi';
import AppBar from '@/components/AppBar';

/* ================= HELPERS ================= */
const extractId = (value) => {
  if (!value) return '';
  if (typeof value === 'object') {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
    if (Array.isArray(value) && value.length) return extractId(value[0]);
  }
  return value.toString();
};

const categoryName = (property) => property?.category?.toString() || 'Property';
const mainType = (property) => property?.mainType?.toString() || 'Property';

export default function PropertyTopbar({ property, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [toast, setToast] = useState(null);
  const [iconKey, setIconKey] = useState(0);

  const propertyId = extractId(property?._id);
  const category = categoryName(property);
  const type = mainType(property);
  const toastTimerRef = useRef(null);

  // ─── Check wishlist status on mount ──────────────────
  useEffect(() => {
    if (!propertyId) {
      console.warn('⚠️ PropertyTopbar: No propertyId found!');
      setIsChecking(false);
      return;
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        console.log(`🔍 Checking wishlist for propertyId: ${propertyId}`);
        const response = await isInWishlist(propertyId, 'Property');
        console.log('📦 Raw API response (isInWishlist):', response);

        // ─── ROBUST PARSING ──────────────────────────────
        let exists = false;
        if (typeof response === 'boolean') {
          exists = response;
        } else if (response && typeof response === 'object') {
          exists = !!response.exists || !!response.data || !!response.success;
          if (response._id || response.id) exists = true;
        }

        console.log(`✅ Parsed result (isWishlisted): ${exists}`);
        if (isMounted) {
          setIsWishlisted(exists);
        }
      } catch (err) {
        console.error('❌ Wishlist check error:', err);
        if (isMounted) setIsWishlisted(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkStatus();
    return () => { isMounted = false; };
  }, [propertyId]);

  // ─── Auto-dismiss toast ──────────────────────────────
  useEffect(() => {
    if (!toast) return;
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(toastTimerRef.current);
  }, [toast]);

  // ─── Toggle wishlist ──────────────────────────────────
  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isToggling || isChecking) return;

    setIsToggling(true);
    try {
      console.log(`🔄 Toggling wishlist for propertyId: ${propertyId}`);
      const action = await toggleWishlist({ itemId: propertyId, itemType: 'Property' });
      console.log('📦 Raw API response (toggle):', action);

      // ─── ROBUST PARSING for toggle response ──────────
      let newState = false;
      if (typeof action === 'string') {
        newState = action === 'added';
      } else if (action && typeof action === 'object') {
        newState = action.action === 'added' || action.success === true;
        if (action.exists !== undefined) newState = action.exists;
      }

      console.log(`✅ New wishlist state: ${newState}`);
      setIsWishlisted(newState);
      onWishlist?.(newState);

      setToast({
        message: newState ? 'Added to Wishlist ❤️' : 'Removed from Wishlist',
        type: newState ? 'added' : 'removed',
      });
      setIconKey((prev) => prev + 1);
    } catch (err) {
      console.error('❌ Wishlist toggle error:', err);
    } finally {
      setIsToggling(false);
    }
  };

  // ─── Render heart ──────────────────────────────────────
  const renderHeart = () => {
    if (isChecking) {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
      );
    }
    return (
      <motion.div
        key={iconKey}
        whileTap={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {isWishlisted ? (
          <FaHeart className="w-5 h-5 text-red-500" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-black" />
        )}
      </motion.div>
    );
  };

  // ─── Title: two‑line category + mainType ──────────────
  const title = (
    <div className="flex flex-col items-center leading-tight">
      <span className="text-sm text-black/60">{category}</span>
      <span className="text-base font-bold text-black uppercase">{type}</span>
    </div>
  );

  // ─── Right action: heart ──────────────────────────────
  const actions = propertyId ? (
    <button
      onClick={handleToggle}
      className="p-2"
      disabled={isChecking || isToggling}
    >
      {renderHeart()}
    </button>
  ) : null;

  // ─── Toast ─────────────────────────────────────────────
  const toastElement = (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-medium ${
            toast.type === 'added'
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 text-white'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ─── Return ────────────────────────────────────────────
  return (
    <>
      <AppBar title={title} actions={actions} />
      {toastElement}
    </>
  );
}