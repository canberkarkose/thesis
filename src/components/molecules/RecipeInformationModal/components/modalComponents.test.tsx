/* eslint-disable max-len */
import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';

import { getDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { dataTestIds } from '../../../../dataTest/dataTestIds';

import { IngredientsList } from './IngredientsList';
import { InstructionsStepper } from './InstructionsStepper';

import { MealPlanCalendar } from './MealPlanCalendar';

import { ModalHeader } from './ModalHeader';

import { RecipeImageSection } from './RecipeImageSection';

import { useAuth } from '@src/contexts/AuthContext';
import { getLastSunday, getNextSaturday } from '@src/helpers/dateHelpers';
import { addMealToUserPlan } from '@src/services/auth-service';

jest.mock('@src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@src/services/auth-service', () => ({
  addMealToUserPlan: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@src/helpers/dateHelpers', () => ({
  getLastSunday: jest.fn((date) => {
    const lastSunday = new Date(date);
    lastSunday.setDate(date.getDate() - date.getDay());
    return lastSunday;
  }),
  getNextSaturday: jest.fn((date) => {
    const nextSaturday = new Date(date);
    nextSaturday.setDate(date.getDate() + (6 - date.getDay()));
    return nextSaturday;
  }),
}));

// Mock data for testing
const ingredientsWithImages = [
  {
    id: 1,
    original: '1 cup of sugar',
    image: 'sugar.png',
    name: 'sugar',
  },
  {
    id: 2,
    original: '2 eggs',
    image: 'eggs.png',
    name: 'eggs',
  },
];

const ingredientsWithoutImages = [
  {
    id: 3,
    original: '1 tablespoon of vanilla extract',
    image: '',
    name: 'vanilla extract',
  },
  {
    id: 4,
    original: '3 cups of flour',
    image: '',
    name: 'flour',
  },
];

describe('IngredientsList Component', () => {
  test('renders ingredients with images correctly', () => {
    render(<IngredientsList extendedIngredients={ingredientsWithImages} />);

    // Check container
    const container = screen.getByTestId(dataTestIds.components.ingredientsList.container);
    expect(container).toBeInTheDocument();

    // Check InfoTitle
    expect(screen.getByText('Ingredients')).toBeInTheDocument();

    // Check each ingredient item
    ingredientsWithImages.forEach((ingredient) => {
      const ingredientItem = screen.getByTestId(
        dataTestIds.components.ingredientsList.ingredientItem(ingredient.id)
      );
      expect(ingredientItem).toBeInTheDocument();

      // Check ingredient text
      expect(screen.getByText(ingredient.original)).toBeInTheDocument();

      // Check ingredient image
      const ingredientImage = screen.getByTestId(
        dataTestIds.components.ingredientsList.ingredientImage(ingredient.id)
      ) as HTMLImageElement;
      expect(ingredientImage).toBeInTheDocument();
      expect(ingredientImage.src).toBe(
        `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
      );
      expect(ingredientImage.alt).toBe(ingredient.name);
    });
  });

  test('renders ingredients without images correctly', () => {
    render(<IngredientsList extendedIngredients={ingredientsWithoutImages} />);

    // Check container
    const container = screen.getByTestId(dataTestIds.components.ingredientsList.container);
    expect(container).toBeInTheDocument();

    // Check InfoTitle
    expect(screen.getByText('Ingredients')).toBeInTheDocument();

    // Check each ingredient item
    ingredientsWithoutImages.forEach((ingredient) => {
      const ingredientItem = screen.getByTestId(
        dataTestIds.components.ingredientsList.ingredientItem(ingredient.id)
      );
      expect(ingredientItem).toBeInTheDocument();

      // Check ingredient text
      expect(screen.getByText(ingredient.original)).toBeInTheDocument();

      // Check placeholder image
      const placeholderImage = screen.getByTestId(
        dataTestIds.components.ingredientsList.placeholderImage(ingredient.id)
      );
      expect(placeholderImage).toBeInTheDocument();
      expect(placeholderImage).toHaveTextContent('No Image');
    });
  });

  test('renders mixed ingredients correctly', () => {
    const mixedIngredients = [...ingredientsWithImages, ...ingredientsWithoutImages];
    render(<IngredientsList extendedIngredients={mixedIngredients} />);

    // Check container
    const container = screen.getByTestId(dataTestIds.components.ingredientsList.container);
    expect(container).toBeInTheDocument();

    // Check InfoTitle
    expect(screen.getByText('Ingredients')).toBeInTheDocument();

    // Check each ingredient item
    mixedIngredients.forEach((ingredient) => {
      const ingredientItem = screen.getByTestId(
        dataTestIds.components.ingredientsList.ingredientItem(ingredient.id)
      );
      expect(ingredientItem).toBeInTheDocument();

      // Check ingredient text
      expect(screen.getByText(ingredient.original)).toBeInTheDocument();

      if (ingredient.image) {
        // Check ingredient image
        const ingredientImage = screen.getByTestId(
          dataTestIds.components.ingredientsList.ingredientImage(ingredient.id)
        ) as HTMLImageElement;
        expect(ingredientImage).toBeInTheDocument();
        expect(ingredientImage.src).toBe(
          `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
        );
        expect(ingredientImage.alt).toBe(ingredient.name);
      } else {
        // Check placeholder image
        const placeholderImage = screen.getByTestId(
          dataTestIds.components.ingredientsList.placeholderImage(ingredient.id)
        );
        expect(placeholderImage).toBeInTheDocument();
        expect(placeholderImage).toHaveTextContent('No Image');
      }
    });
  });
});

