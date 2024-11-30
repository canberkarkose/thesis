import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDbiptbEIpHhnLR-sF8vvvveGJZrAlEzGY',
  authDomain: 'bite-by-bite-thesis.firebaseapp.com',
  projectId: 'bite-by-bite-thesis',
  storageBucket: 'bite-by-bite-thesis.firebasestorage.app',
  messagingSenderId: '244664994766',
  appId: '1:244664994766:web:f0023b96464f995c76799f',
  measurementId: 'G-Y2P8R9WSXZ'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
