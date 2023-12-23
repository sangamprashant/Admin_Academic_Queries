// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdjNoYrLWCE7-f9z6CWmsu3FpWvwYWZSY",
  authDomain: "academic-quries.firebaseapp.com",
  projectId: "academic-quries",
  storageBucket: "academic-quries.appspot.com",
  messagingSenderId: "101909708027",
  appId: "1:101909708027:web:ed3bcdd4a1904e2001045e",
  measurementId: "G-45L2JCLQSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 export const storage =getStorage(app);