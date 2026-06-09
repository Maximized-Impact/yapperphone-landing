import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

export const createGiftCheckout = httpsCallable(functions, 'createGiftCheckout');

// Waitlist email capture. Requires a deployed Cloud Function named 'joinWaitlist'
// (input: { email }). Until it is deployed, the form shows a Discord fallback.
export const joinWaitlist = httpsCallable(functions, 'joinWaitlist');

// Reads counters/originals.count (public per firestore.rules:103).
// Returns the count of CLAIMED founders, or null on any failure.
// Callers display (count + 1) as the next Founder number.
export async function getFoundersCount() {
  try {
    const snap = await getDoc(doc(db, 'counters', 'originals'));
    if (!snap.exists()) return null;
    const v = snap.data()?.count;
    return typeof v === 'number' ? v : null;
  } catch (err) {
    console.warn('Founders counter read failed:', err);
    return null;
  }
}
