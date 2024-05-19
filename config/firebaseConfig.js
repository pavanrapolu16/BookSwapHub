import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bookswaphub89.appspot.com',
  databaseURL: 'https://bookswaphub89-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

export  default  admin
