// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';

const firebaseConfig = {
    apiKey: "AIzaSyDoF7hr-z9aC8oXouVVefLIp0lpNeOnKV0",
    authDomain: "svelte-links.firebaseapp.com",
    projectId: "svelte-links",
    storageBucket: "svelte-links.appspot.com",
    messagingSenderId: "11174077482",
    appId: "1:11174077482:web:dc9de0c984583c814ccf53",
    measurementId: "G-PV6XWL2122"
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