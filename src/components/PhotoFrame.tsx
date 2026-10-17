import React, { useState } from 'react';
import { PhotoItem } from '../types/romantic';
import { Camera } from 'lucide-react';

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

  return (
    <figure className={`w-full my-4 ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-red-100 bg-[#fffafa] shadow-romantic-md flex items-center justify-center ${getAspectClass(
          photo.aspectRatio
        )}`}
      >
        {!hasError ? (
          <>
            <img
              src={photo.src}
              alt={photo.alt}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center ${
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

          </>
        ) : (
          /* Placeholder caso a imagem não esteja disponível */
          <div
            className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-white border border-dashed border-red-200 rounded-2xl"
          >
            <Camera className="w-8 h-8 text-[#dc2626] mb-2 opacity-80" />
            <p className="font-romantic text-sm font-medium text-[#1f2937] mb-1">
              Fotografia indisponível
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
