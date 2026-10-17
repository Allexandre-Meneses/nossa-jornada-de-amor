/**
 * ==============================================================================
 * RomanticAudioManager
 * ==============================================================================
 * Sistema profissional de áudio para a jornada romântica:
 * - Música de fundo com "Era Óbvio" (/audio/era-obvio.mp3)
 * - Toca no momento em que o site carrega (com autoplay e desbloqueio no primeiro toque)
 * - Toca a música inteira (completa) de forma contínua sem reiniciar entre telas
 * - Troca suave com fade out da música anterior e fade in da nova música
 * - Prevenção absoluta de sobreposição e instâncias duplicadas
 * - Tratamento gracioso de arquivos ausentes (sem erros na tela ou console)
 * - Volume inicial confortável (0.5)
 * - Mute persistente durante toda a navegação entre telas
 * ==============================================================================
 */

export interface TrackState {
  src: string;
  label: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  usingSynthFallback: boolean;
}

type TrackChangeListener = (state: TrackState) => void;

class RomanticAudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSrc: string = '';
  private currentLabel: string = '';
  private isMuted: boolean = false;
  private masterVolume: number = 0.5; // Volume inicial confortável
  private isUserInteracted: boolean = false;
  private listeners: Set<TrackChangeListener> = new Set();
  private usingSynthFallback: boolean = false;

  // Controle de transições concorrentes (fade out / fade in)
  private transitionId: number = 0;
  private fadeInterval: number | null = null;

  // Web Audio sintetizador para quando o arquivo .mp3 ainda não existe na pasta
  private audioCtx: AudioContext | null = null;
  private synthInterval: number | null = null;

  /**
   * Registra a primeira interação do usuário para liberar
   * as políticas de áudio do navegador.
   */
  public registerUserInteraction() {
    this.isUserInteracted = true;

    if (!this.audioCtx) {
      try {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      } catch {
        // Ignora silenciosamente se áudio não for suportado
      }
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * Troca suave de faixa com Fade Out na anterior e Fade In na nova
   */
  public playTrack(src: string, label: string = 'Era Óbvio') {
    this.registerUserInteraction();

    // Se já estiver tocando exatamente esta faixa, NÃO reinicia: a música continua tocando inteira!
    if (this.currentSrc === src && this.currentAudio && !this.currentAudio.paused) {
      this.notifyListeners();
      return;
    }

    // Se for o mesmo arquivo e estiver pausado (mas não mudo), retoma de onde parou
    if (this.currentSrc === src && this.currentAudio && !this.isMuted) {
      this.currentAudio.play().then(() => {
        if (this.currentAudio) this.currentAudio.volume = this.masterVolume;
      }).catch(() => {});
      this.notifyListeners();
      return;
    }

    this.currentSrc = src;
    this.currentLabel = label;
    const thisTransitionId = ++this.transitionId;

    // Limpa fade anterior pendente
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // Para sintetizador de fallback se estiver rodando
    this.stopSynth();

    const oldAudio = this.currentAudio;

    // 1. FADE OUT da faixa anterior (se houver e estiver tocando)
    if (oldAudio && !oldAudio.paused && oldAudio.volume > 0.05) {
      const fadeOutStep = oldAudio.volume / 8;
      const fadeOutTimer = setInterval(() => {
        try {
          if (oldAudio.volume > fadeOutStep) {
            oldAudio.volume = Math.max(0, oldAudio.volume - fadeOutStep);
          } else {
            clearInterval(fadeOutTimer);
            oldAudio.pause();
            oldAudio.currentTime = 0;
            oldAudio.src = '';
          }
        } catch {
          clearInterval(fadeOutTimer);
          oldAudio.pause();
        }
      }, 400);
    } else if (oldAudio) {
      try {
        oldAudio.pause();
        oldAudio.currentTime = 0;
        oldAudio.src = '';
      } catch {
        // no-op
      }
    }

    // Se o usuário estiver silenciado, memoriza a faixa atual sem tocar som audível
    if (this.isMuted) {
      this.currentAudio = null;
      this.usingSynthFallback = false;
      this.notifyListeners();
      return;
    }

    // 2. Prepara a nova faixa
    const newAudio = new Audio(src);
    newAudio.loop = true; // A música toca inteira e recomeça em loop contínuo
    newAudio.volume = 0; // Começa em 0 para fazer Fade In suave
    this.currentAudio = newAudio;

    // Tratamento de erro quando o arquivo .mp3 não existe na pasta
    newAudio.addEventListener('error', () => {
      if (this.transitionId === thisTransitionId) {
        this.currentAudio = null;
        this.startSynthFallback();
      }
    });

    const playPromise = newAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Se uma transição mais nova começou enquanto essa carregava, interrompe
          if (this.transitionId !== thisTransitionId) {
            newAudio.pause();
            return;
          }

          this.usingSynthFallback = false;
          this.fadeInAudio(newAudio, thisTransitionId);
        })
        .catch((err: unknown) => {
          // Se o navegador bloqueou o autoplay sem interação prévia:
          const isNotAllowed =
            err &&
            typeof err === 'object' &&
            'name' in err &&
            (err as { name: string }).name === 'NotAllowedError';

          if (isNotAllowed) {
            // Desbloqueia na PRIMEIRA interação em qualquer lugar da tela
            const unlockAutoplay = () => {
              if (this.currentAudio && !this.isMuted) {
                this.currentAudio.play().then(() => {
                  if (this.currentAudio) {
                    this.fadeInAudio(this.currentAudio, thisTransitionId);
                  }
                }).catch(() => {});
              }
              window.removeEventListener('pointerdown', unlockAutoplay);
              window.removeEventListener('touchstart', unlockAutoplay);
              window.removeEventListener('click', unlockAutoplay);
              window.removeEventListener('keydown', unlockAutoplay);
              window.removeEventListener('scroll', unlockAutoplay);
            };

            window.addEventListener('pointerdown', unlockAutoplay, { once: true, passive: true });
            window.addEventListener('touchstart', unlockAutoplay, { once: true, passive: true });
            window.addEventListener('click', unlockAutoplay, { once: true, passive: true });
            window.addEventListener('keydown', unlockAutoplay, { once: true, passive: true });
            window.addEventListener('scroll', unlockAutoplay, { once: true, passive: true });
          } else if (this.transitionId === thisTransitionId) {
            this.startSynthFallback();
          }
        });
    }
  }

  private fadeInAudio(audio: HTMLAudioElement, transitionId: number) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const targetVol = this.masterVolume;
    const steps = 12;
    const volIncrement = targetVol / steps;
    let currentStep = 0;

    this.fadeInterval = window.setInterval(() => {
      if (this.transitionId !== transitionId || !this.currentAudio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }

      currentStep++;
      const nextVol = Math.min(targetVol, volIncrement * currentStep);
      try {
        audio.volume = nextVol;
      } catch {
        // no-op
      }

      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, 35);

    this.notifyListeners();
  }

  /**
   * Melodia sintetizada acústica para quando o arquivo .mp3 ainda não existe.
   * Não lança erros e dá feedback auditivo delicado.
   */
  private startSynthFallback() {
    this.usingSynthFallback = true;
    this.notifyListeners();

    if (this.isMuted) return;

    if (!this.audioCtx) {
      try {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
      } catch {
        return;
      }
    }

    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    // Notas de caixinha de música romântica suave (C4, E4, G4, A4, B4, C5)
    const notes = [261.63, 329.63, 392.0, 440.0, 493.88, 523.25];
    let noteIndex = 0;

    this.stopSynth();

    const playTone = () => {
      if (!this.audioCtx || this.isMuted || !this.usingSynthFallback) return;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1) % notes.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const currentVol = this.masterVolume * 0.1; // bem suave
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(currentVol, this.audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.2);
      } catch {
        // no-op
      }
    };

    playTone();
    this.synthInterval = window.setInterval(playTone, 1600);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  /**
   * Ajusta o volume com transição imediata
   */
  public setVolume(newVolume: number) {
    this.masterVolume = Math.max(0, Math.min(1, newVolume));
    if (this.currentAudio && !this.isMuted) {
      this.currentAudio.volume = this.masterVolume;
    }
    this.notifyListeners();
  }

  /**
   * Alterna entre Mudo e Ativado
   * Mantém o estado consistente em todas as telas
   */
  public toggleMute() {
    this.registerUserInteraction();
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      // Silencia e pausa
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      if (this.currentAudio) {
        this.currentAudio.volume = 0;
        this.currentAudio.pause();
      }
      this.stopSynth();
    } else {
      // Reativa áudio suavemente
      if (this.currentAudio && !this.usingSynthFallback) {
        this.currentAudio.play().then(() => {
          if (this.currentAudio) {
            this.currentAudio.volume = this.masterVolume;
          }
        }).catch(() => {
          this.startSynthFallback();
        });
      } else if (this.usingSynthFallback) {
        this.startSynthFallback();
      } else if (this.currentSrc) {
        this.playTrack(this.currentSrc, this.currentLabel);
      }
    }

    this.notifyListeners();
  }

  public subscribe(listener: TrackChangeListener) {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach((listener) => listener(status));
  }

  public getStatus(): TrackState {
    const isPlaying =
      !this.isMuted &&
      ((this.currentAudio !== null && !this.currentAudio.paused) || this.usingSynthFallback);

    return {
      src: this.currentSrc,
      label: this.currentLabel,
      isPlaying,
      isMuted: this.isMuted,
      volume: this.masterVolume,
      usingSynthFallback: this.usingSynthFallback,
    };
  }
}

export const audioManager = new RomanticAudioManager();
