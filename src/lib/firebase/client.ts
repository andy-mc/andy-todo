import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/config';

// Singleton pattern para la instancia de Firebase
let firebaseInstance: FirebaseApp | undefined;

export const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseInstance && typeof window !== 'undefined') {
    // Solo inicializa si no existe una instancia y estamos en el cliente
    firebaseInstance = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  }
  
  if (!firebaseInstance) {
    throw new Error('Firebase instance not initialized');
  }

  return firebaseInstance;
};
