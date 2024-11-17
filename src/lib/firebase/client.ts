import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/config';

let firebaseInstance: FirebaseApp | undefined;

export const getFirebaseApp = (): FirebaseApp => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in the browser');
  }

  if (!firebaseInstance) {
    if (!getApps().length) {
      firebaseInstance = initializeApp(firebaseConfig);
    } else {
      firebaseInstance = getApps()[0];
    }
  }

  return firebaseInstance;
};
