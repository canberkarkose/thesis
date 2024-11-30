/* eslint-disable @typescript-eslint/no-explicit-any */
// GroceryTable.test.tsx

import {
  render, screen, fireEvent, within
} from '@testing-library/react';

import '@testing-library/jest-dom';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

import { GroceryTable } from './GroceryTable';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock styled components
jest.mock('./GroceryTable.styles', () => ({
  GroceryTableContainer: ({ children, hasCheckboxes }: any) => (
    <div data-testid='grocery-table-container' data-has-checkboxes={hasCheckboxes}>
      {children}
    </div>
  ),
}));

// Mock TruncatedText component
jest.mock('@components/atoms/TruncatedText/TruncatedText', () => ({
  TruncatedText: ({ text }: any) => <span data-testid='truncated-text'>{text}</span>,
}));

describe('GroceryTable Component', () => {
  const mockNavigate = jest.fn();
  const mockOnIngredientCheck = jest.fn();
  const setIsWeeklyView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/app/dashboard' });
  });

  const groupedIngredientsMock = {
    Produce: [
      {
        id: 1,
        name: 'Apple',
        aisle: 'Produce',
        image: 'apple.png',
        amount: 2,
        unit: 'pcs',
        checked: false,
      },
      {
        id: 2,
        name: 'Banana',
        aisle: 'Produce',
        image: 'banana.png',
        amount: 5,
        unit: 'pcs',
        checked: true,
      },
    ],
    Dairy: [
      {
        id: 3,
        name: 'Milk',
        aisle: 'Dairy',
        image: 'milk.png',
        amount: 1,
        unit: 'liter',
        checked: false,
      },
    ],
  };

  test('renders loading state', () => {
    render(
      <MemoryRouter>
        <GroceryTable groupedIngredients={{}} loading />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders "No ingredients to display" when groupedIngredients is empty and not loading', () => {
    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={{}}
          loading={false}
          showControls={false}
          isWeeklyView={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('No ingredients to display')).toBeInTheDocument();
    expect(screen.getByText("You don't have any meals planned for today.")).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /go to meal planner/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/app/meal-planner');
  });

  test('renders all grouped ingredients correctly', () => {
    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          onIngredientCheck={mockOnIngredientCheck}
        />
      </MemoryRouter>
    );

    // Check aisles
    expect(screen.getByText('Produce')).toBeInTheDocument();
    expect(screen.getByText('Dairy')).toBeInTheDocument();

    // Check ingredients
    groupedIngredientsMock.Produce.forEach((ingredient) => {
      const ingredientRow = screen.getByText(ingredient.name).closest('tr');
      expect(ingredientRow).toBeInTheDocument();

      // Check checkbox
      const checkbox = within(ingredientRow!).getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      // Check image
      const image = within(ingredientRow!).getByAltText(ingredient.name) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(ingredient.image);

      // Check amount and unit
      expect(within(ingredientRow!).getByText(`${ingredient.amount.toFixed(2)} ${ingredient.unit}`)).toBeInTheDocument();

      // Check truncated text
      expect(within(ingredientRow!).getByTestId('truncated-text')).toHaveTextContent(ingredient.name);
    });

    groupedIngredientsMock.Dairy.forEach((ingredient) => {
      const ingredientRow = screen.getByText(ingredient.name).closest('tr');
      expect(ingredientRow).toBeInTheDocument();

      // Check checkbox
      const checkbox = within(ingredientRow!).getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      // Check image
      const image = within(ingredientRow!).getByAltText(ingredient.name) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(ingredient.image);

      // Check amount and unit
      expect(within(ingredientRow!).getByText(`${ingredient.amount.toFixed(2)} ${ingredient.unit}`)).toBeInTheDocument();

      // Check truncated text
      expect(within(ingredientRow!).getByTestId('truncated-text')).toHaveTextContent(ingredient.name);
    });
  });

  test('renders controls when showControls is true', () => {
    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          showControls
          isWeeklyView={false}
          setIsWeeklyView={setIsWeeklyView}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Grocery List')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /daily/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /weekly/i })).toBeInTheDocument();
  });

  test('calls onIngredientCheck when checkbox is clicked', () => {
    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          onIngredientCheck={mockOnIngredientCheck}
        />
      </MemoryRouter>
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(mockOnIngredientCheck).toHaveBeenCalledWith(3, true);
  });

  test('calls setIsWeeklyView when tab is changed', () => {
    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          showControls
          isWeeklyView={false}
          setIsWeeklyView={setIsWeeklyView}
        />
      </MemoryRouter>
    );

    const weeklyTab = screen.getByRole('tab', { name: /Weekly/i });
    fireEvent.click(weeklyTab);
    expect(setIsWeeklyView).toHaveBeenCalledWith(true);
  });

  test('scrolls to the last interacted ingredient on render', () => {
    const scrollToMock = jest.fn();
    const getBoundingClientRectMock = jest.fn(() => ({
      top: 100,
      // Add other properties if needed
    }));

    // Mock the element's getBoundingClientRect
    document.getElementById = jest.fn().mockReturnValue({
      getBoundingClientRect: getBoundingClientRectMock,
    } as any);

    // Mock the container's getBoundingClientRect and scrollTo
    const scrollContainer = {
      getBoundingClientRect: jest.fn(() => ({
        top: 50,
      })),
      scrollTop: 0,
      scrollTo: scrollToMock,
    };

    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          lastInteractedIngredientId={2}
        />
      </MemoryRouter>
    );

    const container = screen.getByTestId('grocery-table-container');
    // Manually set the scrollContainer properties
    (container as any).getBoundingClientRect = scrollContainer.getBoundingClientRect;
    (container as any).scrollTo = scrollToMock;

    expect(document.getElementById).toHaveBeenCalledWith('ingredient-2');
  });

  test('does not scroll when lastInteractedIngredientId is null', () => {
    const scrollToMock = jest.fn();

    // Mock the element's getBoundingClientRect
    document.getElementById = jest.fn().mockReturnValue(null);

    // Mock the container's scrollTo
    const scrollContainer = {
      scrollTo: scrollToMock,
    };

    render(
      <MemoryRouter>
        <GroceryTable
          groupedIngredients={groupedIngredientsMock}
          loading={false}
          lastInteractedIngredientId={null}
        />
      </MemoryRouter>
    );

    const container = screen.getByTestId('grocery-table-container');
    // Manually set the scrollContainer properties
    (container as any).scrollTo = scrollToMock;

    expect(scrollContainer.scrollTo).not.toHaveBeenCalled();
  });
});
