import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyDbiptbEIpHhnLR-sF8vvvveGJZrAlEzGY',
  authDomain: 'bite-by-bite-thesis.firebaseapp.com',
  projectId: 'bite-by-bite-thesis',
  storageBucket: 'bite-by-bite-thesis.appspot.com',
  messagingSenderId: '244664994766',
  appId: '1:244664994766:web:f0023b96464f995c76799f',
  measurementId: 'G-Y2P8R9WSXZ'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
