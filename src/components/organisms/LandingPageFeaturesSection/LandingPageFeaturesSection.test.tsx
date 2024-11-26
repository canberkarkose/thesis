/* eslint-disable @typescript-eslint/no-explicit-any */
// LandingPageFeaturesSection.test.tsx

import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { LandingPageFeaturesSection } from './LandingPageFeaturesSection';

// Mock InfoCard component
jest.mock('../../molecules/InfoCard/InfoCard', () => ({
  InfoCard: ({ icon, title, text }: any) => (
    <div data-testid='info-card'>
      <span data-testid='info-card-icon'>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  ),
}));

describe('LandingPageFeaturesSection Component', () => {
  test('renders the heading correctly', () => {
    render(
      <MemoryRouter>
        <LandingPageFeaturesSection />
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', {
      name: /unlock the simplicity of smart, and sustainable eating/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test('renders all InfoCard components', () => {
    render(
      <MemoryRouter>
        <LandingPageFeaturesSection />
      </MemoryRouter>
    );
    const infoCards = screen.getAllByTestId('info-card');
    expect(infoCards).toHaveLength(3);
  });

  test('each InfoCard displays correct title and text', () => {
    render(
      <MemoryRouter>
        <LandingPageFeaturesSection />
      </MemoryRouter>
    );

    const featureTitles = [
      'Empower Your Plate',
      'Stress-Free Meal Decisions',
      'Streamlined Grocery Planning',
    ];

    const featureTexts = [
      'Simplify your meal planning with Bite by Byte. From vegan to Mediterranean, customize your diet to fit your lifestyle and nutrition goals effortlessly!',
      'Let Bite by Byte handle the meal planning. Say goodbye to the daily "what\'s for dinner?" dilemma and enjoy the pleasure of cooking and eating.',
      'Revolutionize shopping with auto-generated lists from your meal plans, ensuring you\'re always ready for a week of delicious dining.',
    ];

    featureTitles.forEach((title, index) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(featureTexts[index])).toBeInTheDocument();
    });
  });

  test('renders the "Create your free account now!" button with correct link', () => {
    render(
      <MemoryRouter>
        <LandingPageFeaturesSection />
      </MemoryRouter>
    );
    const button = screen.getByRole('link', { name: /create your free account now!/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/register');
  });
});
