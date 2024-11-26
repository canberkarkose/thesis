import {
  setPersistence, browserSessionPersistence, signInWithPopup, GoogleAuthProvider
} from 'firebase/auth';

import { auth } from '../firebase-config';

import {
  googleSignIn,
  setUserDocument
} from './auth-service';

jest.mock('firebase/auth', () => {
  const actualAuth = jest.requireActual('firebase/auth');
  const mockSetCustomParameters = jest.fn();
  class MockGoogleAuthProvider {
    setCustomParameters = mockSetCustomParameters;
  }
  return {
    ...actualAuth,
    getAuth: jest.fn(() => ({})),
    setPersistence: jest.fn(),
    signInWithPopup: jest.fn((_auth, provider) => {
      if (provider instanceof MockGoogleAuthProvider) {
        return Promise.resolve({
          user: { uid: '12345', email: 'newuser@example.com' },
        });
      }
      return Promise.reject(new Error('Sign-In Failed'));
    }),
    GoogleAuthProvider: MockGoogleAuthProvider,
    browserSessionPersistence: jest.fn(),
  };
});

jest.mock('./auth-service', () => ({
  ...jest.requireActual('./auth-service'),
  setUserDocument: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: jest.fn(() => true),
  })),
}));

jest.mock('../firebase-config', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

describe('googleSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors during Google Sign-In', async () => {
    const mockError = new Error('Google Sign-In Error');
    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(googleSignIn()).rejects.toThrow('Google Sign-In Error');

    expect(setPersistence).toHaveBeenCalledWith(auth, browserSessionPersistence);
    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Google Sign-In Error:', mockError);

    consoleErrorSpy.mockRestore();
  });

  it('should sign in a new user, create a new username, and save it to the database', async () => {
    const mockUser = { uid: '12345', email: 'newuser@example.com' };

    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const result = await googleSignIn();

    expect(setPersistence).toHaveBeenCalledWith(auth, browserSessionPersistence);
    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    expect(result).toEqual({ user: mockUser, isNewUser: false });
  });

  it('should sign in an existing user and skip new user creation', async () => {
    const mockUser = { uid: '67890', email: 'existinguser@example.com' };
    const mockSignInResult = { user: mockUser };

    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (signInWithPopup as jest.Mock).mockResolvedValueOnce(mockSignInResult);

    const result = await googleSignIn();

    expect(setUserDocument).not.toHaveBeenCalled();
    expect(result).toEqual({ user: mockUser, isNewUser: false });
  });

  it('should create a unique username if the default username is not available', async () => {
    const mockUser = { uid: '34567', email: 'uniqueuser@example.com' };
    const mockSignInResult = { user: mockUser };

    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (signInWithPopup as jest.Mock).mockResolvedValueOnce(mockSignInResult);
    (setUserDocument as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await googleSignIn();

    expect(setPersistence).toHaveBeenCalledWith(auth, browserSessionPersistence);
    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    expect(result).toEqual({ user: mockUser, isNewUser: false });
  });
});
