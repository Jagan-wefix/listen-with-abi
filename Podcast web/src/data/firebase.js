import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

// NOTE: fill these env vars in your local .env file
const firebaseConfig = {
   apiKey: "AIzaSyA0pyWwa3euRACqmhrpWXecwUSoBASntCM",
    authDomain: "crud-database-a5e11.firebaseapp.com",
    projectId: "crud-database-a5e11",
    storageBucket: "crud-database-a5e11.appspot.com",
    messagingSenderId: "1018290448536",
    appId: "1:1018290448536:web:bc998aa32d920bfbefc8ed",
    measurementId: "G-FNXLSF5R93"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Initialize Auth and attempt an anonymous sign-in (helpful when Firestore rules require auth)
export const auth = getAuth(app)
// Only auto sign-in in development to avoid unexpected auth in production
if (import.meta.env.MODE === 'development') {
  // Attempt anonymous sign-in; ignore if already signed in or fails
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Anonymous sign-in failed:', err.message || err)
      })
    }
  })
}

export default app
