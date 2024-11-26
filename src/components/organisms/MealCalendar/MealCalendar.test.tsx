/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render, screen, fireEvent
} from '@testing-library/react';

import { MealCalendar } from './MealCalendar';

import { useAuth } from '@src/contexts/AuthContext';
import { addMealToUserPlan } from '@src/services/auth-service';

jest.mock('@src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  onSnapshot: jest.fn((_, callback) => {
    callback({
      exists: () => true,
      data: () => ({
        Meals: {
          '2024-11-01': {
            Breakfast: { id: 1, title: 'Pancakes', image: 'pancakes.jpg' },
          },
        },
      }),
    });
    return jest.fn();
  }),
}));

jest.mock('@src/services/auth-service', () => ({
  addMealToUserPlan: jest.fn(),
  deleteMealFromUserPlan: jest.fn(),
}));

jest.mock('@src/firebase-config', () => ({
  db: {},
}));

jest.mock('@components/molecules/MealSlot/MealSlot', () => ({
  MealSlot: ({ handleSlotClick }: any) => (
    <button data-testid='mock-meal-slot' onClick={() => handleSlotClick(0, '2024-11-01')}>
      Mock Slot
    </button>
  ),
}));

describe('MealCalendar', () => {
  const mockUser = { uid: '12345' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
  });

  it('renders without crashing', () => {
    render(
      <MealCalendar
        onSeeMore={jest.fn()}
        recipeToAdd={null}
        onRecipeAdded={jest.fn()}
      />
    );
    expect(screen.getByText(/Meal Calendar/i)).toBeInTheDocument();
  });

  it('displays a loading spinner when loading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    render(<MealCalendar onSeeMore={jest.fn()} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('toggles between Daily and Weekly views', () => {
    render(<MealCalendar onSeeMore={jest.fn()} />);
    const toggleButton = screen.getByRole('button', { name: /Switch to Daily View/i });

    // Switch to Daily View
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /Switch to Weekly View/i })).toBeInTheDocument();

    // Switch back to Weekly View
    fireEvent.click(screen.getByRole('button', { name: /Switch to Weekly View/i }));
    expect(screen.getByRole('button', { name: /Switch to Daily View/i })).toBeInTheDocument();
  });

  it('sets editMode to false when recipeToAdd changes', () => {
    const { rerender } = render(
      <MealCalendar
        onSeeMore={jest.fn()}
        recipeToAdd={null}
        onRecipeAdded={jest.fn()}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /Switch to Daily View/i });
    fireEvent.click(toggleButton);

    rerender(
      <MealCalendar
        onSeeMore={jest.fn()}
        recipeToAdd={{ id: 1, title: 'New Recipe' }}
        onRecipeAdded={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Switch to Weekly View/i })).toBeInTheDocument();
  });

  it('handles slot click and adds a meal to the user plan', async () => {
    const mockOnRecipeAdded = jest.fn();
    const mockRecipe = { id: 1, title: 'Test Recipe' };

    render(
      <MealCalendar
        onSeeMore={jest.fn()}
        recipeToAdd={mockRecipe}
        onRecipeAdded={mockOnRecipeAdded}
      />
    );

    const mockSlot = screen.getAllByTestId('mock-meal-slot')[0];
    fireEvent.click(mockSlot);

    expect(addMealToUserPlan).toHaveBeenCalledWith(
      '12345',
      '2024-11-01',
      'breakfast',
      mockRecipe
    );
  });

  it('changes the date correctly based on direction and view', () => {
    const mockToday = new Date('2024-11-01'); // Mock today's date
    jest.useFakeTimers().setSystemTime(mockToday); // Set the system time to the mock date

    render(<MealCalendar onSeeMore={jest.fn()} />);

    const nextButton = screen.getByRole('button', { name: /Next/i });
    const prevButton = screen.getByRole('button', { name: /Previous/i });

    // Initial state should display the current month
    expect(screen.getByText(/October 2024/i)).toBeInTheDocument();

    // Move forward
    fireEvent.click(nextButton);
    expect(screen.getByText(/November 2024/i)).toBeInTheDocument();

    // Move backward
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);
    expect(screen.getByText(/October 2024/i)).toBeInTheDocument();

    jest.useRealTimers(); // Restore timers after the test
  });
});
