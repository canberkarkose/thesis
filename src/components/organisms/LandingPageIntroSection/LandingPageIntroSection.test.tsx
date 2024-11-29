/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { LandingPageIntroSection } from './LandingPageIntroSection';

// Mock styled components
jest.mock('./LandingPageIntroSection.styles', () => ({
  IntroContainer: ({ children }: any) => <div data-testid='intro-container'>{children}</div>,
  ImageContainer: ({ children }: any) => <div data-testid='image-container'>{children}</div>,
  TextContainer: ({ children }: any) => <div data-testid='text-container'>{children}</div>,
  StyledIntroPlate: () => <div data-testid='intro-plate' />,
  AnimatedIcon: ({ children, onAnimationEnd }: any) => (
    <div data-testid='animated-icon' onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  ),
  StyledBiryani: () => <svg data-testid='styled-biryani' />,
  StyledDiet: () => <svg data-testid='styled-diet' />,
  StyledDinner: () => <svg data-testid='styled-dinner' />,
  StyledRamen: () => <svg data-testid='styled-ramen' />,
  StyledSalad: () => <svg data-testid='styled-salad' />,
  StyledChicken: () => <svg data-testid='styled-chicken' />,
  StyledTaco: () => <svg data-testid='styled-taco' />,
  StyledTurkey: () => <svg data-testid='styled-turkey' />,
}));

describe('LandingPageIntroSection Component', () => {
  test('renders heading and descriptive text', () => {
    render(
      <MemoryRouter>
        <LandingPageIntroSection />
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', {
      name: /transform your eating habits with bite by byte/i,
    });
    expect(heading).toBeInTheDocument();

    const descriptiveText = screen.getByText(/simplify your meal planning with bite by byte\./i);
    expect(descriptiveText).toBeInTheDocument();
  });

  test('renders sign-up button with correct link', () => {
    render(
      <MemoryRouter>
        <LandingPageIntroSection />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole('link', { name: /sign up now/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton.closest('a')).toHaveAttribute('href', '/register');
  });

  test('renders "Already a member?" text with sign-in link', () => {
    render(
      <MemoryRouter>
        <LandingPageIntroSection />
      </MemoryRouter>
    );

    const alreadyMemberText = screen.getByText(/already a member\?/i);
    expect(alreadyMemberText).toBeInTheDocument();

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  test('renders IntroPlate and initial AnimatedIcon', () => {
    render(
      <MemoryRouter>
        <LandingPageIntroSection />
      </MemoryRouter>
    );

    const introPlate = screen.getByTestId('intro-plate');
    expect(introPlate).toBeInTheDocument();

    const animatedIcon = screen.getByTestId('animated-icon');
    expect(animatedIcon).toBeInTheDocument();

    const initialIcon = screen.getByTestId('styled-biryani');
    expect(initialIcon).toBeInTheDocument();
  });

  test('cycles to next icon on animation end', () => {
    render(
      <MemoryRouter>
        <LandingPageIntroSection />
      </MemoryRouter>
    );

    const animatedIcon = screen.getByTestId('animated-icon');

    // Initially StyledBiryani
    expect(screen.getByTestId('styled-biryani')).toBeInTheDocument();

    // Trigger animation end
    fireEvent.animationEnd(animatedIcon);

    // Now StyledDiet should be present
    expect(screen.getByTestId('styled-diet')).toBeInTheDocument();
  });
});
