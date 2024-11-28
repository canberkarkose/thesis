import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';

import { AccountDetails } from './AccountDetails';

import { logout } from '@src/services/auth-service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../firebase-config', () => ({
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@src/services/auth-service', () => ({
  logout: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AccountDetails Component', () => {
  const mockUser = { uid: '12345', username: 'testuser', accountDetailsCompleted: false };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    jest.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  it('renders the loading spinner when loading or submitting', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('navigates to the next step on "Next" click', () => {
    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Select Your Intolerances/i)).toBeInTheDocument();
  });

  it('navigates to the previous step on "Back" click', () => {
    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Next/i)); // Go to step 2
    fireEvent.click(screen.getByText(/Back/i)); // Return to step 1

    expect(screen.getByText(/Select Your Nutrition Path/i)).toBeInTheDocument();
  });

  it('logs the user out and navigates to login page', async () => {
    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/account of current user/i)); // Open menu
    fireEvent.click(screen.getByText(/Logout/i)); // Logout

    await waitFor(() => expect(logout).toHaveBeenCalled());
  });

  it('handles errors during submission', async () => {
    (updateDoc as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    await waitFor(() => expect(toast.error).not.toBeNull());
  });

  it('renders step content based on the active step', () => {
    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Select Your Nutrition Path/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Select Your Intolerances/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Select Your Cuisine Preferences:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Final Review of Your Preferences/i)).toBeInTheDocument();
  });

  it('handles submit when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    // Navigate through all steps to reach the final review
    fireEvent.click(screen.getByText(/Next/i)); // Step 1 to Step 2
    fireEvent.click(screen.getByText(/Next/i)); // Step 2 to Step 3
    fireEvent.click(screen.getByText(/Next/i)); // Step 3 to Final Review

    // Click the submit button on the final step
    fireEvent.click(screen.getByText(/Submit/i));

    // Assert that the error toast is displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'User not found. Please log in again.',
        { position: 'bottom-left' }
      );
    });

    jest.advanceTimersByTime(1000);
    // Assert that the user is redirected to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles submit when user is authenticated', async () => {
    // Ensure AuthContext has a user
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    // Mock Firestore's doc and updateDoc functions
    const mockFirestoreDoc = { };
    (doc as jest.Mock).mockReturnValue(mockFirestoreDoc);
    (updateDoc as jest.Mock).mockResolvedValue(undefined); // Simulate successful update

    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    // Navigate through all steps to reach the final review
    fireEvent.click(screen.getByText(/Next/i)); // Step 1 to Step 2
    fireEvent.click(screen.getByText(/Next/i)); // Step 2 to Step 3
    fireEvent.click(screen.getByText(/Next/i)); // Step 3 to Final Review

    // Click the submit button on the final step
    fireEvent.click(screen.getByText(/Submit/i));

    // Assert that updateDoc was called with correct parameters
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(mockFirestoreDoc, {
        accountDetails: {
          diet: 'anything',
          intolerances: [],
          cuisinePreferences: {
            includedCuisines: [
              'African',
              'Asian',
              'American',
              'British',
              'Caribbean',
              'Chinese',
              'Eastern European',
              'European',
              'French',
              'German',
              'Greek',
              'Indian',
              'Italian',
              'Japanese',
              'Jewish',
              'Korean',
              'Latin American',
              'Mediterranean',
              'Mexican',
              'Middle Eastern',
              'Southern',
              'Spanish',
              'Thai',
              'Vietnamese',
            ],
            excludedCuisines: [],
          },
        },
        accountDetailsCompleted: true,
      });
    });
  });

  it('renders the initial dialog and closes it when "Let\'s Begin" is clicked', async () => {
    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    // Check that the Dialog is present
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Account Created/i)).toBeInTheDocument();
    expect(screen.getByText(/Your account has been created!/i)).toBeInTheDocument();
    expect(screen.getByText(/Let's Begin/i)).toBeInTheDocument();

    // Click the "Let's Begin" button to close the Dialog
    fireEvent.click(screen.getByText(/Let's Begin/i));

    // Assert that the Dialog is no longer in the document
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles logout failure by showing error toast and not navigating', async () => {
    // Mock logout to reject with an error
    const mockError = new Error('Logout failed');
    (logout as jest.Mock).mockRejectedValueOnce(mockError);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>
    );

    // Open the user menu and click logout
    fireEvent.click(screen.getByLabelText(/account of current user/i)); // Open menu
    fireEvent.click(screen.getByText(/Logout/i)); // Click logout

    // Wait for toast.error to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Logout failed. Please try again.'
      );
    });

    // Assert that console.error was called with the error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', mockError);

    // Assert that navigate was NOT called
    expect(mockNavigate).not.toHaveBeenCalled();

    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
});
