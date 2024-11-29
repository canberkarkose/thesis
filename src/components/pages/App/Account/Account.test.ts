/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  getDoc, doc, collection, getDocs, query, where,
  deleteDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import {
  deleteUser, EmailAuthProvider, reauthenticateWithCredential, User
} from 'firebase/auth';

import {
  checkEmailAvailability,
  deleteFirebaseAuthUser,
  deleteUserData,
  fetchUserData,
  hasUnsavedChanges,
  reauthenticateUser,
  validateEmail,
  validateUsername
} from './Account.helpers';
import { UserData } from './Account.types';

// Mock Firebase Firestore functions
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  setPersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
  reauthenticateWithCredential: jest.fn(),
  deleteUser: jest.fn(),
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
  deleteDoc: jest.fn(),
}));

jest.mock('../../../../firebase-config', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
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

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

describe('fetchUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('returns user data when user is provided and document exists', async () => {
    // Arrange
    const mockUser: User = { uid: '123' } as User;
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };

    // Mock the doc and getDoc functions
    (doc as jest.Mock).mockReturnValue('docRef');
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue(mockUserData),
    });

    // Act
    const result = await fetchUserData(mockUser);

    // Assert
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', '123');
    expect(getDoc).toHaveBeenCalledWith('docRef');
    expect(result).toEqual(mockUserData);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('returns null and shows error when user is null or document does not exist', async () => {
    // Scenario 1: User is null
    const resultWithNullUser = await fetchUserData(null);

    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(resultWithNullUser).toBeNull();
    expect(toast.error).not.toHaveBeenCalled(); // No error toast when user is null

    // Reset mocks for the next scenario
    jest.clearAllMocks();

    // Scenario 2: User is provided but document does not exist
    const mockUser: User = { uid: '456' } as User;
    (doc as jest.Mock).mockReturnValue('docRef');
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
    });

    const resultDocNotFound = await fetchUserData(mockUser);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', '456');
    expect(getDoc).toHaveBeenCalledWith('docRef');
    expect(resultDocNotFound).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('User data not found.');
  });

  it('returns null and shows error when getDoc throws an error', async () => {
    // Arrange
    const mockUser: User = { uid: '789' } as User;
    const mockError = new Error('Firestore fetch error');

    (doc as jest.Mock).mockReturnValue('docRef');
    (getDoc as jest.Mock).mockRejectedValue(mockError);

    // Spy on console.error to suppress error logs during testing
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result = await fetchUserData(mockUser);

    // Assert
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', '789');
    expect(getDoc).toHaveBeenCalledWith('docRef');
    expect(result).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Error fetching user data.');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user data:', mockError);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});

describe('checkEmailAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('returns true when no users have the given email', async () => {
    // Arrange
    const email = 'available@example.com';
    const currentUserId = 'user123';

    // Mock Firestore functions
    (collection as jest.Mock).mockReturnValue('usersCollectionRef');
    (where as jest.Mock).mockReturnValue('whereEmailIsAvailable');
    (query as jest.Mock).mockReturnValue('queryRef');
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: jest.fn(),
    });

    // Act
    const isAvailable = await checkEmailAvailability(email, currentUserId);

    // Assert
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users');
    expect(where).toHaveBeenCalledWith('email', '==', email);
    expect(query).toHaveBeenCalledWith('usersCollectionRef', 'whereEmailIsAvailable');
    expect(getDocs).toHaveBeenCalledWith('queryRef');
    expect(isAvailable).toBe(true);
  });

  it('returns false when another user has the given email', async () => {
    // Arrange
    const email = 'taken@example.com';
    const currentUserId = 'user123';

    // Mock Firestore functions
    (collection as jest.Mock).mockReturnValue('usersCollectionRef');
    (where as jest.Mock).mockReturnValue('whereEmailIsTaken');
    (query as jest.Mock).mockReturnValue('queryRef');

    const mockForEach = jest.fn((callback: Function) => {
      callback({
        id: 'otherUser456',
      });
    });

    (getDocs as jest.Mock).mockResolvedValue({
      forEach: mockForEach,
    });

    // Act
    const isAvailable = await checkEmailAvailability(email, currentUserId);

    // Assert
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users');
    expect(where).toHaveBeenCalledWith('email', '==', email);
    expect(query).toHaveBeenCalledWith('usersCollectionRef', 'whereEmailIsTaken');
    expect(getDocs).toHaveBeenCalledWith('queryRef');
    expect(mockForEach).toHaveBeenCalled();
    expect(isAvailable).toBe(false);
  });
});

describe('validateUsername', () => {
  it('returns an empty string for a valid username', () => {
    const validUsername = 'john_doe';
    const result = validateUsername(validUsername);
    expect(result).toBe('');
  });

  it('returns an error message for an empty username', () => {
    const emptyUsername = '   ';
    const result = validateUsername(emptyUsername);
    expect(result).toBe('Username cannot be empty.');
  });

  it('returns an error message for a username that is too short', () => {
    const shortUsername = 'ab';
    const result = validateUsername(shortUsername);
    expect(result).toBe('Username must be between 3 and 50 characters.');
  });

  it('returns an error message for a username that is too long', () => {
    const longUsername = 'a'.repeat(51);
    const result = validateUsername(longUsername);
    expect(result).toBe('Username must be between 3 and 50 characters.');
  });
});

