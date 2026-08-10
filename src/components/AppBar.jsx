// src/components/AppBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Reusable AppBar with back button.
 *
 * @param {string|React.ReactNode} title - Page title (string or custom node).
 * @param {function} onBack - Optional custom back handler (default: navigate(-1)).
 * @param {React.ReactNode} actions - Optional right-side elements (e.g., icons, buttons).
 * @param {string} className - Additional CSS classes for the container.
 */
export default function AppBar({ title, onBack, actions, className = "" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={`sticky top-0 z-10 bg-[#E9E9FF] px-4 py-3 flex items-center justify-between ${className}`}
    >
      {/* Left: Back button */}
      <button
        onClick={handleBack}
        className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition flex-shrink-0"
        aria-label="Go back"
      >
        <svg
          className="w-4 h-4 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Center: Title (string or custom node) */}
      <div className="flex-1 text-center mx-2">
        {typeof title === "string" ? (
          <span className="text-base font-semibold text-black truncate">{title}</span>
        ) : (
          title
        )}
      </div>

      {/* Right: Actions (optional) */}
      <div className="w-9 flex items-center justify-end flex-shrink-0">
        {actions || null}
      </div>
    </div>
  );
}