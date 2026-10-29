import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

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
      src={hasError || !src ? fallbackSrc : src}
      alt={alt || ''}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;

