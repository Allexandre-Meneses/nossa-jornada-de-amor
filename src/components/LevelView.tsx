import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { LevelData } from '../types/romantic';
import { PhotoFrame } from './PhotoFrame';
import { RisingHeartsAnimation } from './RisingHeartsAnimation';

interface LevelViewProps {
  level: LevelData;
  isCompleted: boolean;
  onBackToMenu: () => void;
  onCompleteLevel: () => void;
  onResponseSelected: (choice: string) => Promise<void>;
  initialResponse?: string | null;
}

type NotificationStatus = 'idle' | 'sending' | 'sent' | 'error';

export const LevelView: React.FC<LevelViewProps> = ({
  level,
  isCompleted,
  onBackToMenu,
  onCompleteLevel,
  onResponseSelected,
  initialResponse = null,
}) => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(
    initialResponse
  );
  const [showHearts, setShowHearts] = useState(false);
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>(initialResponse ? 'sent' : 'idle');

  const handleChoiceClick = async (choice: string) => {
    if (notificationStatus === 'sending' || notificationStatus === 'sent') return;

    setSelectedResponse(choice);

    if (
      choice.toLowerCase().includes('tentar') ||
      choice.toLowerCase().includes('fim') ||
      choice.toLowerCase().includes('sim')
    ) {
      setShowHearts(true);
    }

    if (level.isGrandFinale) {
      setNotificationStatus('sending');
      try {
        await onResponseSelected(choice);
        setNotificationStatus('sent');
      } catch {
        setNotificationStatus('error');
      }
    }
  };

  const getFeedbackMessage = (choice: string) => {
    if (choice.toLowerCase().includes('amigos')) {
      return {
        title: 'Entendido com todo o carinho ❤️',
        subtitle:
          'Eu respeito a sua decisão de coração. Ter a sua amizade e a sua presença na minha vida sempre será a coisa mais valiosa pra mim!',
      };
    }
    if (choice.toLowerCase().includes('tentar')) {
      return {
        title: 'Você não vai se arrepender! ✨❤️',
        subtitle:
          'Prometo fazer cada segundo do nosso primeiro Date valer a pena. Nosso encontro está marcado!',
      };
    }
    return {
      title: 'Eu sabia! Não via a hora de ouvir isso! 🥰✨',
      subtitle:
        'Prepare-se, porque o nosso primeiro Date vai ser o momento mais especial de todos! ❤️',
    };
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-white text-[#1f2937]">
      <div className="w-full">
        <div className="ribbon-top" />
        <div className="ribbon-top-subtle" />
      </div>

      {showHearts && (
        <RisingHeartsAnimation
          onComplete={() => setShowHearts(false)}
          count={45}
        />
      )}

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col">
        <header className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <button
            onClick={onBackToMenu}
            className="min-h-[44px] min-w-[44px] inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#dc2626] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <h1 className="font-romantic text-lg sm:text-xl font-bold text-[#1f2937]">
            {level.title}
          </h1>

          <div className="w-16 text-right">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#dc2626] font-medium">
                <Check className="w-3.5 h-3.5" />
                Concluído
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col space-y-6">
          <div className="space-y-4 text-sm sm:text-base text-gray-800 leading-relaxed font-body">
            {level.content.messageParagraphs.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {level.content.responseButtons &&
            level.content.responseButtons.length > 0 && (
              <div className="my-6">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                  {level.content.responseButtons.map((btnText) => (
                    <button
                      key={btnText}
                      onClick={() => handleChoiceClick(btnText)}
                      disabled={
                        notificationStatus === 'sending' ||
                        notificationStatus === 'sent'
                      }
                      className={`min-h-[58px] sm:min-h-[52px] p-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold leading-tight transition-all shadow-romantic-sm active:scale-95 cursor-pointer flex items-center justify-center text-center ${
                        selectedResponse === btnText
                          ? 'bg-[#991b1b] text-white ring-2 ring-red-300'
                          : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-55 disabled:cursor-not-allowed'
                      }`}
                    >
                      {btnText}
                    </button>
                  ))}
                </div>

                {selectedResponse && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-center animate-fadeIn">
                    <p className="font-romantic text-sm sm:text-base font-semibold text-[#dc2626]">
                      {getFeedbackMessage(selectedResponse).title}
                    </p>
                    <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                      {getFeedbackMessage(selectedResponse).subtitle}
                    </p>

                    {notificationStatus === 'sending' && (
                      <p className="text-xs text-gray-500 mt-3" role="status">
                        Enviando sua resposta...
                      </p>
                    )}
                    {notificationStatus === 'sent' && (
                      <p
                        className="text-xs font-medium text-green-700 mt-3"
                        role="status"
                      >
                        Resposta registrada com sucesso ✓
                      </p>
                    )}
                    {notificationStatus === 'error' && (
                      <div className="mt-3" role="alert">
                        <p className="text-xs text-red-700">
                          Não foi possível enviar agora. Toque abaixo para tentar
                          novamente.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleChoiceClick(selectedResponse)}
                          className="mt-2 text-xs font-semibold text-[#dc2626] underline underline-offset-2 cursor-pointer"
                        >
                          Tentar enviar novamente
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          {level.content.photos && level.content.photos.length > 0 && (
            <div className="my-2 space-y-4">
              {level.content.photos.map((photo) => (
                <PhotoFrame key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>

        <footer className="mt-8 pt-4 pb-2 text-center">
          <button
            onClick={onCompleteLevel}
            disabled={level.isGrandFinale && notificationStatus !== 'sent'}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-medium text-sm text-white bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 transition-all shadow-md shadow-red-500/20 cursor-pointer disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {level.isGrandFinale && notificationStatus !== 'sent'
              ? notificationStatus === 'sending'
                ? 'Enviando resposta...'
                : 'Escolha uma resposta acima'
              : isCompleted
                ? 'Voltar para o menu'
                : 'Concluir nível'}
          </button>
        </footer>
      </main>

      <div className="w-full">
        <div className="ribbon-top-subtle" />
        <div className="ribbon-bottom" />
      </div>
    </div>
  );
};
