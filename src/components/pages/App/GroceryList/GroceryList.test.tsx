// GroceryList.test.tsx
import { render } from '@testing-library/react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import { GroceryList } from './GroceryList';

import { useAuth } from '@src/contexts/AuthContext';
import { fetchRecipeInformationBulk } from '@src/services/spoonacular-service';

// Mock necessary modules and functions
jest.mock('@src/contexts/AuthContext');
jest.mock('@src/services/spoonacular-service');
jest.mock('firebase/firestore');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../../../../firebase-config', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  setPersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  browserSessionPersistence: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
  reauthenticateWithCredential: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock Child Components
jest.mock('@components/organisms/GroceryTable/GroceryTable', () => ({
  GroceryTable: () => <div data-testid='grocery-table'>Mocked GroceryTable</div>,
}));

describe('GroceryList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    // Arrange
    // Mock useAuth to return a user and not loading
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'user123', email: 'user@example.com' },
      loading: false,
    });

    // Mock Firestore doc function
    (doc as jest.Mock).mockReturnValue('docRef');

    // Mock onSnapshot to immediately call the callback with mock data
    (onSnapshot as jest.Mock).mockImplementation((_docRef, callback) => {
      callback({
        exists: () => true,
        data: () => ({
          Meals: {
            '2024-04-21': {
              breakfast: { id: 1, name: 'Pancakes' },
              lunch: { id: 2, name: 'Salad' },
            },
          },
          GroceryItems: {
            1: true,
            2: false,
          },
          groceryWeek: 17,
        }),
      });
      return jest.fn(); // Mock unsubscribe function
    });

    // Mock updateDoc to return a resolved promise
    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    // Mock fetchRecipeInformationBulk to return a resolved promise with mock data
    (fetchRecipeInformationBulk as jest.Mock).mockResolvedValue([
      {
        id: 1,
        extendedIngredients: [
          {
            id: 101, name: 'Flour', aisle: 'Baking', measures: { metric: { amount: 200, unitShort: 'g' } }
          },
          {
            id: 102, name: 'Eggs', aisle: 'Dairy', measures: { metric: { amount: 2, unitShort: 'pcs' } }
          },
        ],
      },
      {
        id: 2,
        extendedIngredients: [
          {
            id: 103, name: 'Lettuce', aisle: 'Produce', measures: { metric: { amount: 100, unitShort: 'g' } }
          },
          {
            id: 104, name: 'Tomato', aisle: 'Produce', measures: { metric: { amount: 2, unitShort: 'pcs' } }
          },
        ],
      },
    ]);

    // Act
    render(<GroceryList />);
  });
});
