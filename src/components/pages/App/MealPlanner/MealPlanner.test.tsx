/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
// renderPaginationButtons.test.tsx
import {
  render, screen, fireEvent
} from '@testing-library/react';

import { renderPaginationButtons } from './MealPlanner.helper';

// MealPlannerPresentation.test.tsx

import { MealPlannerPresentation } from './MealPlannerPresentation';

describe('renderPaginationButtons', () => {
  it('renders correctly when on the first page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <div>
        {renderPaginationButtons({
          currentPage: 1,
          totalPages: 5,
          onPageChange: mockOnPageChange,
        })}
      </div>
    );

    // Assert that the first page button is disabled
    expect(screen.getByText('1')).toBeDisabled();

    // Assert that the next two pages are displayed
    expect(screen.getByText('2')).toBeEnabled();

    // Assert that the last page button exists
    expect(screen.getByText('5')).toBeEnabled();

    // Assert that the "..." is rendered
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('renders correctly when on a middle page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <div>
        {renderPaginationButtons({
          currentPage: 3,
          totalPages: 5,
          onPageChange: mockOnPageChange,
        })}
      </div>
    );

    // Assert that the first page button exists
    expect(screen.getByText('1')).toBeEnabled();

    // Assert that the current page is disabled
    expect(screen.getByText('3')).toBeDisabled();

    // Assert that the next page button exists
    expect(screen.getByText('4')).toBeEnabled();

    // Assert that the last page button exists
    expect(screen.getByText('5')).toBeEnabled();
  });

  it('renders correctly when on the last page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <div>
        {renderPaginationButtons({
          currentPage: 5,
          totalPages: 5,
          onPageChange: mockOnPageChange,
        })}
      </div>
    );

    // Assert that the first page button exists
    expect(screen.getByText('1')).toBeEnabled();

    // Assert that the dots are rendered before the last page
    expect(screen.getByText('...')).toBeInTheDocument();

    // Assert that the last page is disabled
    expect(screen.getByText('5')).toBeDisabled();
  });

  it('calls onPageChange when a page button is clicked', () => {
    const mockOnPageChange = jest.fn();

    render(
      <div>
        {renderPaginationButtons({
          currentPage: 3,
          totalPages: 5,
          onPageChange: mockOnPageChange,
        })}
      </div>
    );

    // Click on the first page button
    fireEvent.click(screen.getByText('1'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    // Click on the next page button
    fireEvent.click(screen.getByText('4'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});

jest.mock('@components/molecules/MealGenerator/MealGenerator', () => ({
  MealGenerator: ({ onGenerate }: any) => (
    <div data-testid='meal-generator'>
      <button onClick={() => onGenerate()}>Generate Meals</button>
    </div>
  ),
}));

jest.mock('@components/molecules/RecipeCard/RecipeCard', () => ({
  RecipeCard: ({
    title,
    onSeeMore,
    onAddToMealPlan,
    isAddButtonDisabled,
    isActive,
  }: any) => (
    <div data-testid='recipe-card'>
      <h4>{title}</h4>
      <button onClick={onSeeMore}>See More</button>
      <button
        onClick={onAddToMealPlan}
        disabled={isAddButtonDisabled}
        className={isActive ? 'active' : ''}
      >
        Add to Meal Plan
      </button>
    </div>
  ),
}));

jest.mock('@components/organisms/MealCalendar/MealCalendar', () => ({
  MealCalendar: ({ recipeToAdd, onRecipeAdded }: any) => (
    <div data-testid='meal-calendar'>
      <button onClick={onRecipeAdded}>
        {recipeToAdd ? `Add ${recipeToAdd.title}` : 'No Recipe'}
      </button>
    </div>
  ),
}));

jest.mock('@components/molecules/RecipeInformationModal/RecipeInformationModal', () => ({
  RecipeInformationModal: ({ open, onClose }: any) => (
    open ? <div data-testid='recipe-modal'><button onClick={onClose}>Close Modal</button></div> : null
  ),
}));

describe('MealPlannerPresentation Component', () => {
  const mockProps = {
    handleGenerateMeals: jest.fn(),
    selectedMeals: [
      { id: 1, title: 'Spaghetti', image: 'spaghetti.jpg' },
      { id: 2, title: 'Tacos', image: 'tacos.jpg' },
    ],
    isLoading: false,
    apiError: null,
    currentPage: 1,
    totalPages: 3,
    onPageChange: jest.fn(),
    onSeeMore: jest.fn(),
    selectedRecipeInfo: { title: 'Recipe Info' },
    isModalOpen: false,
    isModalLoading: false,
    onCloseModal: jest.fn(),
    type: 'weekly',
  };

  it('renders without crashing', () => {
    render(<MealPlannerPresentation {...mockProps} />);
    expect(screen.getByTestId('meal-generator')).toBeInTheDocument();
    expect(screen.getByTestId('meal-calendar')).toBeInTheDocument();
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2);
  });

  it('calls handleGenerateMeals when Generate Meals button is clicked', () => {
    render(<MealPlannerPresentation {...mockProps} />);
    fireEvent.click(screen.getByText('Generate Meals'));
    expect(mockProps.handleGenerateMeals).toHaveBeenCalled();
  });

  it('calls onSeeMore when See More button is clicked on a RecipeCard', () => {
    render(<MealPlannerPresentation {...mockProps} />);
    const seeMoreButtons = screen.getAllByText('See More');
    fireEvent.click(seeMoreButtons[0]);
    expect(mockProps.onSeeMore).toHaveBeenCalledWith(1);
  });

  it('renders pagination buttons and calls onPageChange', () => {
    render(<MealPlannerPresentation {...mockProps} />);
    const firstPageButton = screen.getByText('1');
    const secondPageButton = screen.getByText('2');
    expect(firstPageButton).toBeInTheDocument();
    expect(secondPageButton).toBeInTheDocument();

    fireEvent.click(secondPageButton);
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders "No meals generated yet." when selectedMeals is empty and no apiError', () => {
    render(<MealPlannerPresentation {...mockProps} selectedMeals={[]} />);
    expect(screen.getByText('No meals generated yet.')).toBeInTheDocument();
  });

  it('opens and closes the RecipeInformationModal', () => {
    render(<MealPlannerPresentation {...mockProps} isModalOpen />);
    expect(screen.getByTestId('recipe-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(mockProps.onCloseModal).toHaveBeenCalled();
  });
});
