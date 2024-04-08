/* eslint-disable max-len */
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import { app, db } from '../firebase-config';

const auth = getAuth(app);

export const checkUsernameAvailability = async (username: string) => {
  const usersRef = collection(db, 'usernames');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

export const signUp = async (email: string, username: string, password: string) => {
  if (!(await checkUsernameAvailability(username))) {
    throw new Error('Username is already taken');
  }
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await setDoc(doc(db, 'usernames', user.uid), { username, email });

    return user;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
};

export const googleSignIn = async () => {
  await setPersistence(auth, browserSessionPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider);
};

const validateEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

export const login = async (usernameOrEmail: string, password: string) => {
  await setPersistence(auth, browserSessionPersistence);
  if (validateEmail(usernameOrEmail)) {
    try {
      return await signInWithEmailAndPassword(auth, usernameOrEmail, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  } else {
    const usersRef = collection(db, 'usernames');
    const q = query(usersRef, where('username', '==', usernameOrEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No user found with the given username.');
    }

    let userEmail = '';
    querySnapshot.forEach((docSnapshot) => {
      userEmail = docSnapshot.data().email;
    });

    try {
      return await signInWithEmailAndPassword(auth, userEmail, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
};
