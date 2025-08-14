import React from 'react';
import { Spinner as SpinnerIcon } from '@phosphor-icons/react/ssr';

export default function Spinner({
  size = 32,
  color = 'text-white-500',
  className = '',
}) {
  return (
    <div
      className={`my-auto ${className}`}
      aria-label="Loading..."
      role="status"
    >
      {/* Spinner icon with Tailwind animation */}
      <SpinnerIcon
        size={size} // size in pixels (default 32)
        className={`animate-spin ${color}`} // apply spin animation and color
        weight="bold" // optional: makes icon thicker
      />
      {/* Screen reader only text for accessibility */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