describe('validateEmail', () => {
  it('returns an empty string for a valid email', () => {
    const validEmail = 'john.doe@example.com';
    const result = validateEmail(validEmail);
    expect(result).toBe('');
  });

  it('returns an error message for an empty email', () => {
    const emptyEmail = '   ';
    const result = validateEmail(emptyEmail);
    expect(result).toBe('Email cannot be empty.');
  });

  it('returns an error message for an invalid email format', () => {
    const invalidEmail = 'john.doe@com';
    const result = validateEmail(invalidEmail);
    expect(result).toBe('Please enter a valid email address.');
  });

  it('returns an error message for an email with invalid characters', () => {
    const invalidEmail = 'john.doe@exa mple.com';
    const result = validateEmail(invalidEmail);
    expect(result).toBe('Please enter a valid email address.');
  });
});

describe('hasUnsavedChanges', () => {
  it('returns false when userData is null', () => {
    // Arrange
    const userData: UserData | null = null;
    const username = 'newuser';
    const email = 'newuser@example.com';
    const diet = 'Vegetarian';
    const intolerances: string[] = ['Gluten'];
    const includedCuisines: string[] = ['Italian'];
    const excludedCuisines: string[] = ['Mexican'];

    // Act
    const result = hasUnsavedChanges(
      userData,
      username,
      email,
      diet,
      intolerances,
      includedCuisines,
      excludedCuisines
    );

    // Assert
    expect(result).toBe(false);
  });

  it('returns true when at least one field differs from userData', () => {
    // Arrange
    const userData: UserData = {
      username: 'existinguser',
      email: 'existing@example.com',
      accountDetails: {
        diet: 'Vegan',
        intolerances: ['Dairy'],
        cuisinePreferences: {
          includedCuisines: ['Chinese'],
          excludedCuisines: ['Indian'],
        },
      },
    };

    const username = 'existinguser'; // Same as userData
    const email = 'newemail@example.com'; // Different
    const diet = 'Vegan'; // Same as userData
    const intolerances: string[] = ['Dairy']; // Same as userData
    const includedCuisines: string[] = ['Chinese']; // Same as userData
    const excludedCuisines: string[] = ['Indian']; // Same as userData

    // Act
    const result = hasUnsavedChanges(
      userData,
      username,
      email,
      diet,
      intolerances,
      includedCuisines,
      excludedCuisines
    );

    // Assert
    expect(result).toBe(true);
  });

  // Optional: Additional Test for All Fields Matching
  it('returns false when all fields match userData', () => {
    // Arrange
    const userData: UserData = {
      username: 'existinguser',
      email: 'existing@example.com',
      accountDetails: {
        diet: 'Vegan',
        intolerances: ['Dairy'],
        cuisinePreferences: {
          includedCuisines: ['Chinese'],
          excludedCuisines: ['Indian'],
        },
      },
    };

    const username = 'existinguser'; // Same as userData
    const email = 'existing@example.com'; // Same as userData
    const diet = 'Vegan'; // Same as userData
    const intolerances: string[] = ['Dairy']; // Same as userData
    const includedCuisines: string[] = ['Chinese']; // Same as userData
    const excludedCuisines: string[] = ['Indian']; // Same as userData

    // Act
    const result = hasUnsavedChanges(
      userData,
      username,
      email,
      diet,
      intolerances,
      includedCuisines,
      excludedCuisines
    );

    // Assert
    expect(result).toBe(false);
  });
});

describe('deleteUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('calls deleteDoc with the correct document reference', async () => {
    // Arrange
    const userId = 'user123';
    const mockDocRef = 'docRef';
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    // Act
    await deleteUserData(userId);

    // Assert
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it('throws an error if deleteDoc fails', async () => {
    // Arrange
    const userId = 'user123';
    const mockDocRef = 'docRef';
    const mockError = new Error('Delete failed');
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (deleteDoc as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(deleteUserData(userId)).rejects.toThrow('Delete failed');
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });
});

describe('reauthenticateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('calls reauthenticateWithCredential with correct user and credential', async () => {
    // Arrange
    const mockUser: User = { email: 'user@example.com', uid: 'user123' } as User;
    const password = 'password123';
    const mockCredential = 'credential';
    (EmailAuthProvider.credential as jest.Mock).mockReturnValue(mockCredential);
    (reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);

    // Act
    await reauthenticateUser(mockUser, password);

    // Assert
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockUser.email!, password);
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockUser, mockCredential);
  });

  it('throws an error if reauthenticateWithCredential fails', async () => {
    // Arrange
    const mockUser: User = { email: 'user@example.com', uid: 'user123' } as User;
    const password = 'password123';
    const mockCredential = 'credential';
    const mockError = new Error('Reauthentication failed');
    (EmailAuthProvider.credential as jest.Mock).mockReturnValue(mockCredential);
    (reauthenticateWithCredential as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(reauthenticateUser(mockUser, password)).rejects.toThrow('Reauthentication failed');
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockUser.email!, password);
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockUser, mockCredential);
  });
});

describe('deleteFirebaseAuthUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('calls deleteUser with the correct user', async () => {
    // Arrange
    const mockUser: User = { uid: 'user123' } as User;
    (deleteUser as jest.Mock).mockResolvedValue(undefined);

    // Act
    await deleteFirebaseAuthUser(mockUser);

    // Assert
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
  });

  it('throws an error if deleteUser fails', async () => {
    // Arrange
    const mockUser: User = { uid: 'user123' } as User;
    const mockError = new Error('Delete Auth user failed');
    (deleteUser as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(deleteFirebaseAuthUser(mockUser)).rejects.toThrow('Delete Auth user failed');
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
  });
});
