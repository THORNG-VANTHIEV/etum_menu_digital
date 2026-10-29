import React, { useEffect, useState } from 'react';
import ImageWithFallback from '../common/ImageWithFallback';
import { useLanguage } from '../../features/language/LanguageContext';

export interface HeroSlide {
  id: string;
  src: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  children: React.ReactNode;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero banner with a cross-fading photo background behind static content.
 * Navigation is by dots only (no arrows); auto-play pauses on hover/focus,
 * can be paused by the user, and is off for reduced-motion users.
 */
export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, intervalMs = 5000, children }) => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [isInteracting, setIsInteracting] = useState(false);

  const canAutoPlay = slides.length > 1 && !isPaused && !isInteracting;

  useEffect(() => {
    if (!canAutoPlay) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [canAutoPlay, intervalMs, slides.length]);

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-stone-950 text-white shadow-lg min-h-[22rem] sm:min-h-[26rem] flex items-center"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsInteracting(false);
      }}
    >
      {/* Decorative photo slides */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => (
          <ImageWithFallback
            key={slide.id}
            src={slide.src}
            alt=""
            fadeIn={false}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Gradient overlays keep the text readable over any photo */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-amber-950/80 to-amber-900/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full p-8 sm:p-12 pb-16 sm:pb-16">{children}</div>

      {slides.length > 1 && (
        <div
          className="absolute z-10 bottom-4 left-8 sm:left-12 flex items-center gap-3"
          role="group"
          aria-label={t('heroSlideshow')}
        >
          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t('showSlide')} ${index + 1} / ${slides.length}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className="p-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-6 bg-amber-300' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? t('playSlideshow') : t('pauseSlideshow')}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {isPaused ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
