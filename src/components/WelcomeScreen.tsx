import React, { useState } from 'react';
import { romanticContent } from '../data/romanticContent';
import { audioManager } from '../utils/audioManager';
import { RisingHeartsAnimation } from './RisingHeartsAnimation';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showRisingHearts, setShowRisingHearts] = useState(false);
  const welcomeData = romanticContent.welcome;

  const handleEnterClick = () => {
    if (isPressed) return;
    setIsPressed(true);

    // Inicia áudio respeitando permissões do navegador
    audioManager.registerUserInteraction();
    audioManager.playTrack(romanticContent.welcome.audioSrc, 'Era Óbvio');

    // Dispara a animação real dos corações subindo pela tela
    setShowRisingHearts(true);

    // Transição suave para a próxima tela enquanto os corações sobem
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-white text-[#1f2937] overflow-hidden select-none">
      {/* Faixa decorativa superior vermelha e branca */}
      <div className="w-full">
        <div className="ribbon-top" />
        <div className="ribbon-top-subtle" />
      </div>

      {/* Animação real dos corações subindo (vermelhos e brancos) */}
      {showRisingHearts && <RisingHeartsAnimation count={45} />}

      {/* Área Central Branca, Limpa e Delicada */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full text-center">
        {/* Elemento central: Pequeno coração vermelho elegante com pulso suave */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-[#dc2626] animate-soft-pulse filter drop-shadow-[0_4px_12px_rgba(220,38,38,0.25)]"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Frase de boas-vindas editável direta sobre o fundo branco */}
        <p className="font-romantic text-lg sm:text-xl md:text-2xl text-[#1f2937] leading-relaxed mb-10 max-w-sm font-normal">
          "{welcomeData.message}"
        </p>

        {/* Botão vermelho elegante com texto branco "Entrar" */}
        <button
          onClick={handleEnterClick}
          disabled={isPressed}
          className={`min-h-[48px] px-10 py-3.5 rounded-full font-medium text-base text-white bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg shadow-red-500/20 cursor-pointer ${
            isPressed ? 'scale-95 bg-[#991b1b]' : ''
          }`}
        >
          {welcomeData.buttonText}
        </button>
      </main>

      {/* Faixa decorativa inferior vermelha e branca */}
      <div className="w-full">
        <div className="ribbon-top-subtle" />
        <div className="ribbon-bottom" />
      </div>
    </div>
  );
};
