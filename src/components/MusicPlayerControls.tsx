import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audioManager';
import { Volume2, VolumeX, Music, ChevronDown, ChevronUp } from 'lucide-react';

export const MusicPlayerControls: React.FC = () => {
  const [audioState, setAudioState] = useState(audioManager.getStatus());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  return (
    <aside aria-label="Controle de Áudio" className="fixed top-3 right-3 z-40">
      <div className="flex flex-col items-end">
        {/* Botão compacto minimalista */}
        <div className="flex items-center p-0.5 bg-white border border-red-200 rounded-full shadow-romantic-sm">
          <button
            onClick={() => audioManager.toggleMute()}
            className={`min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
              audioState.isMuted
                ? 'bg-gray-100 text-gray-400 hover:text-gray-600'
                : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
            }`}
            title={audioState.isMuted ? 'Ativar música' : 'Silenciar música'}
            aria-label={audioState.isMuted ? 'Ativar música' : 'Silenciar música'}
          >
            {audioState.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Music className="w-4 h-4 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[44px] px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-0.5 cursor-pointer"
            title="Ajustar volume e música"
            aria-label="Ajustar volume e música"
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Menu suspenso de volume e opções de áudio */}
        {isExpanded && (
          <div className="mt-2 w-64 p-3.5 rounded-xl bg-white border border-red-100 shadow-romantic-md text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1f2937]">
                Volume
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {Math.round(audioState.volume * 100)}%
              </span>
            </div>

            {/* Slider de Volume */}
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioState.volume}
                onChange={(e) => audioManager.setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#dc2626] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                aria-label="Controle de volume"
              />
            </div>

            {/* Status da Faixa */}
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600">
              <p className="font-semibold text-[#dc2626] truncate">
                🎵 {audioState.label || 'Era Óbvio'}
              </p>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
};
