/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { LandingPageHeader } from './LandingPageHeader';

// Mock styled components
jest.mock('./LandingPageHeader.styles', () => ({
  HeaderContainer: ({ children }: any) => <div data-testid='header-container'>{children}</div>,
  LogoContainer: ({ children }: any) => <div data-testid='logo-container'>{children}</div>,
  LogoTitleContainer: ({ children }: any) => <div data-testid='logo-title-container'>{children}</div>,
  NavigationLinks: ({ children }: any) => <nav data-testid='navigation-links'>{children}</nav>,
  NavLink: ({ href, children }: any) => <a href={href} data-testid='nav-link'>{children}</a>,
}));

// Mock BTBLogo component
jest.mock('@src/assets', () => ({
  BTBLogo: () => <svg data-testid='btb-logo' />,
}));

describe('LandingPageHeader Component', () => {
  test('renders HeaderContainer', () => {
    render(<LandingPageHeader />);
    const header = screen.getByTestId('header-container');
    expect(header).toBeInTheDocument();
  });

  test('renders logo with correct link', () => {
    render(<LandingPageHeader />);
    const logoLink = screen.getByRole('link', { name: /bite by byte/i });
    expect(logoLink).toHaveAttribute('href', '/');

    const logo = screen.getByTestId('btb-logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders "Bite by Byte" text correctly', () => {
    render(<LandingPageHeader />);
    const biteByByteText = screen.getByRole('heading', { name: /bite by byte/i });
    expect(biteByByteText).toBeInTheDocument();
  });

  test('renders "How it works" navigation link with correct href', () => {
    render(<LandingPageHeader />);
    const navLink = screen.getByText('How it works');
    expect(navLink).toBeInTheDocument();
    expect(navLink.closest('a')).toHaveAttribute('href', '/how-it-works');
  });
});
