import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import HeroCarousel from '../src/components/home/HeroCarousel';

const slides = [
  { id: 'a', src: '/images/menu/a.webp' },
  { id: 'b', src: '/images/menu/b.webp' },
  { id: 'c', src: '/images/menu/c.webp' },
];

const renderCarousel = () =>
  render(
    <LanguageProvider>
      <HeroCarousel slides={slides} intervalMs={1000}>
        <h1>Hero title</h1>
      </HeroCarousel>
    </LanguageProvider>
  );

const activeDot = () =>
  screen.getAllByRole('button', { name: /បង្ហាញរូបទី/ }).findIndex((dot) => dot.getAttribute('aria-current') === 'true');

describe('Hero carousel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders hero content with one dot per slide and no arrow controls', () => {
    renderCarousel();
    expect(screen.getByRole('heading', { name: 'Hero title' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /បង្ហាញរូបទី/ })).toHaveLength(3);
    expect(screen.queryByRole('button', { name: /next|previous|បន្ទាប់|មុន/i })).not.toBeInTheDocument();
  });

  it('advances automatically and wraps around', () => {
    vi.useFakeTimers();
    renderCarousel();
    expect(activeDot()).toBe(0);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(activeDot()).toBe(1);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(activeDot()).toBe(0);
  });

  it('jumps to a slide when its dot is clicked', () => {
    renderCarousel();
    fireEvent.click(screen.getByRole('button', { name: 'បង្ហាញរូបទី 3 / 3' }));
    expect(activeDot()).toBe(2);
  });

  it('stops auto-play when paused', () => {
    vi.useFakeTimers();
    renderCarousel();
    fireEvent.click(screen.getByRole('button', { name: 'ផ្អាកការបង្ហាញរូបភាព' }));
    expect(screen.getByRole('button', { name: 'បន្តការបង្ហាញរូបភាព' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(3000); });
    expect(activeDot()).toBe(0);
  });
});
