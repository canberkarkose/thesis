import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { logout } from '../../../services/auth-service';

import { AppHeader } from './AppHeader';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking dependencies
jest.mock('../../../services/auth-service', () => ({
  logout: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('AppHeader component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders the header with logo and account button', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    expect(getByTestId(dataTestIds.components.appHeader.container)).toBeInTheDocument();
    expect(getByTestId(dataTestIds.components.appHeader.logo)).toBeInTheDocument();
    expect(getByTestId(dataTestIds.components.appHeader.accountButton)).toBeInTheDocument();
  });

  it('opens the menu when the account button is clicked', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    const accountButton = getByTestId(dataTestIds.components.appHeader.accountButton);
    fireEvent.click(accountButton);

    expect(getByTestId(dataTestIds.components.appHeader.menu)).toBeVisible();
  });

  it('closes the menu when a menu item is clicked', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId(dataTestIds.components.appHeader.accountButton));
    const profileMenuItem = getByTestId(dataTestIds.components.appHeader.menuItemProfile);
    fireEvent.click(profileMenuItem);

    // eslint-disable-next-line max-len
    await waitFor(() => expect(getByTestId(dataTestIds.components.appHeader.menu)).not.toBeVisible());
  });

  it('calls logout and navigates to login on logout click', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId(dataTestIds.components.appHeader.accountButton));
    fireEvent.click(getByTestId(dataTestIds.components.appHeader.menuItemLogout));

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows an error toast if logout fails', async () => {
    jest.mocked(logout).mockRejectedValueOnce(new Error('Logout failed'));
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mute console.error

    const { getByTestId } = render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId(dataTestIds.components.appHeader.accountButton));
    fireEvent.click(getByTestId(dataTestIds.components.appHeader.menuItemLogout));

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(toast.error).toHaveBeenCalledWith('Logout failed. Please try again.');

    consoleErrorMock.mockRestore(); // Restore console.error after test
  });
});
