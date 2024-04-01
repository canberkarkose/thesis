/* eslint-disable max-len */
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { app } from '../firebase-config';

const auth = getAuth(app);

export const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider);
};
