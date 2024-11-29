/* eslint-disable no-plusplus */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, BrowserRouter as Router, useNavigate } from 'react-router-dom';

import { DemoResults } from './DemoResults';
import { ManualDemo } from './ManualDemo';
import { QuizDemo } from './QuizDemo';

jest.mock('@src/assets/demoBackground.png', () => 'mock-demoBackground.png');
jest.mock('@src/assets/orange.svg', () => 'mock-orange.svg');
jest.mock('@src/assets/eggplant.svg', () => 'mock-eggplant.svg');
jest.mock('@src/assets/pear.svg', () => 'mock-pear.svg');
jest.mock('@src/assets/apple.svg', () => 'mock-apple.svg');
jest.mock('@src/assets/lemon.svg', () => 'mock-lemon.svg');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../constants', () => ({
  createDietQuestions: (setDiet: (value: string) => void) => [
    { text: 'Do you want a vegetarian diet?', onYes: () => setDiet('vegetarian') },
    { text: 'Do you want a vegan diet?', onYes: () => setDiet('vegan') },
  ],
  createIntoleranceQuestions: (setIntolerances: (value: string[]) => void) => [
    { text: 'Are you intolerant to dairy?', onYes: () => setIntolerances(['dairy']) },
  ],
  createCuisineQuestions: (setCuisines: (
    value: string[]
  ) => void, setExcludeCuisines: (value: string[]) => void) => [
    { text: 'Do you like Italian cuisine?', onYes: () => setCuisines(['Italian']), onNo: () => setExcludeCuisines(['Italian']) },
  ],
  createMaxReadyTimeQuestion: (setMaxReadyTime: (value: number) => void) => ({
    text: 'Do you prefer meals ready in under 30 minutes?',
    onYes: () => setMaxReadyTime(30),
  }),
}));

describe('Demo Components', () => {
  // Mock Data
  const mockRecipes = [
    { id: 1, title: 'Recipe 1', image: 'image1.jpg' },
    { id: 2, title: 'Recipe 2', image: 'image2.jpg' },
  ];
  const mockOnBack = jest.fn();
  const mockOnGenerateMeals = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  // DemoResults Component
  describe('DemoResults', () => {
    it('renders recipes correctly', () => {
      render(
        <Router>
          <DemoResults recipes={mockRecipes} onBack={mockOnBack} />
        </Router>
      );

      mockRecipes.forEach((recipe) => {
        expect(screen.getByText(recipe.title)).toBeInTheDocument();
        expect(screen.getByAltText(recipe.title)).toBeInTheDocument();
      });
    });

    it('calls onBack when "Back" button is clicked', () => {
      render(
        <Router>
          <DemoResults recipes={mockRecipes} onBack={mockOnBack} />
        </Router>
      );

      fireEvent.click(screen.getByText(/Back/i));
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('navigates to /register when the "Sign Up" button is clicked', () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

      render(
        <MemoryRouter>
          <DemoResults recipes={mockRecipes} onBack={mockOnBack} />
        </MemoryRouter>
      );

      const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(signUpButton);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  // ManualDemo Component
  describe('ManualDemo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('handles diet selection and generates meals', () => {
      render(<ManualDemo onBack={mockOnBack} onGenerateMeals={mockOnGenerateMeals} />);

      // Select a diet
      const dietButton = screen.getByRole('button', { name: /Vegan/i }); // Example diet button
      fireEvent.click(dietButton);

      // Generate meals
      fireEvent.click(screen.getAllByText(/Generate Meals/i)[1]);
      expect(mockOnGenerateMeals).toHaveBeenCalled();
    });

    it('calls onBack when "Back" button is clicked', () => {
      render(<ManualDemo onBack={mockOnBack} onGenerateMeals={mockOnGenerateMeals} />);

      fireEvent.click(screen.getByTestId('manual-go-back'));
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('toggles cuisines when a cuisine button is clicked', () => {
      render(
        <ManualDemo
          onBack={mockOnBack}
          onGenerateMeals={mockOnGenerateMeals}
        />
      );

      const cuisineButton = screen.getByTestId('cuisine-italian'); // Example cuisine button
      expect(cuisineButton).toBeInTheDocument();

      // Select the cuisine
      fireEvent.click(cuisineButton);
      expect(cuisineButton).toHaveClass('MuiButton-contained');

      // Deselect the cuisine
      fireEvent.click(cuisineButton);
      expect(cuisineButton).toHaveClass('MuiButton-outlined');
    });

    it('toggles intolerances when an intolerance button is clicked', () => {
      render(
        <ManualDemo
          onBack={mockOnBack}
          onGenerateMeals={mockOnGenerateMeals}
        />
      );

      const intoleranceButton = screen.getByText(/Dairy/i);
      expect(intoleranceButton).toBeInTheDocument();

      // Select the intolerance
      fireEvent.click(intoleranceButton);
      expect(intoleranceButton).toHaveClass('MuiButton-contained');

      // Deselect the intolerance
      fireEvent.click(intoleranceButton);
      expect(intoleranceButton).toHaveClass('MuiButton-outlined');
    });
  });

  // QuizDemo Component
  describe('QuizDemo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('displays questions and handles answers', () => {
      render(<QuizDemo onBack={mockOnBack} onGenerateMeals={mockOnGenerateMeals} />);

      // Answer the first question
      fireEvent.click(screen.getByText(/Yes/i));
      expect(mockOnGenerateMeals).not.toHaveBeenCalled(); // Ensure meals are not generated yet

      // Finish all questions
      for (let i = 0; i < 3; i++) {
        fireEvent.click(screen.getByText(/Yes/i));
      }

      expect(mockOnGenerateMeals).toHaveBeenCalled();
    });

    it('calls onBack when "Back" button is clicked', () => {
      render(<QuizDemo onBack={mockOnBack} onGenerateMeals={mockOnGenerateMeals} />);

      fireEvent.click(screen.getByTestId('manual-go-back'));
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('calls the onNo function when the No button is clicked', () => {
      render(
        <QuizDemo
          onBack={mockOnBack}
          onGenerateMeals={mockOnGenerateMeals}
        />
      );

      // Find and click the No button
      const noButton = screen.getByText('No');
      expect(noButton).toBeInTheDocument();

      fireEvent.click(noButton);

      // Verify that the onNo function was called (e.g., excluding Italian cuisine)
      expect(mockOnGenerateMeals).not.toHaveBeenCalled();
    });
  });
});
