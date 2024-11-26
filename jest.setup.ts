import '@testing-library/jest-dom';

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));
