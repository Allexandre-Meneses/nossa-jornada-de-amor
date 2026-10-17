import React from 'react';

interface PadlockIconProps {
  status: 'locked' | 'unlocking' | 'unlocked';
  isLarge?: boolean;
  hasChains?: boolean;
  className?: string;
}

export const PadlockIcon: React.FC<PadlockIconProps> = ({
  status,
  isLarge = false,
  hasChains = false,
  className = '',
}) => {
  const size = isLarge ? 48 : 32;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Correntes discretas para o nível 4 */}
      {hasChains && status === 'locked' && (
        <div className="absolute inset-0 -m-2 pointer-events-none z-10 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#991b1b] opacity-80">
            <path
              d="M 15 35 Q 50 50 85 65"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeDasharray="6 3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 85 35 Q 50 50 15 65"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeDasharray="6 3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Cadeado em formato de coração */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={`transition-all duration-300 ${
          status === 'unlocking'
            ? 'scale-110 -rotate-6'
            : status === 'unlocked'
            ? 'text-[#dc2626]'
            : 'text-[#dc2626]'
        }`}
      >
        {/* Arco do cadeado (haste metálica prateada/vermelha) */}
        <path
          d={
            status === 'unlocked'
              ? 'M18 22 V14 A6 6 0 0 1 30 14 V10' // Haste aberta
              : status === 'unlocking'
              ? 'M18 20 V12 A6 6 0 0 1 30 12 V14' // Haste levantando
              : 'M18 22 V14 A6 6 0 0 1 30 14 V22' // Haste trancada
          }
          fill="none"
          stroke="#4b5563"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Corpo do cadeado em formato de coração */}
        <path
          d="M24 42 C14 34 8 28 8 21 C8 16 12 13 17 13 C20 13 22.5 14.5 24 17 C25.5 14.5 28 13 31 13 C36 13 40 16 40 21 C40 28 34 34 24 42 Z"
          fill={isLarge ? '#991b1b' : '#dc2626'}
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Fenda da fechadura */}
        <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
        <path d="M23 24 L22 30 H26 L25 24 Z" fill="#ffffff" />
      </svg>
    </div>
  );
};
