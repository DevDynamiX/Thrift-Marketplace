// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFMIZplVZkisUCsFxRQ3XM5wYrD3XrHhg",
    authDomain: "marketplace-a829b.firebaseapp.com",
    projectId: "marketplace-a829b",
    storageBucket: "marketplace-a829b.appspot.com",
    messagingSenderId: "333125421850",
    appId: "1:333125421850:web:3a957e7474b761a36dfaa3"
};

// Initialize Firebase
export const Firebase_App = initializeApp(firebaseConfig);
export const Firebase_Auth = getAuth(Firebase_App);