import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

describe('App smoke test', () => {
  it('renders initial setup message', () => {
    render(<App />);
    expect(screen.getByText('Restaurant Menu App')).toBeInTheDocument();
  });
});

