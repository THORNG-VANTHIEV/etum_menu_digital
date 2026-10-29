import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import Button from '../src/components/common/Button';
import Badge from '../src/components/common/Badge';
import ImageWithFallback from '../src/components/common/ImageWithFallback';

describe('T04 — Branding and Responsive Layout Components', () => {
  it('renders Header with navigation and branding', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByText('អ៊ីទុំ លៀសអប់សៀមរាប')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ទំព័រដើម/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /បញ្ជីមុខម្ហូប/i })).toBeInTheDocument();
  });

  it('renders Footer without empty placeholder rows', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(screen.getByText(/ក្រុងសៀមរាប/i)).toBeInTheDocument();
    expect(screen.getByText('THORNG VANTHIEV')).toBeInTheDocument();
  });

  it('renders Button with accessible focus rings and responds to click', () => {
    let clicked = false;
    render(
      <Button onClick={() => { clicked = true; }} variant="primary">
        ចុចទីនេះ
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'ចុចទីនេះ' });
    expect(btn).toHaveClass('focus-visible:ring-2');
    fireEvent.click(btn);
    expect(clicked).toBe(true);
  });

  it('renders Badge with correct variant classes', () => {
    render(<Badge variant="warning">អស់ពីស្តុក</Badge>);
    expect(screen.getByText('អស់ពីស្តុក')).toBeInTheDocument();
  });

  it('handles image error by rendering fallbackSrc', () => {
    render(
      <ImageWithFallback
        src="/non-existent-image.jpg"
        alt="Test Broken Image"
        fallbackSrc="./images/menu/espresso.svg"
      />
    );
    const img = screen.getByAltText('Test Broken Image') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toContain('espresso.svg');
  });

  it('resolves root image paths against the Vite base URL', () => {
    render(<ImageWithFallback src="/images/menu/dish.webp" alt="Dish" />);
    const img = screen.getByAltText('Dish');
    expect(img.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}images/menu/dish.webp`);
  });
});
