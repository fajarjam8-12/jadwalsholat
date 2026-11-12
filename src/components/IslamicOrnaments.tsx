import React from 'react';

/**
 * High-performance, lightweight pure SVG Islamic Ornaments
 * Inspired by classic Andalusian, Ottoman, and Nusantara Islamic sacred geometry
 */

export const IslamicStarPattern: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.07,
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="islamic-star-tile" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* 8-pointed star (Rub el Hizb) */}
        <polygon
          points="30,6 36,20 50,20 40,30 46,44 30,36 14,44 20,30 10,20 24,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <rect x="18" y="18" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="0.8" transform="rotate(45 30 30)" />
        <rect x="18" y="18" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.4" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="60" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="0" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="60" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-star-tile)" />
  </svg>
);

export const IslamicArchBorder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full flex items-center justify-center py-1 opacity-70 ${className}`}>
    <svg width="180" height="16" viewBox="0 0 180 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 8 H60 C75 8, 80 1, 90 1 C100 1, 105 8, 120 8 H180"
        stroke="url(#arch-grad)"
        strokeWidth="1.5"
      />
      <circle cx="90" cy="1" r="2.5" fill="#10b981" />
      <polygon points="90,4 87,8 90,12 93,8" fill="#fde047" />
      <defs>
        <linearGradient id="arch-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const RubElHizbIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
  >
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.6" rx="1.5" />
    <rect
      x="5"
      y="5"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth="1.6"
      rx="1.5"
      transform="rotate(45 12 12)"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);
