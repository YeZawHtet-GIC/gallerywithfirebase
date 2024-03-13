// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQsXsUI1GSHES_MNmNsT4tlvoOC1xHXyE",
  authDomain: "image-gallery-c0467.firebaseapp.com",
  projectId: "image-gallery-c0467",
  storageBucket: "image-gallery-c0467.appspot.com",
  messagingSenderId: "462530675569",
  appId: "1:462530675569:web:0fb7229b60d5ba675c6cd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);
