import {
  doc, getDoc, collection, query, where, getDocs,
  deleteDoc
} from 'firebase/firestore';

import {
  deleteUser, EmailAuthProvider, reauthenticateWithCredential, User
} from 'firebase/auth';

import { toast } from 'react-toastify';

import { UserData } from './Account.types';

import { db } from '@src/firebase-config';

export const fetchUserData = async (user: User | null): Promise<UserData | null> => {
  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      }
      toast.error('User data not found.');
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data.');
      return null;
    }
  }
  return null;
};

export const checkEmailAvailability = async (
  email: string,
  currentUserId: string
): Promise<boolean> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  let emailAvailable = true;
  querySnapshot.forEach((docc) => {
    if (docc.id !== currentUserId) {
      emailAvailable = false;
    }
  });
  return emailAvailable;
};

export const validateUsername = (value: string): string => {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return 'Username cannot be empty.';
  } if (trimmedValue.length < 3 || trimmedValue.length > 50) {
    return 'Username must be between 3 and 50 characters.';
  }
  return '';
};

export const validateEmail = (rawEmail: string): string => {
  const email = rawEmail.trim();
  if (!email) {
    return 'Email cannot be empty.';
  }
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodeURIComponent(email));
  if (!isValid) {
    return 'Please enter a valid email address.';
  }
  return '';
};

export const hasUnsavedChanges = (
  userData: UserData | null,
  username: string,
  email: string,
  diet: string,
  intolerances: string[],
  includedCuisines: string[],
  excludedCuisines: string[]
): boolean => {
  if (!userData) return false;

  const isUsernameChanged = username !== userData.username;
  const isEmailChanged = email !== userData.email;

  const isDietChanged = diet !== (userData.accountDetails?.diet || '');
  const isIntolerancesChanged = JSON.stringify(intolerances)
    !== JSON.stringify(userData.accountDetails?.intolerances || []);
  const isIncludedCuisinesChanged = JSON.stringify(includedCuisines)
    !== JSON.stringify(userData.accountDetails?.cuisinePreferences?.includedCuisines || []);
  const isExcludedCuisinesChanged = JSON.stringify(excludedCuisines)
    !== JSON.stringify(userData.accountDetails?.cuisinePreferences?.excludedCuisines || []);

  return (
    isUsernameChanged
    || isEmailChanged
    || isDietChanged
    || isIntolerancesChanged
    || isIncludedCuisinesChanged
    || isExcludedCuisinesChanged
  );
};

/**
 * Deletes the user document from Firestore.
 * @param userId - The UID of the user to delete.
 */
export const deleteUserData = async (userId: string): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  await deleteDoc(userDocRef);
};

/**
 * Re-authenticates the user with the provided password.
 * @param user - The current Firebase user.
 * @param password - The user's password for re-authentication.
 */
export const reauthenticateUser = async (user: User, password: string): Promise<void> => {
  const credential = EmailAuthProvider.credential(user.email!, password);
  await reauthenticateWithCredential(user, credential);
};

/**
 * Deletes the user from Firebase Auth.
 * @param user - The current Firebase user.
 */
export const deleteFirebaseAuthUser = async (user: User): Promise<void> => {
  await deleteUser(user);
};
