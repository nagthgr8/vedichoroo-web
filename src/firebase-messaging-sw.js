importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/9.10.0/firebase-app-check-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/9.10.0/firebase-messaging-compat.min.js");
firebase.initializeApp({
 apiKey: "AIzaSyAzrw7lAaLDXNj7X8bGtY7V1LNqaMlGPYI",
 authDomain: "astrology-e9e07.firebaseapp.com",
 databaseURL: "https://astrology-e9e07.firebaseio.com",
 projectId: "astrology-e9e07",
 storageBucket: "astrology-e9e07.appspot.com",
 messagingSenderId: "242286730499",
 appId: "1:242286730499:android:2f30c2e339a0b7aes",
 measurementId: "G-measurement-id"
});
const messaging = firebase.messaging();