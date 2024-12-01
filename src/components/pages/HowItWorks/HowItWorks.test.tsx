import { render, screen } from '@testing-library/react';

import { HowItWorks } from './HowItworks';
import { Step } from './Step';

jest.mock('@src/assets/signup_image.png', () => 'mock-signup_image.png');
jest.mock('@src/assets/dashboard_image.png', () => 'mock-dashboard_image.png');
jest.mock('@src/assets/meal_generator_image.png', () => 'mock-meal_generatorImage.png');
jest.mock('@src/assets/grocery_list_image.png', () => 'mock-grocery_listImage.png');
jest.mock('@src/assets/recipes_image.png', () => 'mock-recipes_image.png');
jest.mock('@src/assets/globalBackground.png', () => 'globalBackground.png');
jest.mock('@src/assets/background.png', () => 'backgroundImage.png');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../organisms/LandingPageHeader/LandingPageHeader', () => ({
  LandingPageHeader: () => <div data-testid='header'>Mock Header</div>,
}));

jest.mock('../../organisms/LandingPageFooter/LandingPageFooter', () => ({
  LandingPageFooter: () => <div data-testid='footer'>Mock Footer</div>,
}));

describe('HowItWorks Component', () => {
  it('renders the header, footer, and main content', () => {
    render(<HowItWorks />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('Discover How Bite by Byte Makes Your Meal Planning Effortless!')
    ).toBeInTheDocument();
  });

  it('renders all steps with correct titles and descriptions', () => {
    render(<HowItWorks />);

    const steps = [
      'Step 1: Sign Up and Set Your Preferences',
      'Step 2: Access Your Dashboard',
      'Step 3: Generate Your Daily Meals',
      'Step 4: Organize Your Grocery List',
      'Step 5: Explore New Recipes',
    ];

    steps.forEach((stepTitle) => {
      expect(screen.getByText(stepTitle)).toBeInTheDocument();
    });
  });

  it('renders the call-to-action button', () => {
    render(<HowItWorks />);

    const ctaButton = screen.getByRole('button', { name: /Sign Up Now!/i });
    expect(ctaButton).toBeInTheDocument();
  });
});

describe('Step Component', () => {
  it('renders with correct title and description in default layout', () => {
    render(
      <Step
        imageSrc='test-image.png'
        title='Test Step Title'
        description='Test Step Description'
        reverse={false}
      />
    );

    expect(screen.getByText('Test Step Title')).toBeInTheDocument();
    expect(screen.getByText('Test Step Description')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Test Step Title/i })).toHaveAttribute(
      'src',
      'test-image.png'
    );
  });

  it('renders in reverse layout when reverse is true', () => {
    render(
      <Step
        imageSrc='test-image.png'
        title='Reverse Layout Title'
        description='Reverse Layout Description'
        reverse
      />
    );

    const stepContainer = screen.getByText('Reverse Layout Title').closest('div');
    expect(stepContainer).toBeInTheDocument();
  });

  it('applies hover effects to the description box', () => {
    render(
      <Step
        imageSrc='test-image.png'
        title='Hover Test Title'
        description='Hover Test Description'
        reverse={false}
      />
    );

    const descriptionBox = screen.getByText('Hover Test Title').closest('div');
    expect(descriptionBox).toHaveStyle('transition: transform 0.2s');
  });

  it('navigates to register when the button is clicked', () => {
    render(<HowItWorks />);

    const button = screen.getByRole('button', { name: /Sign Up Now!/i });
    button.click();

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
