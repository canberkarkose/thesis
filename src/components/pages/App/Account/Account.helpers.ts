import { doc, getDoc } from 'firebase/firestore';

import { User } from 'firebase/auth';

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
