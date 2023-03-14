importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/9.10.0/firebase-app-check-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/9.10.0/firebase-messaging-compat.min.js");
firebase.initializeApp({
 apiKey: "YOURKEY",
 authDomain: "PROJECTID.firebaseapp.com",
 databaseURL: "https://PROJECTID.firebaseio.com",
 projectId: "PROJECTID",
 storageBucket: "PROJECTID.appspot.com",
 messagingSenderId: "YOUR-SENDER-ID",
 appId: "APPID",
 measurementId: "G-measurement-id"
});
const messaging = firebase.messaging();
