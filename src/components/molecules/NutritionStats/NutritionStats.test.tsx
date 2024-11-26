/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import { render, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { NutritionStats } from './NutritionStats';

const mockNavigate = jest.fn();
// mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NutritionStats Component', () => {
  const mockSetIsWeeklyView = jest.fn();

  const defaultProps = {
    recipesData: [],
    loading: false,
    setIsWeeklyView: mockSetIsWeeklyView,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading is true', () => {
    render(
      <NutritionStats {...defaultProps} loading />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByTestId(dataTestIds.components.nutritionStats.loadingIndicator)).toBeInTheDocument();
  });

  it('renders no data message when there are no recipes', () => {
    render(
      <NutritionStats {...defaultProps} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByTestId(dataTestIds.components.nutritionStats.noData)).toBeInTheDocument();
    expect(screen.getByText('No nutrition data available')).toBeInTheDocument();
  });

  it('renders average calories and chart when recipes data is available', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 500 },
          ],
          caloricBreakdown: {
            percentProtein: 20,
            percentCarbs: 50,
            percentFat: 30,
          },
        },
      },
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 700 },
          ],
          caloricBreakdown: {
            percentProtein: 25,
            percentCarbs: 45,
            percentFat: 30,
          },
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByTestId(dataTestIds.components.nutritionStats.averageCalories)).toBeInTheDocument();
    expect(screen.getByText(/Average Calorie Per Meal:/)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.nutritionStats.chart)).toBeInTheDocument();
  });

  it('handles tab changes and calls setIsWeeklyView', () => {
    render(
      <NutritionStats {...defaultProps} />,
      { wrapper: MemoryRouter }
    );

    const dailyTab = screen.getByTestId(dataTestIds.components.nutritionStats.dailyTab);
    const weeklyTab = screen.getByTestId(dataTestIds.components.nutritionStats.weeklyTab);

    // Initially, isWeekly is true
    expect(weeklyTab).toHaveClass('Mui-selected');

    // Click on Daily tab
    fireEvent.click(dailyTab);

    expect(mockSetIsWeeklyView).toHaveBeenCalledWith(false);
    expect(dailyTab).toHaveClass('Mui-selected');
  });

  it('navigates to meal planner when "Go to Meal Planner" button is clicked', () => {
    render(
      <NutritionStats {...defaultProps} />,
      { wrapper: MemoryRouter }
    );

    const goToMealPlannerButton = screen.getByTestId(dataTestIds.components.nutritionStats.goToMealPlannerButton);
    fireEvent.click(goToMealPlannerButton);

    expect(mockNavigate).toHaveBeenCalledWith('/app/meal-planner');
  });

  it('calculates averages correctly', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 400 },
          ],
          caloricBreakdown: {
            percentProtein: 30,
            percentCarbs: 40,
            percentFat: 30,
          },
        },
      },
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 600 },
          ],
          caloricBreakdown: {
            percentProtein: 20,
            percentCarbs: 50,
            percentFat: 30,
          },
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 500.0 kcal')).toBeInTheDocument();
  });

  it('handles recipes with missing nutrition data', () => {
    const recipesData = [
      {
        // No 'nutrition' property
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 0.0 kcal')).toBeInTheDocument();
  });

  it('handles recipes with empty nutrients array', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [], // Empty array
          caloricBreakdown: {
            percentProtein: 20,
            percentCarbs: 50,
            percentFat: 30,
          },
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 0.0 kcal')).toBeInTheDocument();
  });

  it('handles recipes with missing caloricBreakdown', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 500 },
          ],
          // No 'caloricBreakdown' property
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 500.0 kcal')).toBeInTheDocument();
  });

  it('handles recipes with missing macronutrient percentages', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 600 },
          ],
          caloricBreakdown: {
            // Missing macronutrient percentages
          },
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 600.0 kcal')).toBeInTheDocument();
  });

  it('handles recipes with missing Calories in nutrients', () => {
    const recipesData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Protein', amount: 30 },
          ],
          caloricBreakdown: {
            percentProtein: 25,
            percentCarbs: 50,
            percentFat: 25,
          },
        },
      },
    ];

    render(
      <NutritionStats {...defaultProps} recipesData={recipesData} />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Average Calorie Per Meal: 0.0 kcal')).toBeInTheDocument();
  });
});
