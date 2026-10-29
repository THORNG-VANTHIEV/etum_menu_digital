import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import ItemDetailsPage from '../src/pages/ItemDetailsPage';
import { DataService } from '../src/services/dataService';

describe('T08 — Details Pages and Variants', () => {
  it('renders standard-price item details for valid slug', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/leas-aob']}>
          <Routes>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: 'លៀសអប់' })).toBeInTheDocument();
    expect(screen.getByText('Steamed Clams with Spices')).toBeInTheDocument();
    expect(screen.getByTestId('total-price')).toHaveTextContent('$1.75');
    expect(screen.getByText(/មានក្នុងហាងស្រាប់/i)).toBeInTheDocument();
  });

  it('renders Not Found for non-existent item slug', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/non-existent-dish-xyz']}>
          <Routes>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText(/រកមិនឃើញទំព័រនេះទេ/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ត្រឡប់ទៅកាន់បញ្ជីមុខម្ហូប/i })).toBeInTheDocument();
  });

  it('renders variant options and updates price when another variant is selected', () => {
    // Steamed beef meatballs (item-prohet-sach-ko-aob) has Regular ($1.25) and Large ($2.50)
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/prohet-sach-ko-aob']}>
          <Routes>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: 'ប្រហិតសាច់គោអប់' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ចានតូច/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ចានធំ/i })).toBeInTheDocument();
    // Size label comes from the translations, without mixed-in English
    expect(screen.getByText('ជ្រើសរើសទំហំ:')).toBeInTheDocument();

    // Default regular is selected -> $1.25
    expect(screen.getByTestId('total-price')).toHaveTextContent('$1.25');

    // Click Large variant
    const largeBtn = screen.getByRole('radio', { name: /ចានធំ/i });
    fireEvent.click(largeBtn);

    // Price should now be $2.50
    expect(screen.getByTestId('total-price')).toHaveTextContent('$2.50');
  });

  it('disables all variants when parent item is unavailable', () => {
    const mockUnavailableItem = {
      id: 'test-unavail-parent',
      slug: 'test-unavail-parent',
      name: { km: 'មុខម្ហូបពិសេសអប់', en: 'Special Steamed Dish' },
      categoryId: 'cat-steamed-spices',
      images: [],
      available: false,
      variants: [
        { id: 'v1', name: { km: 'ចានតូច', en: 'Small' }, available: true, priceUsd: 1.25 },
        { id: 'v2', name: { km: 'ចានធំ', en: 'Large' }, available: true, priceUsd: 2.50 },
      ],
    };

    vi.spyOn(DataService, 'getMenuItemBySlug').mockReturnValueOnce(mockUnavailableItem);

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/test-unavail-parent']}>
          <Routes>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: 'មុខម្ហូបពិសេសអប់' })).toBeInTheDocument();
    expect(screen.getAllByText(/អស់ពីស្តុក/i).length).toBeGreaterThan(0);

    // All variant buttons must be disabled
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(2);
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  it('prevents selecting an unavailable variant when parent is available', () => {
    const mockMixedItem = {
      id: 'test-mixed-avail',
      slug: 'test-mixed-avail',
      name: { km: 'ម្ហូបតេស្ត', en: 'Test Dish' },
      categoryId: 'cat-steamed-spices',
      images: [],
      available: true,
      variants: [
        { id: 'v1', name: { km: 'ចានតូច', en: 'Small' }, available: true, priceUsd: 1.25 },
        { id: 'v2', name: { km: 'ចានធំ', en: 'Large' }, available: false, priceUsd: 2.50 },
      ],
    };

    vi.spyOn(DataService, 'getMenuItemBySlug').mockReturnValueOnce(mockMixedItem);

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/test-mixed-avail']}>
          <Routes>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    const smallRadio = screen.getByRole('radio', { name: /ចានតូច/i });
    const largeRadio = screen.getByRole('radio', { name: /ចានធំ/i });

    expect(smallRadio).not.toBeDisabled();
    expect(largeRadio).toBeDisabled();

    // Try clicking largeRadio - should not change selection
    fireEvent.click(largeRadio);
    expect(screen.getByTestId('total-price')).toHaveTextContent('$1.25');
  });
});