describe('InstructionsStepper Component', () => {
  const mockSetActiveStep = jest.fn();

  const instructionsMock = [
    {
      number: 1,
      step: 'Preheat the oven to 350°F (175°C).',
      ingredients: [
        { id: 1, name: 'sugar', image: 'sugar.png' },
        { id: 2, name: 'flour', image: '' }, // No image
      ],
      equipment: [
        { id: 1, name: 'oven', image: 'oven.png' },
        { id: 2, name: 'mixing bowl', image: '' }, // No image
      ],
    },
    {
      number: 2,
      step: 'Mix the ingredients thoroughly.',
      ingredients: [],
      equipment: [
        { id: 3, name: 'whisk', image: 'whisk.png' },
      ],
    },
  ];

  beforeEach(() => {
    mockSetActiveStep.mockClear();
  });

  test('renders CustomStepButton and handles onClick correctly', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    // Check that the correct number of step buttons are rendered
    const stepButtons = screen.getAllByRole('button');
    expect(stepButtons).toHaveLength(instructionsMock.length);

    // Click on the second step button
    fireEvent.click(stepButtons[1]);

    // Expect setActiveStep to have been called with index 1
    expect(mockSetActiveStep).toHaveBeenCalledWith(1);
  });

  test('renders step content when instructions[activeStep] is present', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    // Check that the step content is rendered
    expect(screen.getByText(instructionsMock[0].step)).toBeInTheDocument();
  });

  test('renders InstructionListImage when ingredient has image', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    // Check that the ingredient with image is rendered
    const ingredientImage = screen.getByAltText('sugar') as HTMLImageElement;
    expect(ingredientImage).toBeInTheDocument();
    expect(ingredientImage.src).toBe('https://spoonacular.com/cdn/ingredients_100x100/sugar.png');
  });

  test('renders InstructionListImage when equipment has image', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    // Check that the equipment with image is rendered
    const equipmentImage = screen.getByAltText('oven') as HTMLImageElement;
    expect(equipmentImage).toBeInTheDocument();
    expect(equipmentImage.src).toBe('https://spoonacular.com/cdn/equipment_100x100/oven.png');
  });

  test('renders PlaceholderInstructionListImage when equipment has no image', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    // Check that the equipment without image renders placeholder
    const placeholderImages = screen.getAllByText('No Image');
    expect(placeholderImages).toHaveLength(2);
  });

  test('renders InstructionListContainer with justify-content center when numLists is 1', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={1}
        setActiveStep={mockSetActiveStep}
      />
    );

    const listContainer = screen.getByTestId(dataTestIds.components.instructionsStepper.container);
    expect(listContainer).toBeInTheDocument();
  });

  test('renders InstructionListContainer with justify-content space-between when numLists is 2', () => {
    render(
      <InstructionsStepper
        instructions={instructionsMock}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    const listContainer = screen.getByTestId(dataTestIds.components.instructionsStepper.container);
    expect(listContainer).toBeInTheDocument();
  });
});

