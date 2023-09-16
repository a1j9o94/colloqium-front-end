// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable, derived, type Readable } from 'svelte/store';
import { doc, getDoc } from 'firebase/firestore';

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

  const { set, subscribe } = writable<User | null>(null);

  unsubscribe = onAuthStateChanged(auth, (user) => {
    set(user);
  });

  return {
    subscribe,
  };
}

export const user = userStore();

type UserData = {
  associated_senders: string[],
  active_sender?: string,
  user_name?: string,
}


async function fetchUserData(user: User | null): Promise<UserData | null>{
  if(!user){
    console.log('no user');
    return null;
  }

  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    return docSnap.data() as UserData;
  }

  return null;
}

export const userData: Readable<UserData> = derived(user, ($user, set) => {
  (async () => {
    console.log('fetching user data');
    console.log($user);
    const data = await fetchUserData($user);
    console.log(data);
    if(data){
      set(data);
    } else {
      set({
        associated_senders: [],
      });
    }
  })();
});