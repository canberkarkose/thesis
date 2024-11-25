/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import {
  render, screen, fireEvent
} from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { RecipeCard } from './RecipeCard';

describe('RecipeCard Component', () => {
  const mockOnSeeMore = jest.fn();
  const mockOnAddToMealPlan = jest.fn();

  const defaultProps = {
    title: 'Test Recipe',
    onSeeMore: mockOnSeeMore,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with image provided', () => {
    const props = {
      ...defaultProps,
      image: 'test-image.jpg',
    };

    render(<RecipeCard {...props} />);

    const image = screen.getByTestId(dataTestIds.components.recipeCard.image);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Recipe');

    // Placeholder image should not be present
    expect(screen.queryByTestId(dataTestIds.components.recipeCard.placeholderImage)).not.toBeInTheDocument();
  });

  it('renders placeholder image when image is not provided', () => {
    render(<RecipeCard {...defaultProps} />);

    const placeholderImage = screen.getByTestId(dataTestIds.components.recipeCard.placeholderImage);
    expect(placeholderImage).toBeInTheDocument();

    // Recipe image should not be present
    expect(screen.queryByTestId(dataTestIds.components.recipeCard.image)).not.toBeInTheDocument();
  });

  it('renders title', () => {
    render(<RecipeCard {...defaultProps} />);

    const title = screen.getByTestId(dataTestIds.components.recipeCard.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Recipe');
  });

  it('renders description when provided', () => {
    const props = {
      ...defaultProps,
      description: '<p>This is a test description.</p>',
    };

    render(<RecipeCard {...props} />);

    const description = screen.getByTestId(dataTestIds.components.recipeCard.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('This is a test description.');
  });

  it('does not render description when not provided', () => {
    render(<RecipeCard {...defaultProps} />);

    const description = screen.queryByTestId(dataTestIds.components.recipeCard.description);
    expect(description).not.toBeInTheDocument();
  });

  it('triggers onSeeMore when "See More" button is clicked', () => {
    render(<RecipeCard {...defaultProps} />);

    const seeMoreButton = screen.getByTestId(dataTestIds.components.recipeCard.seeMoreButton);
    expect(seeMoreButton).toBeInTheDocument();

    fireEvent.click(seeMoreButton);
    expect(mockOnSeeMore).toHaveBeenCalled();
  });

  it('renders add button when showAddButton is true', () => {
    const props = {
      ...defaultProps,
      showAddButton: true,
      onAddToMealPlan: mockOnAddToMealPlan,
    };

    render(<RecipeCard {...props} />);

    const addButton = screen.getByTestId(dataTestIds.components.recipeCard.addButton);
    expect(addButton).toBeInTheDocument();
  });

  it('triggers onAddToMealPlan when add button is clicked', () => {
    const props = {
      ...defaultProps,
      showAddButton: true,
      onAddToMealPlan: mockOnAddToMealPlan,
    };

    render(<RecipeCard {...props} />);

    const addButton = screen.getByTestId(dataTestIds.components.recipeCard.addButton);

    fireEvent.click(addButton);
    expect(mockOnAddToMealPlan).toHaveBeenCalled();
  });

  it('shows AddIcon when isActive is false', () => {
    const props = {
      ...defaultProps,
      showAddButton: true,
      isActive: false,
    };

    render(<RecipeCard {...props} />);

    const addIcon = screen.getByTestId(dataTestIds.components.recipeCard.addIcon);
    expect(addIcon).toBeInTheDocument();

    // RemoveIcon should not be present
    expect(screen.queryByTestId(dataTestIds.components.recipeCard.removeIcon)).not.toBeInTheDocument();
  });

  it('shows RemoveIcon when isActive is true', () => {
    const props = {
      ...defaultProps,
      showAddButton: true,
      isActive: true,
    };

    render(<RecipeCard {...props} />);

    const removeIcon = screen.getByTestId(dataTestIds.components.recipeCard.removeIcon);
    expect(removeIcon).toBeInTheDocument();

    // AddIcon should not be present
    expect(screen.queryByTestId(dataTestIds.components.recipeCard.addIcon)).not.toBeInTheDocument();
  });

  it('disables add button when isAddButtonDisabled is true', () => {
    const props = {
      ...defaultProps,
      showAddButton: true,
      isAddButtonDisabled: true,
    };

    render(<RecipeCard {...props} />);

    const addButton = screen.getByTestId(dataTestIds.components.recipeCard.addButton);
    expect(addButton).toBeDisabled();
  });
});
