import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDF9igRDLgVmYXZbybk17W0nStPUmpCmss",
  authDomain: "peoplepulse-8d008.firebaseapp.com",
  databaseURL: "https://peoplepulse-8d008-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "peoplepulse-8d008",
  storageBucket: "peoplepulse-8d008.firebasestorage.app",
  messagingSenderId: "344489067013",
  appId: "1:344489067013:web:605e9677e0c56d3cc2d26c",
  measurementId: "G-CB4Z7F30TY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Realtime Database
export const database: Database = getDatabase(app);

export default app;
