import React from 'react';
import { LevelData, LevelStatus } from '../types/romantic';
import { romanticContent } from '../data/romanticContent';
import { PadlockIcon } from './PadlockIcon';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';

interface JourneyMenuProps {
  levels: LevelData[];
  unlockedLevels: number[];
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onResetProgress: () => void;
}

export const JourneyMenu: React.FC<JourneyMenuProps> = ({
  levels,
  unlockedLevels,
  completedLevels,
  onSelectLevel,
  onResetProgress,
}) => {
  const getLevelStatus = (levelId: number): LevelStatus => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (unlockedLevels.includes(levelId)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-white text-[#1f2937] select-none">
      {/* Faixa decorativa superior vermelha e branca */}
      <div className="w-full">
        <div className="ribbon-top" />
        <div className="ribbon-top-subtle" />
      </div>

      {/* Área Central Branca e Limpa */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 py-8 flex flex-col">
        {/* Título Principal Simples */}
        <header className="text-center mb-8">
          <h1 className="font-romantic text-2xl sm:text-3xl font-bold text-[#1f2937]">
            {romanticContent.journey.title}
          </h1>
        </header>

        {/* Lista dos 4 Níveis (Composição limpa, sem cartões pesados) */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {levels.map((level) => {
            const status = getLevelStatus(level.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isGrand = level.isGrandFinale;

            return (
              <div
                key={level.id}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isLocked
                    ? 'border-gray-200 bg-gray-50/60 opacity-60'
                    : isCompleted
                    ? 'border-red-200 bg-white hover:border-red-300 shadow-romantic-sm'
                    : 'border-red-300 bg-white shadow-romantic-sm'
                }`}
              >
                {/* Ícone e Nome do Nível */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#dc2626]">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isLocked ? (
                      <PadlockIcon
                        status="locked"
                        isLarge={false}
                        hasChains={isGrand}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-50 border border-red-300 flex items-center justify-center text-[#dc2626]">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-romantic text-base sm:text-lg font-semibold text-[#1f2937]">
                      {level.title}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {isCompleted
                        ? 'Concluído'
                        : isLocked
                        ? 'Bloqueado'
                        : 'Disponível'}
                    </span>
                  </div>
                </div>

                {/* Botão de Acesso Direto */}
                <div>
                  {!isLocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectLevel(level.id)}
                      className="min-h-[44px] px-4 py-2 rounded-full text-xs font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Acessar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium px-2 py-1">
                      Trancado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé limpo com opção de reiniciar para testes */}
        <footer className="mt-8 pt-4 text-center">
          <button
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#dc2626] transition-colors py-1.5 px-3 rounded-lg"
            title="Reiniciar progresso para testar do início"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar jornada</span>
          </button>
        </footer>
      </main>

      {/* Faixa decorativa inferior vermelha e branca */}
      <div className="w-full">
        <div className="ribbon-top-subtle" />
        <div className="ribbon-bottom" />
      </div>
    </div>
  );
};
