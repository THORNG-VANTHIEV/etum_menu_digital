import React, { useEffect, useRef, useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  /** Fade the image in once it has loaded (default true). */
  fadeIn?: boolean;
}

// Menu data stores public assets as root paths ("/images/..."). Resolve them
// against Vite's base so they also work when deployed under a subpath.
const resolveAssetUrl = (src: string): string =>
  src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = './images/menu/espresso.svg',
  fadeIn = true,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // A cached image can finish loading before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setIsLoaded(true);
  }, []);

  const fadeClass = !fadeIn ? '' : isLoaded ? 'motion-safe:animate-fade-in-slow' : 'motion-safe:opacity-0';

  return (
    <img
      ref={imgRef}
      src={hasError || !src ? fallbackSrc : resolveAssetUrl(src)}
      alt={alt || ''}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setHasError(true);
        setIsLoaded(true);
      }}
      className={`${className} ${fadeClass}`}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;
