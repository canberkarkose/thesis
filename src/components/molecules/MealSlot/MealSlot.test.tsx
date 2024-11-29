/* eslint-disable react/jsx-props-no-spreading */

import { render, screen, fireEvent } from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { MealSlot } from './MealSlot';

describe('MealSlot Component', () => {
  const defaultProps = {
    slot: {
      label: 'Breakfast',
      recipe: undefined,
    },
    index: 0,
    date: '2021-01-01',
    isDaily: false,
    isAddable: false,
    slotOpacity: 1,
    recipeToAdd: null,
    handleSlotClick: jest.fn(),
    onSeeMore: jest.fn(),
    editMode: false,
    handleDeleteClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders EmptySlotText when there is no recipe and not addable', () => {
    render(<MealSlot {...defaultProps} />);

    expect(
      screen.getByTestId(dataTestIds.components.mealSlot.emptyText(defaultProps.index))
    ).toHaveTextContent('Empty');
  });

  it('renders Add Button when there is no recipe and recipeToAdd is provided and isAddable is true', () => {
    const props = {
      ...defaultProps,
      recipeToAdd: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      isAddable: true,
    };

    render(<MealSlot {...props} />);

    const addButton = screen.getByTestId(dataTestIds.components.mealSlot.addButton(props.index));
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(props.handleSlotClick).toHaveBeenCalledWith(props.index, props.date);
  });

  it('renders Recipe Image and Title when there is a recipe', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Lunch',
        recipe: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      },
      isDaily: true,
    };

    render(<MealSlot {...props} />);

    const recipeImage = screen.getByTestId(
      dataTestIds.components.mealSlot.recipeImage(props.index)
    );
    expect(recipeImage).toBeInTheDocument();
    expect(recipeImage).toHaveAttribute('src', 'test.jpg');
    expect(recipeImage).toHaveAttribute('alt', 'Test Recipe');

    const recipeTitle = screen.getByTestId(
      dataTestIds.components.mealSlot.recipeTitle(props.index)
    );
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeTitle).toHaveTextContent('Test Recipe');
  });

  it('does not render RecipeTitleContainer when isDaily is false', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Lunch',
        recipe: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      },
      isDaily: false,
    };

    render(<MealSlot {...props} />);

    const recipeImage = screen.getByTestId(
      dataTestIds.components.mealSlot.recipeImage(props.index)
    );
    expect(recipeImage).toBeInTheDocument();

    const recipeTitle = screen.queryByTestId(
      dataTestIds.components.mealSlot.recipeTitle(props.index)
    );
    expect(recipeTitle).not.toBeInTheDocument();
  });

  it('renders Remove Button when editMode is true and there is a recipe', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Lunch',
        recipe: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      },
      editMode: true,
    };

    render(<MealSlot {...props} />);

    const removeButton = screen.getByTestId(
      dataTestIds.components.mealSlot.removeButton(props.index)
    );
    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton);
    expect(props.handleDeleteClick).toHaveBeenCalledWith(props.index, props.date);
  });

  it('calls onSeeMore when clicking on the MealSlot with a recipe', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Lunch',
        recipe: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      },
      editMode: false,
      recipeToAdd: null,
    };

    render(<MealSlot {...props} />);

    const mealSlot = screen.getByTestId(
      dataTestIds.components.mealSlot.container(props.index)
    );
    expect(mealSlot).toBeInTheDocument();

    fireEvent.click(mealSlot);
    expect(props.onSeeMore).toHaveBeenCalledWith(1);
  });

  it('does not call onSeeMore when in editMode', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Lunch',
        recipe: { id: 1, title: 'Test Recipe', image: 'test.jpg' },
      },
      editMode: true,
    };

    render(<MealSlot {...props} />);

    const mealSlot = screen.getByTestId(
      dataTestIds.components.mealSlot.container(props.index)
    );
    expect(mealSlot).toBeInTheDocument();

    fireEvent.click(mealSlot);
    expect(props.onSeeMore).not.toHaveBeenCalled();
  });

  it('applies correct cursor style when clickable', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Dinner',
        recipe: { id: 2, title: 'Another Recipe', image: 'another.jpg' },
      },
      editMode: false,
      recipeToAdd: null,
    };

    render(<MealSlot {...props} />);

    const mealSlot = screen.getByTestId(
      dataTestIds.components.mealSlot.container(props.index)
    );
    expect(mealSlot).toHaveStyle('cursor: pointer');
  });

  it('displays Tooltip with recipe title when not isDaily', async () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Snack',
        recipe: { id: 3, title: 'Snack Recipe', image: 'snack.jpg' },
      },
      isDaily: false,
    };

    render(<MealSlot {...props} />);

    // Simulate hover to trigger the Tooltip
    const mealSlot = screen.getByTestId(
      dataTestIds.components.mealSlot.container(props.index)
    );
    fireEvent.mouseOver(mealSlot);

    // Wait for the Tooltip to appear
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Snack Recipe');
  });

  it('does not display Tooltip when isDaily is true', () => {
    const props = {
      ...defaultProps,
      slot: {
        label: 'Snack',
        recipe: { id: 3, title: 'Snack Recipe', image: 'snack.jpg' },
      },
      isDaily: true,
    };

    render(<MealSlot {...props} />);

    const mealSlot = screen.getByTestId(
      dataTestIds.components.mealSlot.container(props.index)
    );
    fireEvent.mouseOver(mealSlot);

    const tooltip = screen.queryByRole('tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });
});
