import React, { useState, useEffect, useRef } from 'react';
import { PhotoItem } from '../types/romantic';
import { Camera, ImagePlus } from 'lucide-react';
import { getPhotoBlob, savePhotoBlob } from '../utils/audioStorage';

interface PhotoFrameProps {
  photo: PhotoItem;
  className?: string;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  photo,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [customSrc, setCustomSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Verifica se o usuário salvou uma foto personalizada no IndexedDB
    getPhotoBlob(`photo_${photo.id}`).then((blob) => {
      if (blob) {
        setCustomSrc(URL.createObjectURL(blob));
      }
    });
  }, [photo.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await savePhotoBlob(`photo_${photo.id}`, file);
      if (customSrc) URL.revokeObjectURL(customSrc);
      const newUrl = URL.createObjectURL(file);
      setCustomSrc(newUrl);
      setHasError(false);
      setIsLoaded(true);
    }
  };

  const getAspectClass = (ratio?: string) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '16:9':
        return 'aspect-video';
      case '4:3':
      default:
        return 'aspect-[4/3]';
    }
  };

  const activeSrc = customSrc || photo.src;

  return (
    <figure className={`w-full my-4 ${className}`}>
      {/* Input de arquivo invisível para troca rápida de foto */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={`group relative w-full overflow-hidden rounded-2xl border border-red-100 bg-[#fffafa] shadow-romantic-md flex items-center justify-center ${getAspectClass(
          photo.aspectRatio
        )}`}
      >
        {!hasError ? (
          <>
            <img
              src={activeSrc}
              alt={photo.alt}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-[1.02] ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />

            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#fffafa]">
                <Camera className="w-6 h-6 text-red-300 animate-pulse" />
              </div>
            )}

            {/* Botão sutil para alterar foto ao passar o cursor ou tocar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-[#dc2626] shadow-sm border border-red-100 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Trocar esta fotografia"
              aria-label="Trocar fotografia"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Placeholder interativo caso a imagem ainda não exista */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-white border border-dashed border-red-200 rounded-2xl cursor-pointer hover:bg-red-50/30 transition-colors"
          >
            <Camera className="w-8 h-8 text-[#dc2626] mb-2 opacity-80" />
            <p className="font-romantic text-sm font-medium text-[#1f2937] mb-1">
              Toque para carregar a foto
            </p>
            <p className="text-[11px] text-gray-500 font-mono">
              {photo.src}
            </p>
          </div>
        )}
      </div>

      {photo.caption && (
        <figcaption className="mt-2.5 text-center">
          <p className="font-romantic text-sm text-gray-700 font-medium">
            {photo.caption}
          </p>
        </figcaption>
      )}
    </figure>
  );
};
