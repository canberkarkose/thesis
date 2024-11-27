// ErrorPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ErrorPage } from './ErrorPage';

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ErrorPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it('renders with default props and isAuthenticated=true', () => {
    render(
      <MemoryRouter>
        <ErrorPage isAuthenticated />
      </MemoryRouter>
    );

    // Check for default error code
    expect(screen.getByText('404')).toBeInTheDocument();

    // Check for default error message
    expect(screen.getByText('Oops.. Page Not Found')).toBeInTheDocument();

    // Check for button with text 'Go back to Dashboard'
    expect(screen.getByRole('button', { name: /Go back to Dashboard/i })).toBeInTheDocument();
  });

  it('renders with default props and isAuthenticated=false', () => {
    render(
      <MemoryRouter>
        <ErrorPage isAuthenticated={false} />
      </MemoryRouter>
    );

    // Check for default error code
    expect(screen.getByText('404')).toBeInTheDocument();

    // Check for default error message
    expect(screen.getByText('Oops.. Page Not Found')).toBeInTheDocument();

    // Check for button with text 'Go back to Home'
    expect(screen.getByRole('button', { name: /Go back to Home/i })).toBeInTheDocument();
  });

  it('renders with custom errorCode and errorMessage, isAuthenticated=true', () => {
    const customErrorCode = 500;
    const customErrorMessage = 'Internal Server Error';

    render(
      <MemoryRouter>
        <ErrorPage
          errorCode={customErrorCode}
          errorMessage={customErrorMessage}
          isAuthenticated
        />
      </MemoryRouter>
    );

    // Check for custom error code
    expect(screen.getByText(customErrorCode.toString())).toBeInTheDocument();

    // Check for custom error message
    expect(screen.getByText(customErrorMessage)).toBeInTheDocument();

    // Check for button with text 'Go back to Dashboard'
    expect(screen.getByRole('button', { name: /Go back to Dashboard/i })).toBeInTheDocument();
  });

  it('renders with custom errorCode and errorMessage, isAuthenticated=false', () => {
    const customErrorCode = 403;
    const customErrorMessage = 'Forbidden Access';

    render(
      <MemoryRouter>
        <ErrorPage
          errorCode={customErrorCode}
          errorMessage={customErrorMessage}
          isAuthenticated={false}
        />
      </MemoryRouter>
    );

    // Check for custom error code
    expect(screen.getByText(customErrorCode.toString())).toBeInTheDocument();

    // Check for custom error message
    expect(screen.getByText(customErrorMessage)).toBeInTheDocument();

    // Check for button with text 'Go back to Home'
    expect(screen.getByRole('button', { name: /Go back to Home/i })).toBeInTheDocument();
  });

  it('navigates to /app/dashboard when button is clicked and isAuthenticated=true', () => {
    render(
      <MemoryRouter>
        <ErrorPage isAuthenticated />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /Go back to Dashboard/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard');
  });

  it('navigates to / when button is clicked and isAuthenticated=false', () => {
    render(
      <MemoryRouter>
        <ErrorPage isAuthenticated={false} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /Go back to Home/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
