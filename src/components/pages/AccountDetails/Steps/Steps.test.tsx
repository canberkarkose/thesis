import { render, screen, fireEvent } from '@testing-library/react';

import { AccountDetailsStepOne } from './AccountDetailsStepOne';
import { AccountDetailsStepTwo } from './AccountDetailsStepTwo';
import { AccountDetailsStepThree } from './AccountDetailsStepThree';
import { FinalReviewStep } from './FinalReviewStep';

jest.mock('./constants', () => ({
  dietOptions: [
    {
      value: 'vegetarian', label: 'Vegetarian', description: 'Plant-based meals', icon: '🥗'
    },
    {
      value: 'vegan', label: 'Vegan', description: 'No animal products', icon: '🌱'
    },
    {
      value: 'keto', label: 'Keto', description: 'Low-carb, high-fat diet', icon: '🥓'
    },
  ],
  intolerancesTypes: ['Dairy', 'Gluten', 'Soy', 'Eggs'],
  cuisines: ['Italian', 'Mexican', 'Chinese', 'Indian'],
  findDietLabel: jest.fn((diet) => diet),
}));

describe('AccountDetailsStepOne', () => {
  const mockHandleNext = jest.fn();
  const mockUpdateDietDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all diet options', () => {
    render(
      <AccountDetailsStepOne
        handleNext={mockHandleNext}
        updateDietDetails={mockUpdateDietDetails}
        userDiet=''
      />
    );

    expect(screen.getByText(/Select Your Nutrition Path/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vegetarian/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vegan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Keto/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('pre-selects the userDiet value if provided', () => {
    render(
      <AccountDetailsStepOne
        handleNext={mockHandleNext}
        updateDietDetails={mockUpdateDietDetails}
        userDiet='keto'
      />
    );

    expect(screen.getByLabelText(/Keto/i)).toHaveAttribute('aria-pressed', 'true');
  });

  it('updates the selected diet when a new option is clicked', () => {
    render(
      <AccountDetailsStepOne
        handleNext={mockHandleNext}
        updateDietDetails={mockUpdateDietDetails}
        userDiet=''
      />
    );

    const veganOption = screen.getByLabelText(/Vegan/i);
    fireEvent.click(veganOption);

    expect(veganOption).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls updateDietDetails and handleNext when the Next button is clicked', () => {
    render(
      <AccountDetailsStepOne
        handleNext={mockHandleNext}
        updateDietDetails={mockUpdateDietDetails}
        userDiet=''
      />
    );

    const vegetarianOption = screen.getByLabelText(/Vegetarian/i);
    fireEvent.click(vegetarianOption);

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(mockUpdateDietDetails).toHaveBeenCalledWith('vegetarian');
    expect(mockHandleNext).toHaveBeenCalled();
  });
});

describe('AccountDetailsStepTwo', () => {
  const mockHandleBack = jest.fn();
  const mockHandleNext = jest.fn();
  const mockUpdateIntolerances = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all intolerance options', () => {
    render(
      <AccountDetailsStepTwo
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateIntolerances={mockUpdateIntolerances}
        intolerances={[]}
      />
    );

    expect(screen.getByText(/Select Your Intolerances/i)).toBeInTheDocument();
    expect(screen.getByText(/Dairy/i)).toBeInTheDocument();
    expect(screen.getByText(/Gluten/i)).toBeInTheDocument();
    expect(screen.getByText(/Soy/i)).toBeInTheDocument();
    expect(screen.getByText(/Eggs/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('pre-selects provided intolerances', () => {
    render(
      <AccountDetailsStepTwo
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateIntolerances={mockUpdateIntolerances}
        intolerances={['Dairy', 'Gluten']}
      />
    );

    expect(screen.getByText(/Dairy/i)).toHaveClass('selected');
    expect(screen.getByText(/Gluten/i)).toHaveClass('selected');
    expect(screen.getByText(/Soy/i)).not.toHaveClass('selected');
    expect(screen.getByText(/Eggs/i)).not.toHaveClass('selected');
  });

  it('toggles intolerance selection when clicked', () => {
    render(
      <AccountDetailsStepTwo
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateIntolerances={mockUpdateIntolerances}
        intolerances={[]}
      />
    );

    const dairyButton = screen.getByText(/Dairy/i);
    fireEvent.click(dairyButton);
    expect(dairyButton).toHaveClass('selected');

    fireEvent.click(dairyButton);
    expect(dairyButton).not.toHaveClass('selected');
  });

  it('calls updateIntolerances and handleNext on Next button click', () => {
    render(
      <AccountDetailsStepTwo
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateIntolerances={mockUpdateIntolerances}
        intolerances={[]}
      />
    );

    const glutenButton = screen.getByText(/Gluten/i);
    fireEvent.click(glutenButton);

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(mockUpdateIntolerances).toHaveBeenCalledWith(['Gluten']);
    expect(mockHandleNext).toHaveBeenCalled();
  });

  it('calls handleBack on Back button click', () => {
    render(
      <AccountDetailsStepTwo
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateIntolerances={mockUpdateIntolerances}
        intolerances={[]}
      />
    );

    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockHandleBack).toHaveBeenCalled();
  });
});

describe('AccountDetailsStepThree', () => {
  const mockHandleBack = jest.fn();
  const mockHandleNext = jest.fn();
  const mockUpdateCuisines = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all cuisine options', () => {
    render(
      <AccountDetailsStepThree
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateCuisines={mockUpdateCuisines}
        cuisinePreferences={{ includedCuisines: [], excludedCuisines: [] }}
      />
    );

    expect(screen.getByText(/Select Your Cuisine Preferences:/i)).toBeInTheDocument();
    expect(screen.getByText(/Italian/i)).toBeInTheDocument();
    expect(screen.getByText(/Mexican/i)).toBeInTheDocument();
    expect(screen.getByText(/Chinese/i)).toBeInTheDocument();
    expect(screen.getByText(/Indian/i)).toBeInTheDocument();
  });

  it('allows including a cuisine', () => {
    render(
      <AccountDetailsStepThree
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateCuisines={mockUpdateCuisines}
        cuisinePreferences={{ includedCuisines: [], excludedCuisines: [] }}
      />
    );

    const includeButton = screen.getAllByRole('button', { name: /Include/i })[0];
    fireEvent.click(includeButton);

    expect(includeButton).toHaveClass('MuiButton-contained');
  });

  it('allows excluding a cuisine', () => {
    render(
      <AccountDetailsStepThree
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateCuisines={mockUpdateCuisines}
        cuisinePreferences={{ includedCuisines: [], excludedCuisines: [] }}
      />
    );

    const excludeButton = screen.getAllByRole('button', { name: /Exclude/i })[0];
    fireEvent.click(excludeButton);

    expect(excludeButton).toHaveClass('MuiButton-contained');
  });

  it('calls handleBack when Back button is clicked', () => {
    render(
      <AccountDetailsStepThree
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateCuisines={mockUpdateCuisines}
        cuisinePreferences={{ includedCuisines: [], excludedCuisines: [] }}
      />
    );

    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockHandleBack).toHaveBeenCalled();
  });

  it('calls updateCuisines and handleNext when Next button is clicked', () => {
    render(
      <AccountDetailsStepThree
        handleBack={mockHandleBack}
        handleNext={mockHandleNext}
        updateCuisines={mockUpdateCuisines}
        cuisinePreferences={{ includedCuisines: [], excludedCuisines: [] }}
      />
    );

    const includeButton = screen.getAllByRole('button', { name: /Include/i })[0];
    fireEvent.click(includeButton);

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(mockUpdateCuisines).toHaveBeenCalled();
    expect(mockHandleNext).toHaveBeenCalled();
  });
});

