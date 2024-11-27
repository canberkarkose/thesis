/* eslint-disable react/button-has-type */
import {
  render, screen
} from '@testing-library/react';

import { Recipes } from './Recipes';

// Mock dependencies
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('@src/services/spoonacular-service', () => ({
  fetchRandomRecipes: jest.fn(),
  fetchRecipeInformation: jest.fn(),
  fetchRecipeInformationBulk: jest.fn(),
}));

jest.mock('@src/firebase-config', () => ({
  db: {},
}));

jest.mock('@src/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({ user: { uid: 'user123' } })),
}));

jest.mock('@components/molecules/RecipeCard/RecipeCard', () => ({
  RecipeCard: ({ title, onSeeMore }: { title: string; onSeeMore: () => void }) => (
    <div data-testid='recipe-card'>
      <h4>{title}</h4>
      <button onClick={onSeeMore}>See More</button>
    </div>
  ),
}));

jest.mock('@components/molecules/RecipeInformationModal/RecipeInformationModal', () => ({
  RecipeInformationModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => (open ? (
    <div data-testid='recipe-modal'>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null),
}));

describe('Recipes Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Recipes />);
    expect(screen.getByText(/Discover New Recipes/i)).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    render(<Recipes />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
