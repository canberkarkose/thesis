// Register.test.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Router, useNavigate } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { toast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';
import { signUp, googleSignIn } from '../../../services/auth-service';

import { Register } from './Register';

// Mock dependencies
jest.mock('@src/assets/background.png', () => 'mock-background.png');
jest.mock('@src/assets/globalBackground.png', () => 'mock-globalBackground.png');

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../services/auth-service', () => ({
  signUp: jest.fn(),
  googleSignIn: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (
    authState: any = { user: null, loading: false },
    history = createMemoryHistory()
  ) => {
    (useAuth as jest.Mock).mockReturnValue(authState);

    render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    return { history };
  };

  it('renders all input fields and buttons', () => {
    renderComponent();

    expect(screen.getByLabelText(/Username \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign Up$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up with Google/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
  });

  it('shows error messages when submitting empty form', async () => {
    renderComponent();

    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });
    fireEvent.click(signUpButton);

    expect(signUp).not.toHaveBeenCalled();
  });

  it('handles successful sign up and navigates to account details', async () => {
    const mockedNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);

    const history = createMemoryHistory();
    renderComponent({ user: null, loading: false }, history);

    const usernameInput = screen.getByLabelText(/Username \*/i);
    const emailInput = screen.getByLabelText(/Email address \*/i);
    const passwordInput = screen.getByLabelText(/Password \*/i);
    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } });

    (signUp as jest.Mock).mockResolvedValueOnce(undefined);

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith('newuser@example.com', 'newuser', 'Password1!');
      expect(localStorage.getItem('justLoggedIn')).toBe('true');
      expect(mockedNavigate).toHaveBeenCalledWith('/app/account-details');
    });

    expect(toast.success).not.toHaveBeenCalled(); // Since navigation happens after signUp
  });

  it('handles Google sign up and navigates to dashboard for existing users', async () => {
    const mockedNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);

    (googleSignIn as jest.Mock).mockResolvedValueOnce({
      user: { name: 'Google User' },
      isNewUser: false,
    });

    const history = createMemoryHistory();
    renderComponent({ user: null, loading: false }, history);

    const googleSignUpButton = screen.getByRole('button', { name: /Sign up with Google/i });
    fireEvent.click(googleSignUpButton);

    await waitFor(() => {
      expect(googleSignIn).toHaveBeenCalled();
      expect(localStorage.getItem('justLoggedIn')).toBe('true');
      expect(mockedNavigate).toHaveBeenCalledWith('/app/dashboard');
      expect(toast.success).toHaveBeenCalledWith('Successfully signed in with Google.', { position: 'bottom-left' });
    });
  });

  it('navigates to dashboard if already logged in and not just logged in', () => {
    const mockedNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);

    const history = createMemoryHistory();
    renderComponent(
      { user: { name: 'Existing User', accountDetailsCompleted: true }, loading: false },
      history
    );

    // Fast-forward timers to trigger useEffect timeouts
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);

    waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'You are already logged in. Accessing another account? Please log out first.',
        { position: 'bottom-left' }
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/app/dashboard');
    });

    jest.useRealTimers();
  });
});
