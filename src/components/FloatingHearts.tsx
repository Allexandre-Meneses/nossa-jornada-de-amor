import React, { useMemo } from 'react';

interface FloatingHeartsProps {
  count?: number;
  burst?: boolean;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 18, burst = false }) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + Math.random() * 8) % 96}%`,
      animationDuration: `${burst ? 2.5 + Math.random() * 2 : 12 + Math.random() * 10}s`,
      animationDelay: `${burst ? Math.random() * 0.4 : Math.random() * 8}s`,
      size: Math.floor(14 + Math.random() * 16),
      opacity: 0.15 + Math.random() * 0.35,
      drift: `${(Math.random() - 0.5) * 60}px`,
    }));
  }, [count, burst]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px] text-rose-500/30 select-none"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `floatUp ${h.animationDuration} linear infinite`,
            animationDelay: h.animationDelay,
            filter: 'drop-shadow(0 0 6px rgba(225, 29, 72, 0.4))',
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-rose-400"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
};
