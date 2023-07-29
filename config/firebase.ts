import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPniPBMrQzAFQ4qZpoC2drxNEJOEgNsxA",
  authDomain: "cgpa-calculator-d04cf.firebaseapp.com",
  projectId: "cgpa-calculator-d04cf",
  storageBucket: "cgpa-calculator-d04cf.appspot.com",
  messagingSenderId: "1053601270287",
  appId: "1:1053601270287:web:8614e01fad521138e2b17a",
  measurementId: "G-9JQJXVNYXY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

// const Users = collection(db, "Users");
// export default Users;
