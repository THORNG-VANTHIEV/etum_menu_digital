import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../src/components/layout/AppLayout';
import HomePage from '../src/pages/HomePage';
import MenuPage from '../src/pages/MenuPage';
import ItemDetailsPage from '../src/pages/ItemDetailsPage';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('T03 — App Shell and Routing', () => {
  it('renders Home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/រសជាតិពិតនៃម្ហូប និងភេសជ្ជៈខ្មែរ/i)).toBeInTheDocument();
  });

  it('renders Menu page at /menu route', () => {
    render(
      <MemoryRouter initialEntries={['/menu']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="menu" element={<MenuPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/បញ្ជីមុខម្ហូប និងភេសជ្ជៈ/i)).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders Item Details page for valid slug', () => {
    render(
      <MemoryRouter initialEntries={['/menu/espresso']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    // Should render Espresso details
    expect(screen.getByRole('heading', { name: 'កាហ្វេអេសប្រេសសូ' })).toBeInTheDocument();
    expect(screen.getByText('$2.00')).toBeInTheDocument();
  });

  it('renders Not Found page for invalid slug under /menu/:slug', () => {
    render(
      <MemoryRouter initialEntries={['/menu/non-existent-dish']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/រកមិនឃើញមុខម្ហូបនេះទេ/i)).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown root route', () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/route']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });
});
