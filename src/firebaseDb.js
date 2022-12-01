import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyATZATvyyEr5mbahrAxfQZSCjFKMfSa2zQ",
    authDomain: "crudvue-a8af6.firebaseapp.com",
    projectId: "crudvue-a8af6",
    storageBucket: "crudvue-a8af6.appspot.com",
    messagingSenderId: "928835608044",
    appId: "1:928835608044:web:34cd228c030711f2b6f4c9",
    measurementId: "G-L2BJS9EYF8"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export const db = firebaseApp.firestore();