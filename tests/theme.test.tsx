import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import Header from '../src/components/layout/Header';
import { THEME_STORAGE_KEY } from '../src/features/theme/useTheme';

const renderHeader = () =>
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </LanguageProvider>
  );

describe('Theme toggle', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('starts in light mode by default', () => {
    renderHeader();
    expect(document.documentElement).not.toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'ប្តូរទៅរបៀបងងឹត' })).toBeInTheDocument();
  });

  it('switches to dark mode, remembers it, and switches back', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'ប្តូរទៅរបៀបងងឹត' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: 'ប្តូរទៅរបៀបភ្លឺ' }));
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('keeps dark mode when the page loads with it already applied', () => {
    document.documentElement.classList.add('dark');
    renderHeader();
    expect(screen.getByRole('button', { name: 'ប្តូរទៅរបៀបភ្លឺ' })).toBeInTheDocument();
  });
});
