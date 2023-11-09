import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/* sami firebase 2*/
const firebaseConfig = {
  apiKey: "AIzaSyDTw5p3VRKZOPxotFgxXL90O6tJLxYuIm0",
  authDomain: "plan-b-2.firebaseapp.com",
  projectId: "plan-b-2",
  storageBucket: "plan-b-2.appspot.com",
  messagingSenderId: "1007216126985",
  appId: "1:1007216126985:web:08e2b7e2a0f937065a9cd8",
};

/* sami firebase 
const firebaseConfig = {
  apiKey: "AIzaSyCo5maJADsEmwSlfIps8V3G45Q0zcPqcNc",
  authDomain: "plan-b-79c69.firebaseapp.com",
  projectId: "plan-b-79c69",
  storageBucket: "plan-b-79c69.appspot.com",
  messagingSenderId: "868906146568",
  appId: "1:868906146568:web:74cb2cc04275cb59e2eabd",
};
*/

/* plan-b firebase
const firebaseConfig = {
  apiKey: "AIzaSyB01I6MiT3ObW-bnPhj-IxQ0GuL8-rbbaw",
  authDomain: "plan-b-123.firebaseapp.com",
  projectId: "plan-b-123",
  storageBucket: "plan-b-123.appspot.com",
  messagingSenderId: "63541770753",
  appId: "1:63541770753:web:7fc0698d02520ed2f8de00",
  measurementId: "G-HY3LXNP2ZS",
};
*/

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
