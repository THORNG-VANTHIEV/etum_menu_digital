import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

// Menu data stores public assets as root paths ("/images/..."). Resolve them
// against Vite's base so they also work when deployed under a subpath.
const resolveAssetUrl = (src: string): string =>
  src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = './images/menu/espresso.svg',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError || !src ? fallbackSrc : resolveAssetUrl(src)}
      alt={alt || ''}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;

