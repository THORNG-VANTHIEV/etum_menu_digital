import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

describe('App smoke test', () => {
  it('renders app shell with branding and navigation', () => {
    render(<App />);
    expect(screen.getAllByText('អ៊ីទុំ លៀសអប់សៀមរាប').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'បញ្ជីមុខម្ហូប' })).toBeInTheDocument();
  });
});
