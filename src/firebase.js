import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBIBwEbzAQ2Y9awNZLYqRCA7iGquwIkuf8",
  authDomain: "org-maximpact-yapper.firebaseapp.com",
  projectId: "org-maximpact-yapper",
  storageBucket: "org-maximpact-yapper.firebasestorage.app",
  messagingSenderId: "561116056516",
  appId: "1:561116056516:web:fe65f780fa7c0e8e93f291",
  measurementId: "G-STMQZSY9TP"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export const createGiftCheckout = httpsCallable(functions, 'createGiftCheckout');
