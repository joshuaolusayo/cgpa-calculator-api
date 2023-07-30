"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyCPniPBMrQzAFQ4qZpoC2drxNEJOEgNsxA",
    authDomain: "cgpa-calculator-d04cf.firebaseapp.com",
    projectId: "cgpa-calculator-d04cf",
    storageBucket: "cgpa-calculator-d04cf.appspot.com",
    messagingSenderId: "1053601270287",
    appId: "1:1053601270287:web:8614e01fad521138e2b17a",
    measurementId: "G-9JQJXVNYXY",
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_1.getFirestore)(app);
exports.default = db;
// const Users = collection(db, "Users");
// export default Users;
