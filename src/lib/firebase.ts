// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWXMpFnNQGcBvkbMzB7jgfa0id-BXcVoQ",
  authDomain: "colloqium-fd5b6.firebaseapp.com",
  projectId: "colloqium-fd5b6",
  storageBucket: "colloqium-fd5b6.appspot.com",
  messagingSenderId: "1058418476196",
  appId: "1:1058418476196:web:2d201500fc6adb40999231",
  measurementId: "G-Y250MPMT8F"
};


  export const app = initializeApp(firebaseConfig);
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