import React, { useState, useEffect } from 'react';
import { formatImageUrl, getSecondaryFallbackUrl, FALLBACK_GENERIC_PLANT } from '../utils/imageUtils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = FALLBACK_GENERIC_PLANT,
  alt,
  className = '',
  onClick,
  ...props
}) => {
  const primaryUrl = formatImageUrl(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(primaryUrl);
  const [hasTriedSecondary, setHasTriedSecondary] = useState<boolean>(false);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  // Sincroniza estado quando a prop src muda
  useEffect(() => {
    const formatted = formatImageUrl(src, fallbackSrc);
    setCurrentSrc(formatted);
    setHasTriedSecondary(false);
    setHasTriedFallback(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasTriedSecondary) {
      const secondary = getSecondaryFallbackUrl(src, fallbackSrc);
      if (secondary && secondary !== currentSrc) {
        setHasTriedSecondary(true);
        setCurrentSrc(secondary);
        return;
      }
    }

    if (!hasTriedFallback && currentSrc !== fallbackSrc) {
      setHasTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      return;
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