describe('MealPlanCalendar Component', () => {
  const mockOnClose = jest.fn();

  const mockUser = {
    uid: 'user123',
  };

  const mockRecipeInfo = {
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
  };

  const mockMealsData = {
    Meals: {
      '2024-05-01': {
        breakfast: {},
        lunch: {},
        dinner: {},
      },
      '2024-05-02': {
        breakfast: {},
        lunch: {},
        dinner: {},
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockMealsData,
    });
  });

  test('renders loading state initially', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Check for loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  test('renders date picker after loading', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('disables dates that are already occupied', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const occupiedDate = screen.getByText('1');
    expect(occupiedDate).toBeDisabled();
  });

  test('allows selecting an available date', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // click to any available mui button
    const availableDate = screen.getByText('15');
    fireEvent.click(availableDate);
  });

  test('Add Meal button is disabled when no date is selected', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /add meal/i });
      expect(addButton).toBeDisabled();
    });
  });

  test('shows error toast if fetching disabled dates fails', async () => {
    (getDoc as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(toast.error).toHaveBeenCalledWith(
      'Failed to fetch calendar data. Please try again later.',
      { position: 'bottom-left' }
    );
  });

  test('Cancel button calls onClose', async () => {
    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
  test('disables dates after maxDate', async () => {
    // Mock getLastSunday and getNextSaturday to control minDate and maxDate
    (getLastSunday as jest.Mock).mockReturnValue(new Date('2024-04-28')); // Last Sunday
    (getNextSaturday as jest.Mock).mockReturnValue(new Date('2024-05-19')); // Next Saturday after adding 21 days

    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Assuming maxDate is 2024-05-19, attempt to find a date after that, e.g., 20
    const disabledDate = screen.getByText('20');
    expect(disabledDate).toBeDisabled();
  });

  test('handles adding a meal successfully', async () => {
    (addMealToUserPlan as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Select an available date, e.g., 15
    const availableDate = screen.getByText('15');
    fireEvent.click(availableDate);

    // Click the Add Meal button
    const addButton = screen.getByRole('button', { name: /add meal/i });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addMealToUserPlan).toHaveBeenCalledWith(
        mockUser.uid,
        '2024-05-15',
        'lunch',
        mockRecipeInfo
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Lunch added to your plan!',
        { position: 'bottom-left' }
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles adding a meal failure', async () => {
    (addMealToUserPlan as jest.Mock).mockRejectedValueOnce(new Error('Add meal error'));

    render(
      <MealPlanCalendar
        onClose={mockOnClose}
        mealType='lunch'
        recipeInfo={mockRecipeInfo}
      />
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Select an available date, e.g., 15
    const availableDate = screen.getByText('15');
    fireEvent.click(availableDate);

    // Click the Add Meal button
    const addButton = screen.getByRole('button', { name: /add meal/i });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addMealToUserPlan).toHaveBeenCalledWith(
        mockUser.uid,
        '2024-05-15',
        'lunch',
        mockRecipeInfo
      );
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to add meal to your plan. Please try again.',
        { position: 'bottom-left' }
      );
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

describe('ModalHeader Component', () => {
  const mockOnClose = jest.fn();
  const mockHandleLikeToggle = jest.fn();
  const mockHandleMealTypeSelect = jest.fn();

  const mealTypeOptionsMock = ['Breakfast', 'Lunch', 'Dinner'];

  const renderComponent = (isLiked = false, onMealTypeSelect = mockHandleMealTypeSelect) => {
    render(
      <ModalHeader
        onClose={mockOnClose}
        title='Test Recipe'
        isLiked={isLiked}
        handleLikeToggle={mockHandleLikeToggle}
        mealTypeOptions={mealTypeOptionsMock}
        onMealTypeSelect={onMealTypeSelect}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the title correctly', () => {
    renderComponent();
    const titleElement = screen.getByTestId(dataTestIds.components.modalHeader.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Recipe');
  });

  test('clicking the calendar icon opens the meal type menu', () => {
    renderComponent();

    // The CalendarMonthIcon is inside an IconButton with a Tooltip titled 'Add to meal plan'
    const calendarButton = screen.getByRole('button', { name: /add to meal plan/i });
    expect(calendarButton).toBeInTheDocument();

    // Click the calendar icon button
    fireEvent.click(calendarButton);

    // After clicking, the menu should be open with the meal type options
    mealTypeOptionsMock.forEach((mealType) => {
      const menuItem = screen.getByText(`Add to ${mealType}`);
      expect(menuItem).toBeInTheDocument();
    });
  });

  test('clicking a meal type menu item closes the menu and calls onMealTypeSelect with correct argument', () => {
    renderComponent();

    // Open the meal type menu
    const calendarButton = screen.getByRole('button', { name: /add to meal plan/i });
    fireEvent.click(calendarButton);

    // Select a meal type, e.g., 'Lunch'
    const selectedMealType = 'Lunch';
    const menuItem = screen.getByText(`Add to ${selectedMealType}`);
    fireEvent.click(menuItem);

    // Ensure the menu is closed
    const menu = screen.queryByRole('menu');
    expect(menu).not.toBeInTheDocument();

    // Ensure onMealTypeSelect is called with 'Lunch'
    expect(mockHandleMealTypeSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleMealTypeSelect).toHaveBeenCalledWith(selectedMealType);
  });

  test('handleMealTypeMenuClose is called when a meal type is selected', () => {
    renderComponent();

    // Open the meal type menu
    const calendarButton = screen.getByRole('button', { name: /add to meal plan/i });
    fireEvent.click(calendarButton);

    // Select a meal type, e.g., 'Dinner'
    const selectedMealType = 'Dinner';
    const menuItem = screen.getByText(`Add to ${selectedMealType}`);
    fireEvent.click(menuItem);

    // Ensure the menu is closed
    const menu = screen.queryByRole('menu');
    expect(menu).not.toBeInTheDocument();
  });

  test('does not call onMealTypeSelect if it is not provided', () => {
    render(
      <ModalHeader
        onClose={mockOnClose}
        title='Test Recipe'
        isLiked={false}
        handleLikeToggle={mockHandleLikeToggle}
        mealTypeOptions={mealTypeOptionsMock}
        // onMealTypeSelect is not provided
      />
    );

    // Open the meal type menu
    const calendarButton = screen.getByRole('button', { name: /add to meal plan/i });
    fireEvent.click(calendarButton);

    // Select a meal type, e.g., 'Breakfast'
    const selectedMealType = 'Breakfast';
    const menuItem = screen.getByText(`Add to ${selectedMealType}`);
    fireEvent.click(menuItem);

    // Ensure the menu is closed
    const menu = screen.queryByRole('menu');
    expect(menu).not.toBeInTheDocument();

    // Ensure onMealTypeSelect is not called
    expect(mockHandleMealTypeSelect).not.toHaveBeenCalled();
  });

  test('renders the like button correctly based on isLiked prop', () => {
    // Test when isLiked is false
    renderComponent(false);
    const likeButton = screen.getByRole('button', { name: /like/i });
    expect(likeButton).toBeInTheDocument();
    // Assuming FavoriteBorderIcon has a specific test ID or accessible name
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();

    // Cleanup and re-render with isLiked true
    jest.clearAllMocks();
    render(
      <ModalHeader
        onClose={mockOnClose}
        title='Test Recipe'
        isLiked
        handleLikeToggle={mockHandleLikeToggle}
        mealTypeOptions={mealTypeOptionsMock}
        onMealTypeSelect={mockHandleMealTypeSelect}
      />
    );

    const unlikeButton = screen.getByRole('button', { name: /unlike/i });
    expect(unlikeButton).toBeInTheDocument();
    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
  });

  test('clicking the like button calls handleLikeToggle', () => {
    renderComponent();

    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);

    expect(mockHandleLikeToggle).toHaveBeenCalledTimes(1);
  });

  test('clicking the close button calls onClose', () => {
    renderComponent();

    const closeButton = screen.getByTestId(dataTestIds.components.modalHeader.closeButton);
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('RecipeImageSection Component', () => {
  const mockTitle = 'Delicious Pasta';
  const mockSummary = '<p>This is a <strong>delicious</strong> pasta recipe.</p>';

  test('renders RecipeImage when image prop is provided', () => {
    const mockImage = 'https://example.com/pasta.jpg';

    render(
      <RecipeImageSection
        image={mockImage}
        title={mockTitle}
        summary={mockSummary}
      />
    );

    // Get the container
    const container = screen.getByTestId(dataTestIds.components.recipeImageSection.container);
    expect(container).toBeInTheDocument();

    // Get the RecipeImage by test ID
    const recipeImage = screen.getByTestId(dataTestIds.components.recipeImageSection.image) as HTMLImageElement;
    expect(recipeImage).toBeInTheDocument();
    expect(recipeImage).toHaveAttribute('src', mockImage);
    expect(recipeImage).toHaveAttribute('alt', mockTitle);

    // Ensure PlaceholderImage is not rendered
    const placeholderImage = screen.queryByTestId(dataTestIds.components.recipeImageSection.placeholderImage);
    expect(placeholderImage).not.toBeInTheDocument();

    // Check that the summary is rendered correctly
    const description = screen.getByTestId(dataTestIds.components.recipeImageSection.description);
    expect(description).toBeInTheDocument();
    expect(description).toContainHTML(mockSummary);
  });

  test('renders PlaceholderImage when image prop is not provided', () => {
    render(
      <RecipeImageSection
        image=''
        title={mockTitle}
        summary={mockSummary}
      />
    );

    // Get the container
    const container = screen.getByTestId(dataTestIds.components.recipeImageSection.container);
    expect(container).toBeInTheDocument();

    // Ensure RecipeImage is not rendered
    const recipeImage = screen.queryByTestId(dataTestIds.components.recipeImageSection.image);
    expect(recipeImage).not.toBeInTheDocument();

    // Get the PlaceholderImage by test ID
    const placeholderImage = screen.getByTestId(dataTestIds.components.recipeImageSection.placeholderImage);
    expect(placeholderImage).toBeInTheDocument();

    // Check that the summary is rendered correctly
    const description = screen.getByTestId(dataTestIds.components.recipeImageSection.description);
    expect(description).toBeInTheDocument();
    expect(description).toContainHTML(mockSummary);
  });
});
