import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '../src/features/language/LanguageContext';
import AppLayout from '../src/components/layout/AppLayout';
import MenuPage from '../src/pages/MenuPage';
import ItemDetailsPage from '../src/pages/ItemDetailsPage';

const TestLanguageConsumer = () => {
  const { locale, setLocale, t, getLocalizedText } = useLanguage();
  return (
    <div>
      <div data-testid="current-locale">{locale}</div>
      <button onClick={() => setLocale('en')}>Set EN</button>
      <button onClick={() => setLocale('km')}>Set KM</button>
      <div data-testid="translated-menu">{t('menu')}</div>
      <div data-testid="fallback-text">
        {getLocalizedText({ km: 'ឈ្មោះខ្មែរ' })}
      </div>
    </div>
  );
};

describe('T09 — Bilingual UX & Localization', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to Khmer locale (km)', () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('km');
    expect(screen.getByTestId('translated-menu')).toHaveTextContent('បញ្ជីមុខម្ហូប');
  });

  it('switches to English and updates UI strings', () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Set EN' }));
    expect(screen.getByTestId('current-locale')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-menu')).toHaveTextContent('Menu');
  });

  it('falls back to Khmer when English translation is missing for menu item', () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    // Switch to English
    fireEvent.click(screen.getByRole('button', { name: 'Set EN' }));

    // Item with only Khmer text should return Khmer
    expect(screen.getByTestId('fallback-text')).toHaveTextContent('ឈ្មោះខ្មែរ');
  });

  it('switches language in App and updates Header links and page content', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="menu" element={<MenuPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    // Initially in Khmer
    expect(screen.getByRole('link', { name: 'បញ្ជីមុខម្ហូប' })).toBeInTheDocument();

    // Click EN in language switcher
    const enBtn = screen.getByRole('button', { name: 'EN' });
    fireEvent.click(enBtn);

    // Header link should update to English
    expect(screen.getByRole('link', { name: 'Menu' })).toBeInTheDocument();
    // Search placeholder should update to English
    expect(screen.getByPlaceholderText(/Search items\.\.\./i)).toBeInTheDocument();
  });

  it('renders item details with active locale and fallback', () => {
    // Cheesecake is missing English name in sample data, so should display Khmer name even in EN
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/cheesecake']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="menu/:slug" element={<ItemDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    // Switch to EN
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    // Heading should show Khmer name fallback since EN name is absent
    expect(screen.getByRole('heading', { name: 'នំខេកឈីសស្ត្រប៊ឺរី' })).toBeInTheDocument();
  });
});