describe('FinalReviewStep', () => {
  const mockHandleBack = jest.fn();
  const mockHandleSubmit = jest.fn();

  const mockData = {
    diet: 'vegetarian',
    intolerances: ['Dairy', 'Gluten'],
    cuisinePreferences: {
      includedCuisines: ['Italian', 'Mexican', 'Indian', 'Chinese'],
      excludedCuisines: ['Japanese', 'French'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the final review section with provided data', () => {
    render(
      <FinalReviewStep
        handleBack={mockHandleBack}
        handleSubmit={mockHandleSubmit}
        data={mockData}
      />
    );

    expect(screen.getByText(/Final Review of Your Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Diet Preference:/i)).toBeInTheDocument();
    expect(screen.getByText(/vegetarian/i)).toBeInTheDocument();
    expect(screen.getByText(/Intolerances:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dairy, Gluten/i)).toBeInTheDocument();
    expect(screen.getByText(/Included Cuisines:/i)).toBeInTheDocument();
    expect(screen.getByText(/Italian, Mexican, Indian/i)).toBeInTheDocument();
    expect(screen.getByText(/Excluded Cuisines:/i)).toBeInTheDocument();
    expect(screen.getByText(/Japanese, French/i)).toBeInTheDocument();
  });

  it('renders tooltips when cuisines exceed the max visible items', () => {
    render(
      <FinalReviewStep
        handleBack={mockHandleBack}
        handleSubmit={mockHandleSubmit}
        data={mockData}
      />
    );

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('shows "None" for empty intolerances or cuisines', () => {
    render(
      <FinalReviewStep
        handleBack={mockHandleBack}
        handleSubmit={mockHandleSubmit}
        data={{
          ...mockData,
          intolerances: [],
          cuisinePreferences: {
            includedCuisines: [],
            excludedCuisines: [],
          },
        }}
      />
    );

    expect(screen.getAllByText(/None/i)).toBeTruthy();
  });

  it('calls handleBack when Back button is clicked', () => {
    render(
      <FinalReviewStep
        handleBack={mockHandleBack}
        handleSubmit={mockHandleSubmit}
        data={mockData}
      />
    );

    fireEvent.click(screen.getByText(/Back/i));
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit when Confirm & Submit button is clicked', () => {
    render(
      <FinalReviewStep
        handleBack={mockHandleBack}
        handleSubmit={mockHandleSubmit}
        data={mockData}
      />
    );

    fireEvent.click(screen.getByText(/Confirm & Submit/i));
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});
