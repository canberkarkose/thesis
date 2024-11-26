/* eslint-disable @typescript-eslint/no-explicit-any */
// authService.test.ts

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteField,
} from 'firebase/firestore';

import { db } from '../firebase-config';

import {
  checkUsernameAvailabilityHttp,
  createUserAndAuthenticate,
  setUserDocument,
  login,
  resetPassword,
  confirmPassword,
  logout,
  addMealToUserPlan,
  deleteMealFromUserPlan,
} from './auth-service';

import { Recipe } from '@components/organisms/MealCalendar/MealCalendar'; // Adjust the import path as needed

// Mock Firebase auth functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  browserSessionPersistence: 'browserSessionPersistence',
  setPersistence: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Firebase firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteField: jest.fn(),
}));

// Mock firebase-config
jest.mock('../firebase-config', () => ({
  app: {},
  db: {},
}));

// Mock fetch
(globalThis as any).fetch = jest.fn();

describe('Auth Service Helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkUsernameAvailabilityHttp', () => {
    it('returns true when username is available', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ available: true }),
      });

      const isAvailable = await checkUsernameAvailabilityHttp('newuser');
      expect(fetch).toHaveBeenCalledWith(
        'https://us-central1-bite-by-bite-thesis.cloudfunctions.net/checkUsernameAvailabilityHttp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'newuser' }),
        }
      );
      expect(isAvailable).toBe(true);
    });

    it('returns false when username is not available', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ available: false }),
      });

      const isAvailable = await checkUsernameAvailabilityHttp('existinguser');
      expect(isAvailable).toBe(false);
    });

    it('throws an error when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(checkUsernameAvailabilityHttp('erroruser')).rejects.toThrow('Network Error');
    });
  });

  describe('createUserAndAuthenticate', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };

    it('creates a user with email and password', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (setPersistence as jest.Mock).mockResolvedValueOnce(null);
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const user = await createUserAndAuthenticate('test@example.com', 'password123');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password123');
      expect(user).toEqual(mockUser);
    });

    it('throws an error when authentication fails', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (setPersistence as jest.Mock).mockRejectedValueOnce(new Error('Persistence Error'));

      await expect(createUserAndAuthenticate('test@example.com', 'password123')).rejects.toThrow('Persistence Error');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
    });
  });

  describe('setUserDocument', () => {
    it('sets the user document in Firestore', async () => {
      (doc as jest.Mock).mockReturnValue('docRef');
      (setDoc as jest.Mock).mockResolvedValueOnce(null);

      await setUserDocument('123', 'testuser', 'test@example.com');
      expect(doc).toHaveBeenCalledWith(db, 'users', '123');
      expect(setDoc).toHaveBeenCalledWith('docRef', {
        uid: '123',
        username: 'testuser',
        email: 'test@example.com',
        accountDetailsCompleted: false,
      });
    });

    it('throws an error when setting document fails', async () => {
      (doc as jest.Mock).mockReturnValue('docRef');
      (setDoc as jest.Mock).mockRejectedValueOnce(new Error('Firestore Error'));

      await expect(setUserDocument('123', 'testuser', 'test@example.com')).rejects.toThrow('Firestore Error');
      expect(setDoc).toHaveBeenCalledWith('docRef', {
        uid: '123',
        username: 'testuser',
        email: 'test@example.com',
        accountDetailsCompleted: false,
      });
    });
  });

  describe('login', () => {
    it('signs in with email and password when input is an email', async () => {
      (setPersistence as jest.Mock).mockResolvedValueOnce(null);
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '789' } });

      const user = await login('test@example.com', 'password123');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password123');
      expect(user).toEqual({ user: { uid: '789' } });
    });

    it('signs in with username by fetching email first', async () => {
      (setPersistence as jest.Mock).mockResolvedValueOnce(null);
      (collection as jest.Mock).mockReturnValue('usersCollection');
      (query as jest.Mock).mockReturnValue('queryObject');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValueOnce({
        empty: false,
        forEach: (cb: any) => cb({ data: () => ({ email: 'user@example.com' }) }),
      });
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '789' } });

      const user = await login('username', 'password123');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(query).toHaveBeenCalledWith('usersCollection', 'whereClause');
      expect(getDocs).toHaveBeenCalledWith('queryObject');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'user@example.com', 'password123');
      expect(user).toEqual({ user: { uid: '789' } });
    });

    it('throws an error if username does not exist', async () => {
      (setPersistence as jest.Mock).mockResolvedValueOnce(null);
      (collection as jest.Mock).mockReturnValue('usersCollection');
      (query as jest.Mock).mockReturnValue('queryObject');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValueOnce({
        empty: true,
      });

      await expect(login('nonexistentuser', 'password123')).rejects.toThrow('No user found with the given username.');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(query).toHaveBeenCalledWith('usersCollection', 'whereClause');
      expect(getDocs).toHaveBeenCalledWith('queryObject');
      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it('throws an error when sign-in fails', async () => {
      (setPersistence as jest.Mock).mockResolvedValueOnce(null);
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error('Sign-In Error'));

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Sign-In Error');
      expect(setPersistence).toHaveBeenCalledWith(undefined, 'browserSessionPersistence');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'wrongpassword');
    });
  });

  describe('resetPassword', () => {
    it('sends a password reset email', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(null);

      await resetPassword('test@example.com');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(undefined, 'test@example.com');
    });

    it('throws an error when sending email fails', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(new Error('Reset Email Error'));

      await expect(resetPassword('test@example.com')).rejects.toThrow('Reset Email Error');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(undefined, 'test@example.com');
    });
  });

  describe('confirmPassword', () => {
    it('confirms the password reset', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (confirmPasswordReset as jest.Mock).mockResolvedValueOnce(null);

      await confirmPassword('oobCode123', 'newpassword123');
      expect(confirmPasswordReset).toHaveBeenCalledWith(undefined, 'oobCode123', 'newpassword123');
    });

    it('throws an error when confirmation fails', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (confirmPasswordReset as jest.Mock).mockRejectedValueOnce(new Error('Confirm Password Error'));

      await expect(confirmPassword('invalidOobCode', 'newpassword123')).rejects.toThrow('Confirm Password Error');
      expect(confirmPasswordReset).toHaveBeenCalledWith(undefined, 'invalidOobCode', 'newpassword123');
    });
  });

  describe('logout', () => {
    it('signs out the user', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (signOut as jest.Mock).mockResolvedValueOnce(null);

      await logout();
      expect(signOut).toHaveBeenCalledWith(undefined);
    });

    it('throws an error when sign-out fails', async () => {
      (getAuth as jest.Mock).mockReturnValue({});
      (signOut as jest.Mock).mockRejectedValueOnce(new Error('Sign-Out Error'));

      await expect(logout()).rejects.toThrow('Sign-Out Error');
      expect(signOut).toHaveBeenCalledWith(undefined);
    });
  });

  describe('addMealToUserPlan', () => {
    it('adds a meal to the user plan', async () => {
      const recipe: Recipe = { id: 1, title: 'Pasta', image: 'pasta.png' };
      (doc as jest.Mock).mockReturnValue('docRef');
      (updateDoc as jest.Mock).mockResolvedValueOnce(null);

      await addMealToUserPlan('user123', '2024-05-01', 'Lunch', recipe);
      expect(doc).toHaveBeenCalledWith(db, 'users', 'user123');
      expect(updateDoc).toHaveBeenCalledWith('docRef', {
        'Meals.2024-05-01.Lunch': {
          id: 1,
          title: 'Pasta',
          image: 'pasta.png',
        },
      });
    });

    it('throws an error when adding meal fails', async () => {
      const recipe: Recipe = { id: 1, title: 'Pasta', image: 'pasta.png' };
      (doc as jest.Mock).mockReturnValue('docRef');
      (updateDoc as jest.Mock).mockRejectedValueOnce(new Error('Update Doc Error'));

      await expect(addMealToUserPlan('user123', '2024-05-01', 'Lunch', recipe)).rejects.toThrow('Update Doc Error');
      expect(doc).toHaveBeenCalledWith(db, 'users', 'user123');
      expect(updateDoc).toHaveBeenCalledWith('docRef', {
        'Meals.2024-05-01.Lunch': {
          id: 1,
          title: 'Pasta',
          image: 'pasta.png',
        },
      });
    });
  });

  describe('deleteMealFromUserPlan', () => {
    it('deletes a meal from the user plan and removes the date if no meals remain', async () => {
      const mockDocSnap = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          Meals: {
            '2024-05-01': {
              Lunch: {},
            },
          },
        }),
      };
      (doc as jest.Mock).mockReturnValue('docRef');
      (updateDoc as jest.Mock)
        .mockResolvedValueOnce(null) // Delete the meal
        .mockResolvedValueOnce(null); // Delete the date

      (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

      await deleteMealFromUserPlan('user123', '2024-05-01', 'Lunch');
      expect(doc).toHaveBeenCalledWith(db, 'users', 'user123');
      expect(updateDoc).toHaveBeenCalledWith('docRef', {
        'Meals.2024-05-01.Lunch': deleteField(),
      });
      expect(getDoc).toHaveBeenCalledWith('docRef');
      expect(updateDoc).toHaveBeenCalledWith('docRef', {
        'Meals.2024-05-01': deleteField(),
      });
    });
  });
});
