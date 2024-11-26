/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  setPersistence, browserSessionPersistence, createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db, auth } from '../firebase-config';

import {
  checkIfUserExists,
  checkUsernameAvailabilityHttp, createUserAndAuthenticate, setUserDocument, signUp
} from './auth-service';

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  setPersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../firebase-config', () => ({
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
}));

describe('coverage for authentication functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check username availability', async () => {
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ available: true }),
    });

    const result = await checkUsernameAvailabilityHttp('testuser');
    expect(result).toBe(true);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://us-central1-bite-by-bite-thesis.cloudfunctions.net/checkUsernameAvailabilityHttp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser' }),
      }
    );
  });

  it('should create a user and authenticate', async () => {
    const mockUser = { uid: '12345' };
    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const user = await createUserAndAuthenticate('test@example.com', 'password123');
    expect(user).toEqual(mockUser);
    expect(setPersistence).toHaveBeenCalledWith(auth, browserSessionPersistence);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
  });

  it('should set a user document', async () => {
    (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

    await setUserDocument('12345', 'testuser', 'test@example.com');
    expect(setDoc).toHaveBeenCalledWith(
      doc(db, 'users', '12345'),
      {
        uid: '12345',
        username: 'testuser',
        email: 'test@example.com',
        accountDetailsCompleted: false,
      }
    );
  });

  it('should sign up a user', async () => {
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ available: true }),
    });
    const mockUser = { uid: '12345' };
    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser });
    (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const user = await signUp('test@example.com', 'testuser', 'password123');
    expect(user).toEqual(mockUser);
    expect((globalThis as any).fetch).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
  });

  it('should throw an error if the username is already taken', async () => {
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ available: false }),
    });

    await expect(signUp('test@example.com', 'takenUsername', 'password123')).rejects.toThrow(
      'Username is already taken'
    );

    expect((globalThis as any).fetch).toHaveBeenCalled();
  });

  it('should throw an error and log it if something fails during sign-up', async () => {
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ available: true }),
    });
    (setPersistence as jest.Mock).mockResolvedValueOnce(undefined);
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error('Firebase Auth Error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(signUp('test@example.com', 'validUsername', 'password123')).rejects.toThrow('Firebase Auth Error');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Sign up failed:', expect.any(Error));
    expect((globalThis as any).fetch).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should return true if the user exists', async () => {
    const mockDocRef = {}; // Mock object for doc
    const mockDocSnap = { exists: jest.fn(() => true) };

    (doc as jest.Mock).mockReturnValue(mockDocRef); // Ensure doc returns a mock object
    (getDoc as jest.Mock).mockResolvedValue(mockDocSnap); // Ensure getDoc resolves to mockDocSnap

    const result = await checkIfUserExists('12345');
    expect(result).toBe(true);
    expect(doc).toHaveBeenCalledWith(db, 'users', '12345');
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it('should return false if the user does not exist', async () => {
    const mockDocRef = {}; // Mock object for doc
    const mockDocSnap = { exists: jest.fn(() => false) };

    (doc as jest.Mock).mockReturnValue(mockDocRef); // Ensure doc returns a mock object
    (getDoc as jest.Mock).mockResolvedValue(mockDocSnap); // Ensure getDoc resolves to mockDocSnap

    const result = await checkIfUserExists('67890');
    expect(result).toBe(false);
    expect(doc).toHaveBeenCalledWith(db, 'users', '67890');
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
  });
});
