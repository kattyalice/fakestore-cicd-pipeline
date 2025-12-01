import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARVR9liOWK8MgnrCZadJKfIeaPXJN5G7A",
  authDomain: "front-end-fakestore.firebaseapp.com",
  projectId: "front-end-fakestore",
  storageBucket: "front-end-fakestore.firebasestorage.app",
  messagingSenderId: "916602576095",
  appId: "1:916602576095:web:d55eb6a9e6d3951cad9d6a",
  measurementId: "G-PJ0B99LX18"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)