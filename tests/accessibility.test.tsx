import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import Header from '../src/components/layout/Header';
import SearchBar from '../src/components/menu/SearchBar';
import CategoryFilter from '../src/components/menu/CategoryFilter';
import VariantSelector from '../src/components/menu/VariantSelector';
import MenuCard from '../src/components/menu/MenuCard';
import type { MenuItem, MenuVariant } from '../src/types/menu';

describe('T10 — Accessibility and Usability Verification', () => {
  it('ensures search bar has accessible label and visible focus styles', () => {
    render(<SearchBar value="" onChange={() => {}} locale="km" />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('id', 'menu-search-input');
    expect(screen.getByLabelText('ស្វែងរកមុខម្ហូប')).toBe(input);
    expect(input.className).toContain('focus:ring-2');
  });

  it('ensures category filter has tablist role and accessible keyboard attributes', () => {
    const categories = [
      { id: 'c1', slug: 'c1', name: { km: 'កាហ្វេ' }, sortOrder: 1, active: true },
      { id: 'c2', slug: 'c2', name: { km: 'តែ' }, sortOrder: 2, active: true },
    ];
    render(
      <CategoryFilter
        categories={categories}
        activeCategoryId="c1"
        onSelectCategory={() => {}}
        locale="km"
      />
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3); // All + 2 categories
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    tabs.forEach((tab) => {
      expect(tab.className).toContain('focus-visible:ring-2');
    });
  });

  it('ensures variant selector communicates availability with text and aria attributes, not color alone', () => {
    const variants: MenuVariant[] = [
      { id: 'v1', name: { km: 'តូច', en: 'Small' }, available: true, priceUsd: 2.0 },
      { id: 'v2', name: { km: 'ធំ', en: 'Large' }, available: false, priceUsd: 3.0 },
    ];

    render(
      <VariantSelector
        variants={variants}
        selectedVariantId="v1"
        onSelectVariant={() => {}}
        parentAvailable={true}
        locale="km"
      />
    );

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();

    const radio1 = screen.getByRole('radio', { name: /តូច/i });
    expect(radio1).toHaveAttribute('aria-checked', 'true');
    expect(radio1).not.toBeDisabled();

    // Unavailable variant must have text explaining unavailability, and be disabled
    const radio2 = screen.getByRole('radio', { name: /ធំ/i });
    expect(radio2).toHaveAttribute('aria-checked', 'false');
    expect(radio2).toBeDisabled();
    expect(radio2).toHaveTextContent(/ទំហំនេះអស់/i);
  });

  it('ensures unavailable menu card has textual status and accessible label', () => {
    const item: MenuItem = {
      id: 'item-unavail',
      slug: 'unavail',
      name: { km: 'ម្ហូបពិសេស' },
      categoryId: 'cat-1',
      images: [],
      available: false,
      priceUsd: 5.0,
    };

    render(
      <LanguageProvider>
        <MemoryRouter>
          <MenuCard item={item} locale="km" />
        </MemoryRouter>
      </LanguageProvider>
    );

    const cardLink = screen.getByRole('link');
    expect(cardLink).toHaveAttribute('aria-label');
    expect(cardLink.getAttribute('aria-label')).toContain('Unavailable');
    expect(screen.getByText(/អស់ពីស្តុក/i)).toBeInTheDocument();
  });

  it('ensures header has accessible landmarks and language toggle group', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Language selection/i })).toBeInTheDocument();
  });
});

