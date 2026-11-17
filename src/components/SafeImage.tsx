import React, { useState } from 'react';
import { CrownIcon } from './CrownEmblem';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  eager = false,
  fallbackTitle,
}: SafeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#230C0A] via-[#170907] to-[#0D0706] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <CrownIcon className="w-10 h-7 opacity-65 mb-2" />
        <span className="font-display text-xs sm:text-sm font-semibold text-[#E5C158] tracking-wide">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1C0B09]">
      {!loaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#220E0B] via-[#180A08] to-[#120807] animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
