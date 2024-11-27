/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react/button-has-type */
import {
  render, screen, fireEvent,
  waitFor
} from '@testing-library/react';

import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

import { LandingPageDemo } from './LandingPageDemo';
import { LandingPageDemoPresentation } from './LandingPageDemoPresentation';

import { DemoContentWrapper } from './templates/DemoContentWrapper';

import { fetchRecipes } from '@src/services/spoonacular-service';

jest.mock('@src/services/spoonacular-service', () => ({
  fetchRecipes: jest.fn(),
}));

jest.mock('@tsparticles/react', () => ({
  initParticlesEngine: jest.fn(() => Promise.resolve()),
  default: () => <div data-testid='mock-particles' />
}));

jest.mock('@tsparticles/slim', () => ({
  loadSlim: jest.fn(),
}));

jest.mock('./DemoTypes/ManualDemo', () => ({
  ManualDemo: ({ onGenerateMeals }: { onGenerateMeals: Function }) => (
    <button
      data-testid='generate-meals-button'
      onClick={() => onGenerateMeals('vegetarian', ['dairy'], ['Italian'], ['Mexican'])}
    >
      Generate Meals
    </button>
  ),
}));

jest.mock('./DemoTypes/QuizDemo', () => ({
  QuizDemo: () => <div>Quiz Demo</div>,
}));

jest.mock('./DemoTypes/DemoResults', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DemoResults: ({ recipes }: { recipes: any[] }) => (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  ),
}));

jest.mock('@src/assets/demoBackground.png', () => 'mock-demoBackground.png');
jest.mock('@src/assets/orange.svg', () => 'mock-orange.svg');
jest.mock('@src/assets/eggplant.svg', () => 'mock-eggplant.svg');
jest.mock('@src/assets/pear.svg', () => 'mock-pear.svg');
jest.mock('@src/assets/apple.svg', () => 'mock-apple.svg');
jest.mock('@src/assets/lemon.svg', () => 'mock-lemon.svg');

describe('LandingPageDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start step initially', () => {
    render(<LandingPageDemo />);
    expect(screen.getByText(/Not Quite Ready To Sign Up?/i)).toBeInTheDocument();
  });

  it('fetches recipes and transitions to the results step', async () => {
    const mockRecipes = [
      { id: 1, title: 'Recipe 1', image: 'image1.jpg' },
      { id: 2, title: 'Recipe 2', image: 'image2.jpg' },
      { id: 3, title: 'Recipe 3', image: 'image3.jpg' },
    ];
    (fetchRecipes as jest.Mock).mockResolvedValueOnce({ results: mockRecipes });

    render(<LandingPageDemo />);

    fireEvent.click(screen.getByText(/Create Your Meals/i)); // Transition to manual demo
    fireEvent.click(screen.getByTestId('generate-meals-button')); // Trigger Generate Meals

    expect(fetchRecipes).toHaveBeenCalledWith({
      diet: 'vegetarian',
      intolerances: 'dairy',
      cuisines: 'Italian',
      excludeCuisines: 'Mexican',
    });
  });

  it('handles errors when fetching recipes', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (fetchRecipes as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<LandingPageDemo />);

    fireEvent.click(screen.getByText(/Create Your Meals/i)); // Transition to manual demo
    fireEvent.click(screen.getByTestId('generate-meals-button')); // Trigger Generate Meals

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching recipes:', expect.any(Error)));
  });

  it('loads particles engine on mount', async () => {
    const mockEngine = {};
    const mockSetInit = jest.fn();
    (initParticlesEngine as jest.Mock)
      .mockImplementationOnce((callback) => callback(mockEngine).then(() => mockSetInit(true)));

    render(<LandingPageDemoPresentation onSelectDemo={jest.fn()} />);
    expect(initParticlesEngine).toHaveBeenCalled();
    expect(loadSlim).toHaveBeenCalledWith(mockEngine);
  });

  it('triggers onSelectDemo with "quiz" when the Quiz button is clicked', () => {
    const mockOnSelectDemo = jest.fn();

    render(<LandingPageDemoPresentation onSelectDemo={mockOnSelectDemo} />);
    fireEvent.click(screen.getByText(/Take the Meal Quiz/i));

    expect(mockOnSelectDemo).toHaveBeenCalledWith('quiz');
  });
});

describe('DemoContentWrapper', () => {
  it('renders "Go Back" button when shouldDisplayGoBackButton is true and triggers onBack', () => {
    const mockOnBack = jest.fn();
    render(
      <DemoContentWrapper
        headline='Test Headline'
        subheading='Test Subheading'
        shouldDisplayGoBackButton
        onBack={mockOnBack}
      >
        <div>Test Content</div>
      </DemoContentWrapper>
    );

    // Check if the button is rendered
    const goBackButton = screen.getByTestId('manual-go-back');
    expect(goBackButton).toBeInTheDocument();

    // Simulate a click on the button
    fireEvent.click(goBackButton);

    // Verify the onBack function is called
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('does not render "Go Back" button when shouldDisplayGoBackButton is false', () => {
    render(
      <DemoContentWrapper
        headline='Test Headline'
        subheading='Test Subheading'
        shouldDisplayGoBackButton={false}
      >
        <div>Test Content</div>
      </DemoContentWrapper>
    );

    // Check if the button is not rendered
    const goBackButton = screen.queryByTestId('manual-go-back');
    expect(goBackButton).not.toBeInTheDocument();
  });
});
