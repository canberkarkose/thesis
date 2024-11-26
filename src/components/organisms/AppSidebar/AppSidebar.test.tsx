// AppSidebar.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

import { AppSidebar } from './AppSidebar'; // Adjust the import path as needed

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('AppSidebar Component', () => {
  const mockNavigate = jest.fn();
  const mockOnHoverChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/app/dashboard' });
  });

  test('renders all menu items', () => {
    render(
      <MemoryRouter>
        <AppSidebar onHoverChange={mockOnHoverChange} />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
  });

  test('calls onHoverChange on mouse enter and leave', () => {
    render(
      <MemoryRouter>
        <AppSidebar onHoverChange={mockOnHoverChange} />
      </MemoryRouter>
    );
    const dashboardButton = screen.getByText('Dashboard');

    // Mouse enter
    fireEvent.mouseEnter(dashboardButton);
    expect(mockOnHoverChange).toHaveBeenCalledWith(true);

    // Mouse leave
    fireEvent.mouseLeave(dashboardButton);
    expect(mockOnHoverChange).toHaveBeenCalledWith(false);
  });

  test('navigates to correct path on menu item click', () => {
    render(
      <MemoryRouter>
        <AppSidebar onHoverChange={mockOnHoverChange} />
      </MemoryRouter>
    );

    const mealPlannerButton = screen.getByText('Meal Planner');
    fireEvent.click(mealPlannerButton);
    expect(mockNavigate).toHaveBeenCalledWith('/app/meal-planner');

    const groceryListButton = screen.getByText('Grocery List');
    fireEvent.click(groceryListButton);
    expect(mockNavigate).toHaveBeenCalledWith('/app/grocery-list');

    const recipesButton = screen.getByText('Recipes');
    fireEvent.click(recipesButton);
    expect(mockNavigate).toHaveBeenCalledWith('/app/recipes');
  });
});
