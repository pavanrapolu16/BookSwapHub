 // Initialize Firebase
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD3MKeOjIM29Vm7lMIgDtcOyf1eBcALenw",
  authDomain: "bookswaphub89.firebaseapp.com",
  databaseURL: "https://bookswaphub89-default-rtdb.firebaseio.com",
  projectId: "bookswaphub89",
  storageBucket: "bookswaphub89.appspot.com",
  messagingSenderId: "426458991137",
  appId: "1:426458991137:web:6c90de254edf87a1253160",
  measurementId: "G-SL7GD985G3"
};

firebase.initializeApp(firebaseConfig);

export default firebase;