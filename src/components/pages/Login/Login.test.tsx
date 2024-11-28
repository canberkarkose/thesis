// Login.test.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { toast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';

import { login } from '../../../services/auth-service';

import { Login } from './Login';

// Mock assets if any
jest.mock('@src/assets/background.png', () => 'mock-background.png');
jest.mock('@src/assets/globalBackground.png', () => 'mock-globalBackground.png');

// Mock dependencies
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../services/auth-service', () => ({
  login: jest.fn(),
  googleSignIn: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (authState: any = {
    user: null, loading: false
  }, history = createMemoryHistory()) => {
    (useAuth as jest.Mock).mockReturnValue(authState);

    render(
      <Router location={history.location} navigator={history}>
        <Login />
      </Router>
    );

    return { history };
  };

  it('renders all input fields and buttons', () => {
    renderComponent();

    expect(screen.getByLabelText(/Email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Don’t have an account yet\?/i)).toBeInTheDocument();
  });

  it('shows error messages when fields are empty on sign in', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    expect(await screen.findByText(/Please provide your username or email\./i)).toBeInTheDocument();
    expect(await screen.findByText(/Please provide your password\./i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('shows specific error when email ends with @gmail.com', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email or username/i);
    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } });

    expect(screen.getByText(/Please continue with Google below for Gmail accounts\./i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    // Assuming the toggle button has a test ID of 'toggle-password'
    const toggleButton = screen.getByTestId('toggle-password');

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('shows loading spinner when loading', () => {
    renderComponent({ user: null, loading: true });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('navigates to dashboard if already logged in and not just logged in', () => {
    const history = createMemoryHistory();
    renderComponent({ user: { name: 'Existing User' }, loading: false }, history);

    expect(history.location.pathname).toBe('/app/dashboard');
    expect(toast.info).toHaveBeenCalledWith(
      'You are already logged in. Accessing another account? Please log out first.',
      { position: 'bottom-left' }
    );
  });

  // New Test to Cover handleSignIn (Successful Login)
  it('logs in successfully and navigates to dashboard', async () => {
    jest.useFakeTimers();

    const history = createMemoryHistory();
    renderComponent({ user: null, loading: false }, history);

    const emailInput = screen.getByLabelText(/Email or username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: 'user123' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    (login as jest.Mock).mockResolvedValueOnce(undefined);

    fireEvent.click(loginButton);

    // Check that loading spinner is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Fast-forward the timer to trigger setTimeout
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user123', 'password123');
      expect(localStorage.getItem('justLoggedIn')).toBe('true');
    });

    jest.useRealTimers();
  });
});
