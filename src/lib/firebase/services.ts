import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './client';

let dbInstance: Firestore | null = null;

export const getDb = (): Firestore => {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be initialized in the browser');
  }

  if (!dbInstance) {
    const app = getFirebaseApp();
    dbInstance = getFirestore(app);
  }

  return dbInstance;
};

// Initialize Firestore
export const db = typeof window === 'undefined' ? null : getDb();
