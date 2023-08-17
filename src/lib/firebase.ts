// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

  let firebaseApp;
  if(!getApps().length){
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
  }

  export const app = firebaseApp;
  export const db = getFirestore();
  export const auth = getAuth();
  export const storage = getStorage();

  /*
  * @returns a store with the current firebase user
  */
 function userStore() {
    let unsubscribe: () => void;

    if(!auth || !globalThis.window){
      console.warn('Firebase auth not initialized');
      const { subscribe } = writable<User | null>(null);
      return { subscribe };
    }

    const { subscribe } = writable(auth?.currentUser, (set) => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        set(user);
      });

      return () => unsubscribe();

    });

    return {
      subscribe,
    };
  }

  export const user = userStore();