export type LevelStatus = 'locked' | 'unlocked' | 'completed';

export interface PhotoItem {
  id: string;
  src: string;
  caption?: string;
  alt: string;
  aspectRatio?: '1:1' | '4:3' | '3:4' | '16:9';
}

export interface LevelData {
  id: number;
  title: string; // e.g. "Nível 1"
  audioSrc: string;
  audioTitle?: string; // e.g. "Era Óbvio" para o Nível 4
  isGrandFinale?: boolean;
  content: {
    messageParagraphs: string[];
    photos: PhotoItem[];
    responseButtons?: string[];
  };
}

export interface RomanticContentConfig {
  welcome: {
    message: string;
    buttonText: string;
    audioSrc: string;
  };
  journey: {
    title: string;
    audioSrc: string;
  };
  levels: LevelData[];
}
