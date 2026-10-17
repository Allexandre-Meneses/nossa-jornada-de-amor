import React, { useEffect, useState } from 'react';
import { RisingHeartsAnimation } from './RisingHeartsAnimation';

interface CupidAnimationProps {
  targetLevel: number;
  levelTitle: string;
  onFinished: () => void;
}

export const CupidAnimation: React.FC<CupidAnimationProps> = ({
  targetLevel,
  levelTitle,
  onFinished,
}) => {
  const [phase, setPhase] = useState<'flying-in' | 'aiming' | 'shooting' | 'impact' | 'celebration'>('flying-in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('aiming'), 500);
    const t2 = setTimeout(() => setPhase('shooting'), 1200);
    const t3 = setTimeout(() => setPhase('impact'), 1900);
    const t4 = setTimeout(() => setPhase('celebration'), 2300);
    const t5 = setTimeout(() => {
      onFinished();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md p-4 animate-fadeIn">
      {/* Botão sutil de pular */}
      <button
        onClick={onFinished}
        className="absolute top-6 right-6 text-xs text-[#991b1b] hover:text-[#dc2626] px-3.5 py-1.5 rounded-full border border-red-200 bg-white shadow-sm transition-colors cursor-pointer"
      >
        Pular ✕
      </button>

      {/* Corações subindo no momento do impacto (substituindo confetes) */}
      {(phase === 'impact' || phase === 'celebration') && (
        <RisingHeartsAnimation count={28} />
      )}

      <div className="relative w-full max-w-sm flex flex-col items-center text-center">
        {/* Título simples */}
        <div className="mb-4">
          <h3 className="font-romantic text-2xl font-bold text-[#1f2937]">
            Desbloqueando {levelTitle}
          </h3>
        </div>

        {/* Palco da Animação do Cupido e Flecha */}
        <div className="relative w-72 h-64 flex items-center justify-center">
          {/* O CUPIDO */}
          <div
            className={`transition-all duration-600 transform ${
              phase === 'flying-in'
                ? '-translate-x-20 -translate-y-8 opacity-0'
                : phase === 'aiming'
                ? '-translate-x-12 opacity-100'
                : phase === 'shooting'
                ? '-translate-x-10 opacity-100 scale-105'
                : '-translate-x-14 opacity-60 scale-95'
            }`}
          >
            <svg width="110" height="110" viewBox="0 0 100 100">
              {/* Asas */}
              <g className="animate-pulse">
                <path
                  d="M 35 45 C 10 30 15 10 32 25 C 20 28 22 40 35 45 Z"
                  fill="#ffffff"
                  stroke="#dc2626"
                  strokeWidth="1.5"
                />
                <path
                  d="M 52 44 C 75 28 72 8 55 24 C 65 27 63 39 52 44 Z"
                  fill="#fee2e2"
                  stroke="#dc2626"
                  strokeWidth="1.5"
                />
              </g>

              {/* Auréola delicada */}
              <ellipse
                cx="44"
                cy="20"
                rx="13"
                ry="3.5"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.5"
              />

              {/* Cabeça */}
              <circle cx="44" cy="34" r="12" fill="#fff5f5" stroke="#dc2626" strokeWidth="1.2" />

              {/* Detalhes do rosto */}
              <circle cx="39" cy="36" r="1.5" fill="#dc2626" />
              <circle cx="48" cy="36" r="1.5" fill="#dc2626" />

              {/* Cabelo */}
              <circle cx="37" cy="25" r="3.5" fill="#dc2626" />
              <circle cx="44" cy="23" r="4" fill="#dc2626" />
              <circle cx="50" cy="26" r="3.5" fill="#dc2626" />

              {/* Túnica branca com contorno vermelho */}
              <path
                d="M 36 45 C 32 58 35 66 45 66 C 55 66 58 58 53 45 Z"
                fill="#ffffff"
                stroke="#dc2626"
                strokeWidth="1.5"
              />

              {/* Arco vermelho */}
              <path
                d="M 56 32 Q 72 48 56 64"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Corda do arco */}
              <path
                d={phase === 'aiming' ? 'M 56 32 L 48 48 L 56 64' : 'M 56 32 L 56 64'}
                fill="none"
                stroke="#991b1b"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* FLECHA DO CUPIDO */}
          {phase === 'shooting' && (
            <div className="absolute z-20 transition-all duration-600 ease-out transform translate-x-12">
              <svg width="50" height="24" viewBox="0 0 50 24">
                <line x1="8" y1="12" x2="42" y2="12" stroke="#dc2626" strokeWidth="2.5" />
                <path
                  d="M 42 12 L 36 8 L 40 12 L 36 16 Z"
                  fill="#dc2626"
                />
              </svg>
            </div>
          )}

          {/* CADEADO ALVO */}
          <div
            className={`transition-all duration-400 transform ${
              phase === 'impact'
                ? 'scale-115 -rotate-6'
                : phase === 'celebration'
                ? 'scale-105 rotate-0'
                : 'scale-95'
            }`}
          >
            <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-romantic-md">
              <svg
                width="52"
                height="52"
                viewBox="0 0 48 48"
                className="text-[#dc2626]"
              >
                <path
                  d={
                    phase === 'celebration' || phase === 'impact'
                      ? 'M18 20 V12 A6 6 0 0 1 30 12 V8'
                      : 'M18 22 V14 A6 6 0 0 1 30 14 V22'
                  }
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M24 42 C14 34 8 28 8 21 C8 16 12 13 17 13 C20 13 22.5 14.5 24 17 C25.5 14.5 28 13 31 13 C36 13 40 16 40 21 C40 28 34 34 24 42 Z"
                  fill={targetLevel === 4 ? '#991b1b' : '#dc2626'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
                <path d="M23 24 L22 30 H26 L25 24 Z" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mensagem simples */}
        <div className="min-h-[32px] mt-2">
          {phase === 'impact' || phase === 'celebration' ? (
            <span className="text-sm font-medium text-[#dc2626]">
              Desbloqueado com sucesso
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Abrindo cadeado...
            </span>
          )}
        </div>

        <button
          onClick={onFinished}
          className="mt-5 px-7 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
