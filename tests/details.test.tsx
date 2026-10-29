import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ItemDetailsPage from '../src/pages/ItemDetailsPage';

describe('T08 — Details Pages and Variants', () => {
  it('renders standard-price item details for valid slug', () => {
    render(
      <MemoryRouter initialEntries={['/menu/espresso']}>
        <Routes>
          <Route path="menu/:slug" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'កាហ្វេអេសប្រេសសូ' })).toBeInTheDocument();
    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('$2.00')).toBeInTheDocument();
    expect(screen.getByText(/មានក្នុងស្តុកស្រាប់/i)).toBeInTheDocument();
  });

  it('renders Not Found for non-existent item slug', () => {
    render(
      <MemoryRouter initialEntries={['/menu/non-existent-dish-xyz']}>
        <Routes>
          <Route path="menu/:slug" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/រកមិនឃើញមុខម្ហូបនេះទេ/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ត្រឡប់ទៅកាន់បញ្ជីមុខម្ហូប/i })).toBeInTheDocument();
  });

  it('renders variant options and updates price when another variant is selected', () => {
    // Iced Latte has Regular ($2.75) and Large ($3.50)
    render(
      <MemoryRouter initialEntries={['/menu/iced-latte']}>
        <Routes>
          <Route path="menu/:slug" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'ឡាតេទឹកកក' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /កែវធម្មតា/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /កែវធំ/i })).toBeInTheDocument();

    // Default regular is selected -> $2.75
    expect(screen.getByTestId('total-price')).toHaveTextContent('$2.75');

    // Click Large variant
    const largeBtn = screen.getByRole('radio', { name: /កែវធំ/i });
    fireEvent.click(largeBtn);

    // Price should now be $3.50
    expect(screen.getByTestId('total-price')).toHaveTextContent('$3.50');
  });

  it('disables all variants when parent item is unavailable', () => {
    // Passion juice (item-passion-juice) is unavailable at parent level
    render(
      <MemoryRouter initialEntries={['/menu/passion-juice']}>
        <Routes>
          <Route path="menu/:slug" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'ទឹកក្រូចឆ្មារផាសិន' })).toBeInTheDocument();
    expect(screen.getAllByText(/អស់ពីស្តុក/i).length).toBeGreaterThan(0);

    // All variant buttons must be disabled
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(2);
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  it('prevents selecting an unavailable variant when parent is available', () => {
    // Green Tea: Hot is available ($2.25), Cold is unavailable ($2.75)
    render(
      <MemoryRouter initialEntries={['/menu/green-tea']}>
        <Routes>
          <Route path="menu/:slug" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const hotRadio = screen.getByRole('radio', { name: /ក្តៅ/i });
    const coldRadio = screen.getByRole('radio', { name: /ត្រជាក់/i });

    expect(hotRadio).not.toBeDisabled();
    expect(coldRadio).toBeDisabled();

    // Try clicking coldRadio - should not change selection
    fireEvent.click(coldRadio);
    expect(screen.getByTestId('total-price')).toHaveTextContent('$2.25');
  });
});
