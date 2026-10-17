import React, { useState, useEffect } from 'react';
import { romanticContent } from './data/romanticContent';
import { audioManager } from './utils/audioManager';
import { WelcomeScreen } from './components/WelcomeScreen';
import { JourneyMenu } from './components/JourneyMenu';
import { LevelView } from './components/LevelView';
import { CupidAnimation } from './components/CupidAnimation';
import { MusicPlayerControls } from './components/MusicPlayerControls';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { saveFinalChoice } from './utils/choiceResponse';

type AppView = 'welcome' | 'menu' | 'level';

const STORAGE_KEY = 'romantic_journey_state_v1';
const FINAL_CHOICE_KEY = 'romantic_journey_final_choice_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [pendingCupidUnlock, setPendingCupidUnlock] = useState<number | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);

  // Carrega progresso salvo do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0) {
          setUnlockedLevels(parsed.unlockedLevels);
        }
        if (Array.isArray(parsed.completedLevels)) {
          setCompletedLevels(parsed.completedLevels);
        }
      }
      setFinalChoice(localStorage.getItem(FINAL_CHOICE_KEY));
    } catch {
      // Ignora erro de storage local
    }
  }, []);

  // Inicia a música de fundo automaticamente no momento em que o site carregar
  useEffect(() => {
    audioManager.playTrack(romanticContent.welcome.audioSrc, 'Era Óbvio');
  }, []);

  // Salva progresso no localStorage
  const saveProgress = (unlocked: number[], completed: number[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ unlockedLevels: unlocked, completedLevels: completed })
      );
    } catch {
      // no-op
    }
  };

  // Transição da Tela de Boas-Vindas para o Menu
  const handleEnterJourney = () => {
    setCurrentView('menu');
    audioManager.playTrack(romanticContent.journey.audioSrc, 'Era Óbvio');
  };

  // Abrir uma página de nível
  const handleSelectLevel = (levelId: number) => {
    if (!unlockedLevels.includes(levelId)) return;
    setActiveLevelId(levelId);
    setCurrentView('level');

    const targetLevel = romanticContent.levels.find((l) => l.id === levelId);
    if (targetLevel) {
      audioManager.playTrack(
        targetLevel.audioSrc,
        targetLevel.audioTitle || 'Era Óbvio'
      );
    }
  };

  // Voltar da página do nível para o Menu
  const handleBackToMenu = () => {
    setCurrentView('menu');
    audioManager.playTrack(romanticContent.journey.audioSrc, 'Era Óbvio');
  };

  const handleFinalResponseSelected = async (choice: string) => {
    if (finalChoice) return;

    await saveFinalChoice(choice);
    setFinalChoice(choice);
    try {
      localStorage.setItem(FINAL_CHOICE_KEY, choice);
    } catch {
      // A resposta já foi salva no servidor; o armazenamento local é apenas preventivo.
    }
  };

  // Concluir nível atual
  const handleCompleteLevel = () => {
    const isAlreadyCompleted = completedLevels.includes(activeLevelId);
    const newCompleted = isAlreadyCompleted
      ? completedLevels
      : [...completedLevels, activeLevelId];

    setCompletedLevels(newCompleted);

    // Próximo nível a ser desbloqueado
    const nextLevelId = activeLevelId + 1;
    const hasNextLevel = romanticContent.levels.some((l) => l.id === nextLevelId);
    const nextAlreadyUnlocked = unlockedLevels.includes(nextLevelId);

    // Retorna ao menu
    setCurrentView('menu');
    audioManager.playTrack(romanticContent.journey.audioSrc, 'Era Óbvio');

    if (hasNextLevel && !nextAlreadyUnlocked) {
      // Dispara a animação do Cupido atirando a flecha
      setPendingCupidUnlock(nextLevelId);
    } else {
      saveProgress(unlockedLevels, newCompleted);
    }
  };

  // Cupido terminou o disparo e o impacto no cadeado
  const handleCupidFinished = () => {
    if (pendingCupidUnlock !== null) {
      const targetId = pendingCupidUnlock;
      const newUnlocked = Array.from(new Set([...unlockedLevels, targetId]));
      setUnlockedLevels(newUnlocked);
      saveProgress(newUnlocked, completedLevels);
      setPendingCupidUnlock(null);
    }
  };

  // Reiniciar a jornada para testes
  const handleResetConfirm = () => {
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FINAL_CHOICE_KEY);
    } catch {
      // no-op
    }
    setShowResetModal(false);
    setFinalChoice(null);
    setCurrentView('welcome');
    audioManager.playTrack(romanticContent.welcome.audioSrc, 'Era Óbvio');
  };

  const currentLevelData =
    romanticContent.levels.find((l) => l.id === activeLevelId) || romanticContent.levels[0];

  const pendingLevelData = pendingCupidUnlock
    ? romanticContent.levels.find((l) => l.id === pendingCupidUnlock)
    : null;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white text-[#1f2937] selection:bg-[#dc2626] selection:text-white flex flex-col justify-between">
      {/* Controles de Música Flutuantes (discretos) */}
      <MusicPlayerControls />

      {/* Roteamento de Telas */}
      {currentView === 'welcome' && (
        <WelcomeScreen onEnter={handleEnterJourney} />
      )}

      {currentView === 'menu' && (
        <JourneyMenu
          levels={romanticContent.levels}
          unlockedLevels={unlockedLevels}
          completedLevels={completedLevels}
          onSelectLevel={handleSelectLevel}
          onResetProgress={() => setShowResetModal(true)}
        />
      )}

      {currentView === 'level' && (
        <LevelView
          level={currentLevelData}
          isCompleted={completedLevels.includes(activeLevelId)}
          onBackToMenu={handleBackToMenu}
          onCompleteLevel={handleCompleteLevel}
          onResponseSelected={handleFinalResponseSelected}
          initialResponse={currentLevelData.isGrandFinale ? finalChoice : null}
        />
      )}

      {/* Animação do Cupido atirando a flecha ao desbloquear novo nível */}
      {pendingCupidUnlock !== null && pendingLevelData && (
        <CupidAnimation
          targetLevel={pendingCupidUnlock}
          levelTitle={pendingLevelData.title}
          onFinished={handleCupidFinished}
        />
      )}

      {/* Modal de Reiniciar Progresso */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}
