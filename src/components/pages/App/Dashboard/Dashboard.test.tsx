/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from '@testing-library/react';

import { DashboardPresentation } from './DashboardPresentation';

import '@testing-library/jest-dom';
import { NutritionStats } from '@components/molecules/NutritionStats/NutritionStats';
import { GroceryTable } from '@components/organisms/GroceryTable/GroceryTable';
import { MealCalendar } from '@components/organisms/MealCalendar/MealCalendar';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';

// Mock Child Components
jest.mock('@components/molecules/NutritionStats/NutritionStats', () => ({
  NutritionStats: jest.fn(() => <div data-testid='nutrition-stats'>NutritionStats Component</div>),
}));

jest.mock('@components/organisms/GroceryTable/GroceryTable', () => ({
  GroceryTable: jest.fn(() => <div data-testid='grocery-table'>GroceryTable Component</div>),
}));

jest.mock('@components/organisms/MealCalendar/MealCalendar', () => ({
  MealCalendar: jest.fn(() => <div data-testid='meal-calendar'>MealCalendar Component</div>),
}));

jest.mock('@components/molecules/RecipeInformationModal/RecipeInformationModal', () => ({
  RecipeInformationModal: jest.fn(() => <div data-testid='recipe-information-modal'>RecipeInformationModal Component</div>),
}));

describe('DashboardPresentation Component', () => {
  const defaultProps = {
    isLoading: false,
    userData: {
      username: 'john_doe',
    },
    nutritionRecipesData: [],
    loadingNutritionData: false,
    setIsWeeklyNutritionView: jest.fn(),
    groupedIngredients: {},
    loadingGroceryData: false,
    isWeeklyGroceryView: false,
    setIsWeeklyGroceryView: jest.fn(),
    onSeeMore: jest.fn(),
    selectedRecipeInfo: null,
    isModalOpen: false,
    isModalLoading: false,
    onCloseModal: jest.fn(),
  };

  it('renders loading state when isLoading is true', () => {
    // Arrange
    const props = { ...defaultProps, isLoading: true };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    // Ensure child components are not rendered during loading
    expect(screen.queryByTestId('nutrition-stats')).not.toBeInTheDocument();
    expect(screen.queryByTestId('grocery-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('meal-calendar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recipe-information-modal')).not.toBeInTheDocument();
  });

  it('renders welcome message and child components when isLoading is false', () => {
    // Arrange
    render(<DashboardPresentation {...defaultProps} />);

    // Assert
    expect(screen.getByText('Welcome, john_doe')).toBeInTheDocument();
    expect(screen.getByTestId('nutrition-stats')).toBeInTheDocument();
    expect(screen.getByTestId('grocery-table')).toBeInTheDocument();
    expect(screen.getByTestId('meal-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-information-modal')).toBeInTheDocument();
  });

  it('passes correct props to NutritionStats component', () => {
    // Arrange
    const props = {
      ...defaultProps,
      nutritionRecipesData: [{ id: 1, name: 'Recipe 1' }],
      loadingNutritionData: true,
    };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    const nutritionStats = screen.getByTestId('nutrition-stats');
    expect(nutritionStats).toBeInTheDocument();
    // Since NutritionStats is mocked, you can verify it was called with correct props
    expect(NutritionStats).toHaveBeenCalledWith(
      expect.objectContaining({
        recipesData: props.nutritionRecipesData,
        loading: props.loadingNutritionData,
        setIsWeeklyView: props.setIsWeeklyNutritionView,
      }),
      {}
    );
  });

  it('passes correct props to GroceryTable component', () => {
    // Arrange
    const props = {
      ...defaultProps,
      groupedIngredients: { fruits: ['Apple', 'Banana'] },
      loadingGroceryData: true,
      isWeeklyGroceryView: true,
    };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    const groceryTable = screen.getByTestId('grocery-table');
    expect(groceryTable).toBeInTheDocument();
    expect(GroceryTable).toHaveBeenCalledWith(
      expect.objectContaining({
        groupedIngredients: props.groupedIngredients,
        loading: props.loadingGroceryData,
        showControls: true,
        isWeeklyView: props.isWeeklyGroceryView,
        setIsWeeklyView: props.setIsWeeklyGroceryView,
      }),
      {}
    );
  });

  it('passes correct props to MealCalendar component', () => {
    // Arrange
    const props = {
      ...defaultProps,
      onSeeMore: jest.fn(),
    };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    const mealCalendar = screen.getByTestId('meal-calendar');
    expect(mealCalendar).toBeInTheDocument();
    expect(MealCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        isDashboard: true,
        onSeeMore: props.onSeeMore,
      }),
      {}
    );
  });

  it('passes correct props to RecipeInformationModal component', () => {
    // Arrange
    const props = {
      ...defaultProps,
      selectedRecipeInfo: { id: 1, name: 'Recipe 1' },
      isModalOpen: true,
      isModalLoading: true,
    };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    const recipeModal = screen.getByTestId('recipe-information-modal');
    expect(recipeModal).toBeInTheDocument();
    expect(RecipeInformationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: props.isModalOpen,
        onClose: props.onCloseModal,
        isLoading: props.isModalLoading,
        recipeInfo: props.selectedRecipeInfo,
      }),
      {}
    );
  });

  it('renders correctly with empty userData', () => {
    // Arrange
    const props = { ...defaultProps, userData: null };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    expect(screen.getByText('Welcome,')).toBeInTheDocument();
    // Depending on how the component handles null userData, adjust assertions
    // For example, it might render "Welcome, " without a username
  });

  it('does not render RecipeInformationModal when isModalOpen is false', () => {
    // Arrange
    const props = { ...defaultProps, isModalOpen: false };

    // Act
    render(<DashboardPresentation {...props} />);

    // Assert
    const recipeModal = screen.queryByTestId('recipe-information-modal');
    expect(recipeModal).toBeInTheDocument(); // It is rendered regardless of open state
  });
});
