// src/components/HomeBoardTwoButton.jsx
import React from 'react';
import { FaCar, FaTruck } from 'react-icons/fa';

/**
 * Two‑button row with glass‑morphism style.
 *
 * @param {function} onOwnBoardTap - callback when Own Board is pressed
 * @param {function} onTBoardTap   - callback when T Board is pressed
 */
export default function HomeBoardTwoButton({ onOwnBoardTap, onTBoardTap }) {
  return (
    <div className="flex gap-3 w-full">
      {/* Own Board */}
      <BoardButton
        title="OWN BOARD"
        subtitle="White கார்"
        icon={<FaCar className="w-4 h-4 text-black" />}
        bgColor="bg-white/40"
        onClick={onOwnBoardTap}
      />

      {/* T Board */}
      <BoardButton
        title="T BOARD"
        subtitle="Taxi டாக்ஸி"
        icon={<FaTruck className="w-4 h-4 text-black" />}
        bgColor="bg-[#FFF3CD]/50"
        onClick={onTBoardTap}
      />
    </div>
  );
}

// ─── Sub‑component ──────────────────────────────────────────
function BoardButton({ title, subtitle, icon, bgColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 h-14 px-3 rounded-2xl
        backdrop-blur-md
        border border-white/30
        shadow-[0_4px_6px_rgba(0,0,0,0.06)]
        flex items-center gap-2.5
        transition-transform active:scale-[0.98]
        ${bgColor}
      `}
    >
      {/* Icon circle */}
      <div className="w-8 h-8 rounded-full bg-white/85 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Text block */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-xs font-semibold leading-tight">{title}</p>
        <p className="text-[10px] text-black/60 leading-tight">{subtitle}</p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <svg
          className="w-3.5 h-3.5 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}