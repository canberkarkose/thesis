// App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

// Mock dependencies
jest.mock('./contexts/AuthContext.tsx', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('./routing/AppRoutes.tsx', () => ({
  AppRoutes: () => <div data-testid='app-routes'>App Routes</div>,
}));

jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid='toast-container' />,
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('App Component', () => {
  it('renders without crashing and displays AppRoutes and ToastContainer', () => {
    render(<App />);

    // Check that AppRoutes is rendered
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
    expect(screen.getByTestId('app-routes')).toHaveTextContent('App Routes');

    // Check that ToastContainer is rendered
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
});
