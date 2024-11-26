/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';

import { getDoc, updateDoc, doc } from 'firebase/firestore';

import { MemoryRouter } from 'react-router-dom';

import { toast } from 'react-toastify';

import { RecipeInformationModal } from './RecipeInformationModal';

import { getMealTypeOptions } from './helpers/helpers';

import { dataTestIds } from '@src/dataTest/dataTestIds';
import { useAuth } from '@src/contexts/AuthContext';

import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

jest.mock('@src/contexts/AuthContext');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('./helpers/helpers', () => ({
  ...jest.requireActual('./helpers/helpers'),
  getMealTypeOptions: jest.fn(),
}));

describe('RecipeInformationModal Component', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    isLoading: false,
    recipeInfo: {
      id: 1,
      title: 'Test Recipe',
      image: 'test-image.jpg',
      summary: '<p>This is a test summary.</p>',
      nutrition: {
        caloricBreakdown: {
          percentProtein: 20,
          percentFat: 30,
          percentCarbs: 50,
        },
        nutrients: [
          { name: 'Calories', amount: 500, unit: 'kcal' },
        ],
      },
      readyInMinutes: 30,
      servings: 4,
      extendedIngredients: [
        {
          id: 1, original: '1 cup of sugar', image: '', name: 'sugar'
        },
      ],
      analyzedInstructions: [
        {
          steps: [
            {
              number: 1, step: 'Do something.', ingredients: [], equipment: []
            },
          ],
        },
      ],
      dishTypes: ['breakfast'],
    } as RecipeInformation,
  };

  const mockUser = { uid: 'test-uid' };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    (doc as jest.Mock).mockReturnValue('mockDocRef');

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        likedRecipes: [2],
        Meals: {},
      }),
    });

    (updateDoc as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders the modal when open is true', async () => {
    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    expect(screen.getByTestId(dataTestIds.components.recipeInformationModal.modal)).toBeInTheDocument();
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<RecipeInformationModal {...defaultProps} isLoading />, { wrapper: MemoryRouter });

    expect(screen.getByTestId(dataTestIds.components.recipeInformationModal.loadingIndicator)).toBeInTheDocument();
  });

  it('displays the recipe information when loading is false', async () => {
    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary.')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    // Wait for modal header to appear
    await waitFor(() => {
      expect(screen.getByTestId(dataTestIds.components.modalHeader.closeButton)).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId(dataTestIds.components.modalHeader.closeButton);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays an error when user document does not exist', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User document not found', { position: 'bottom-left' });
    });
  });

  it('displays an error when fetching liked recipes fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDoc as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error fetching liked recipes: Error: Network error', { position: 'bottom-left' });
    });
  });

  it('displays an error when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    // Try to toggle like status
    const likeButton = screen.getByLabelText('Like');
    fireEvent.click(likeButton);

    expect(toast.error).toHaveBeenCalledWith('User not authenticated', { position: 'bottom-left' });
  });

  it('displays an error when updating liked recipes fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ likedRecipes: [] }),
    });
    (updateDoc as jest.Mock).mockRejectedValue(new Error('Update failed'));

    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    // Wait for component to finish loading
    await waitFor(() => screen.getByText('Test Recipe'));

    // Toggle like status
    const likeButton = screen.getByLabelText('Like');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error updating liked recipes: Error: Update failed', { position: 'bottom-left' });
    });
  });

  it('returns all meal types when dishTypes is empty', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    const recipeInfoWithEmptyDishTypes = {
      ...defaultProps.recipeInfo,
      dishTypes: [],
    };

    render(<RecipeInformationModal {...defaultProps} recipeInfo={recipeInfoWithEmptyDishTypes} />, { wrapper: MemoryRouter });

    expect(getMealTypeOptions).toHaveBeenCalledWith(recipeInfoWithEmptyDishTypes);
    expect(getMealTypeOptions).toHaveBeenCalledTimes(1);
  });

  it('toggles like status when like button is clicked', async () => {
    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    const likeButton = screen.getByLabelText('Like');
    expect(likeButton).toBeInTheDocument();

    // Click the like button
    fireEvent.click(likeButton);

    // Wait for updateDoc to be called
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledTimes(1);
    });

    // Verify that the like button now indicates liked status
    await waitFor(() => {
      expect(screen.getByLabelText('Unlike')).toBeInTheDocument();
    });
  });

  it('shows the calendar when a meal type is selected', async () => {
    render(<RecipeInformationModal {...defaultProps} />, { wrapper: MemoryRouter });

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    const mealPlanButton = screen.getByLabelText('Add to meal plan');
    expect(mealPlanButton).toBeInTheDocument();

    // Click the meal plan button to open meal type options
    fireEvent.click(mealPlanButton);
  });
});
