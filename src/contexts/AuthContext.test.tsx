import { render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { AuthProvider, useAuth, CustomUser } from './AuthContext';

// Mock Firebase auth functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Create a Test Component that uses the useAuth hook
const TestComponent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div data-testid='loading'>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div data-testid='user'>
          User:
          {user.email}
        </div>
      ) : (
        <div data-testid='no-user'>No User</div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  const mockAuth = {};
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (onAuthStateChanged as jest.Mock).mockImplementation(() => mockUnsubscribe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('throws error when useAuth is used outside of AuthProvider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    // Restore console.error
    console.error = consoleError;
  });

  test('sets user and stops loading when a user is authenticated', async () => {
    const mockUser: CustomUser = {
      uid: '123',
      email: 'test@example.com',
      accountDetailsCompleted: true,
      username: 'testuser',
      displayName: 'Test User',
      // ... other properties
    } as CustomUser;

    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return mockUnsubscribe;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be set
    await waitFor(() => expect(screen.getByTestId('user')).toBeInTheDocument());

    expect(screen.getByTestId('user')).toHaveTextContent(`User:${mockUser.email}`);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('sets user to null and stops loading when no user is authenticated', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null);
      return mockUnsubscribe;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for no user
    await waitFor(() => expect(screen.getByTestId('no-user')).toBeInTheDocument());

    expect(screen.getByTestId('no-user')).toHaveTextContent('No User');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('provides the correct context value', async () => {
    const mockUser: CustomUser = {
      uid: '456',
      email: 'another@example.com',
      accountDetailsCompleted: false,
      username: 'anotheruser',
      displayName: 'Another User',
    } as CustomUser;

    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return mockUnsubscribe;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user')).toBeInTheDocument());

    expect(screen.getByTestId('user')).toHaveTextContent(`User:${mockUser.email}`);
  });
});
