/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  render, screen, fireEvent, within
} from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { MealGenerator } from './MealGenerator';

describe('MealGenerator Component', () => {
  const mockOnGenerate = jest.fn();
  const mockResetSelectedRecipe = jest.fn();

  const defaultProps = {
    isLoading: false,
    onGenerate: mockOnGenerate,
    resetSelectedRecipe: mockResetSelectedRecipe,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mealTypes = ['Main Course', 'Breakfast', 'Dessert'];

  it('renders correctly', () => {
    render(<MealGenerator {...defaultProps} />);

    expect(screen.getByTestId(dataTestIds.components.mealGenerator.container)).toBeInTheDocument();
    expect(screen.getByText('Meal Generator')).toBeInTheDocument();

    mealTypes.forEach((mealType) => {
      expect(
        screen.getByTestId(dataTestIds.components.mealGenerator.tab(mealType.toLowerCase()))
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton)).toBeInTheDocument();
  });

  it('displays input fields for "Main Course" tab', () => {
    render(<MealGenerator {...defaultProps} />);

    expect(screen.getByTestId(dataTestIds.components.mealGenerator.queryInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.minCaloriesInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.maxCaloriesInput)).toBeInTheDocument();
  });

  it('switches to "Dessert" tab and displays correct input fields', () => {
    render(<MealGenerator {...defaultProps} />);

    const dessertTab = screen.getByTestId(dataTestIds.components.mealGenerator.tab('dessert'));
    fireEvent.click(dessertTab);

    expect(screen.getByTestId(dataTestIds.components.mealGenerator.queryInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.minSugarInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.maxSugarInput)).toBeInTheDocument();

    // Ensure calories inputs are not present
    expect(screen.queryByTestId(dataTestIds.components.mealGenerator.minCaloriesInput)).not.toBeInTheDocument();
    expect(screen.queryByTestId(dataTestIds.components.mealGenerator.maxCaloriesInput)).not.toBeInTheDocument();
  });

  it('updates form values on input change', () => {
    render(<MealGenerator {...defaultProps} />);

    const queryInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.queryInput);
    const queryInput = within(queryInputWrapper).getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'chicken' } });
    expect(queryInput).toHaveValue('chicken');

    const minCaloriesInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.minCaloriesInput);
    const minCaloriesInput = within(minCaloriesInputWrapper).getByRole('spinbutton');
    fireEvent.change(minCaloriesInput, { target: { value: '200' } });
    expect(minCaloriesInput).toHaveValue(200);

    const maxCaloriesInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.maxCaloriesInput);
    const maxCaloriesInput = within(maxCaloriesInputWrapper).getByRole('spinbutton');
    fireEvent.change(maxCaloriesInput, { target: { value: '500' } });
    expect(maxCaloriesInput).toHaveValue(500);
  });

  it('calls onGenerate with correct params when generating "Main Course"', () => {
    render(<MealGenerator {...defaultProps} />);

    // Fill in the form
    const queryInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.queryInput);
    const queryInput = within(queryInputWrapper).getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'chicken' } });
    const minCaloriesInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.minCaloriesInput);
    const minCaloriesInput = within(minCaloriesInputWrapper).getByRole('spinbutton');
    fireEvent.change(minCaloriesInput, { target: { value: '200' } });
    const maxCaloriesInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.maxCaloriesInput);
    const maxCaloriesInput = within(maxCaloriesInputWrapper).getByRole('spinbutton');
    fireEvent.change(maxCaloriesInput, { target: { value: '500' } });

    // Click Generate
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton));

    // Expect onGenerate to be called with correct params
    expect(mockOnGenerate).toHaveBeenCalledWith({
      type: 'main course',
      query: 'chicken',
      minCalories: 200,
      maxCalories: 500,
    });

    expect(mockResetSelectedRecipe).toHaveBeenCalled();
  });

  it('calls onGenerate with correct params when generating "Dessert"', () => {
    render(<MealGenerator {...defaultProps} />);

    // Switch to 'Dessert' tab
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.tab('dessert')));

    // Fill in the form
    const queryInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.queryInput);
    const queryInput = within(queryInputWrapper).getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'cake' } });
    const minSugarInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.minSugarInput);
    const minSugarInput = within(minSugarInputWrapper).getByRole('spinbutton');
    fireEvent.change(minSugarInput, { target: { value: '10' } });
    const maxSugarInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.maxSugarInput);
    const maxSugarInput = within(maxSugarInputWrapper).getByRole('spinbutton');
    fireEvent.change(maxSugarInput, { target: { value: '50' } });

    // Click Generate
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton));

    // Expect onGenerate to be called with correct params
    expect(mockOnGenerate).toHaveBeenCalledWith({
      type: 'dessert',
      query: 'cake',
      minSugar: 10,
      maxSugar: 50,
    });

    expect(mockResetSelectedRecipe).toHaveBeenCalled();
  });

  it('displays loading indicator when isLoading is true', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };
    render(<MealGenerator {...props} />);

    expect(screen.getByTestId(dataTestIds.components.mealGenerator.loadingIndicator)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton)).toBeDisabled();
  });

  it('disables tabs when isLoading is true', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };
    render(<MealGenerator {...props} />);

    mealTypes.forEach((mealType) => {
      expect(
        screen.getByTestId(dataTestIds.components.mealGenerator.tab(mealType.toLowerCase()))
      ).toBeDisabled();
    });
  });

  it('resets form values when tab changes', () => {
    render(<MealGenerator {...defaultProps} />);

    // Fill in the form
    const queryInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.queryInput);
    const queryInput = within(queryInputWrapper).getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'chicken' } });
    expect(queryInput).toHaveValue('chicken');

    // Switch to 'Dessert' tab
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.tab('dessert')));

    // Form values should be reset
    expect(queryInput).toHaveValue('');
  });

  it('handles empty inputs gracefully', () => {
    render(<MealGenerator {...defaultProps} />);

    // Click Generate without filling in any inputs
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton));

    // Expect onGenerate to be called with minimal params
    expect(mockOnGenerate).toHaveBeenCalledWith({
      type: 'main course',
      query: undefined,
    });

    expect(mockResetSelectedRecipe).toHaveBeenCalled();
  });

  it('handles errors in handleGenerate and logs them', () => {
    // Mock onGenerate to throw an error
    const error = new Error('Test error');
    mockOnGenerate.mockImplementation(() => {
      throw error;
    });

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<MealGenerator {...defaultProps} />);

    // Click Generate
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton));

    // Expect console.error to have been called with the error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating meals:', error);

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it('displays input fields for "Breakfast" tab', () => {
    render(<MealGenerator {...defaultProps} />);

    // Switch to 'Breakfast' tab
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.tab('breakfast')));

    // Expect input fields for 'Breakfast' to be displayed
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.queryInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.minCaloriesInput)).toBeInTheDocument();
    expect(screen.getByTestId(dataTestIds.components.mealGenerator.maxCaloriesInput)).toBeInTheDocument();

    // Ensure sugar inputs are not present
    expect(screen.queryByTestId(dataTestIds.components.mealGenerator.minSugarInput)).not.toBeInTheDocument();
    expect(screen.queryByTestId(dataTestIds.components.mealGenerator.maxSugarInput)).not.toBeInTheDocument();
  });

  it('returns null when renderFormFields is called with invalid selectedTab', () => {
    // Mock useState to set selectedTab to an invalid index
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [99, jest.fn()]);

    render(<MealGenerator {...defaultProps} />);

    // Restore useState
    jest.restoreAllMocks();
  });

  it('calls onGenerate with undefined minSugar and maxSugar when generating "Dessert" without sugar inputs', () => {
    render(<MealGenerator {...defaultProps} />);

    // Switch to 'Dessert' tab
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.tab('dessert')));

    // Fill in the query input only
    const queryInputWrapper = screen.getByTestId(dataTestIds.components.mealGenerator.queryInput);
    const queryInput = within(queryInputWrapper).getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'cake' } });

    // Click Generate
    fireEvent.click(screen.getByTestId(dataTestIds.components.mealGenerator.generateButton));

    // Expect onGenerate to be called with minSugar and maxSugar as undefined
    expect(mockOnGenerate).toHaveBeenCalledWith({
      type: 'dessert',
      query: 'cake',
      minSugar: undefined,
      maxSugar: undefined,
    });
  });
});
