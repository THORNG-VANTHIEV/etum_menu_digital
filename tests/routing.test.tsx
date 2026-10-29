import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../src/features/language/LanguageContext';
import AppLayout from '../src/components/layout/AppLayout';
import HomePage from '../src/pages/HomePage';
import MenuPage from '../src/pages/MenuPage';
import ItemDetailsPage from '../src/pages/ItemDetailsPage';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('T03 — App Shell and Routing', () => {
  it('renders Home page at root route', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByText(/លៀសអប់ ខ្យង ងាវ រសជាតិខ្មែរពិតៗ/i)).toBeInTheDocument();
    // Featured items show the dual USD · KHR price, like the menu cards
    expect(screen.getAllByText(/\$\d+\.\d{2} · ៛[\d,]+/).length).toBeGreaterThan(0);
  });

  it('renders Menu page at /menu route', () => {
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
    expect(screen.getByRole('heading', { name: /បញ្ជីមុខម្ហូប/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders Item Details page for valid slug', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/leas-aob']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="menu/:slug" element={<ItemDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByRole('heading', { name: 'លៀសអប់' })).toBeInTheDocument();
    expect(screen.getByText('$1.75')).toBeInTheDocument();
  });

  it('renders Not Found page for invalid slug under /menu/:slug', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/menu/non-existent-dish']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="menu/:slug" element={<ItemDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByText(/រកមិនឃើញទំព័រនេះទេ/i)).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown root route', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/some/unknown/route']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/រកមិនឃើញទំព័រនេះទេ/i)).toBeInTheDocument();
  });

  it('scrolls to the top when opening a new page', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo');
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );
    scrollTo.mockClear();
    fireEvent.click(screen.getAllByRole('link', { name: /បញ្ជីមុខម្ហូប/i })[0]);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });
});
