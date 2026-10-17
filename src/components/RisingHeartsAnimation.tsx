import React, { useMemo, useEffect } from 'react';

interface RisingHeartsAnimationProps {
  onComplete?: () => void;
  count?: number;
}

interface HeartParticle {
  id: number;
  left: number; // percentage 3% to 97%
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px
  driftXEnd: number; // px
  color: string;
  stroke: string;
  rotate: number; // degrees
}

export const RisingHeartsAnimation: React.FC<RisingHeartsAnimationProps> = ({
  onComplete,
  count = 42,
}) => {
  const particles = useMemo<HeartParticle[]>(() => {
    const colorPalette = [
      { fill: '#dc2626', stroke: '#991b1b' }, // Cherry red
      { fill: '#c8102e', stroke: '#7f1d1d' }, // Deep red
      { fill: '#ef4444', stroke: '#b91c1c' }, // Bright red
      { fill: '#ffffff', stroke: '#dc2626' }, // White heart with red border
      { fill: '#fff5f5', stroke: '#ef4444' }, // Pure cream white with red stroke
      { fill: '#b91c1c', stroke: '#7f1d1d' }, // Ruby
    ];

    return Array.from({ length: count }).map((_, i) => {
      const palette = colorPalette[i % colorPalette.length];
      const left = Math.round(4 + (i * 92) / count + (Math.random() * 6 - 3));
      const size = Math.round(18 + Math.random() * 18); // 18px to 36px
      const duration = Number((1.6 + Math.random() * 1.2).toFixed(2)); // 1.6s to 2.8s
      const delay = Number((Math.random() * 0.45).toFixed(2));
      const driftX = Math.round((Math.random() - 0.5) * 60);
      const driftXEnd = Math.round((Math.random() - 0.5) * 90);
      const rotate = Math.round((Math.random() - 0.5) * 40);

      return {
        id: i,
        left: Math.max(3, Math.min(96, left)),
        size,
        duration,
        delay,
        driftX,
        driftXEnd,
        color: palette.fill,
        stroke: palette.stroke,
        rotate,
      };
    });
  }, [count]);

  useEffect(() => {
    // A animação dura no máximo ~2.5s antes de concluir
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-30px] animate-rising-heart will-change-transform"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // @ts-expect-error custom CSS variable for keyframe drift
            '--drift-x': `${p.driftX}px`,
            '--drift-x-end': `${p.driftXEnd}px`,
            transform: `rotate(${p.rotate}deg)`,
            filter:
              p.color === '#ffffff' || p.color === '#fff5f5'
                ? 'drop-shadow(0 2px 5px rgba(220, 38, 38, 0.4))'
                : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill={p.color}
            stroke={p.stroke}
            strokeWidth="1.2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
