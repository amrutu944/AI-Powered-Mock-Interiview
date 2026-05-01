import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
// import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDFfqMD45OeZHL93uUWafwPeMnh9FjW7Hg",
  authDomain:"interviewprep-app-b6688.firebaseapp.com",
  projectId: "interviewprep-app-b6688",
  storageBucket: "interviewprep-app-b6688.firebasestorage.app",
  messagingSenderId: "300713388673",
  appId: "1:300713388673:web:9ae4ee41e7d682b3ebfb80",
};

export const firebaseApp = initializeApp(firebaseConfig); 
export const auth = getAuth(firebaseApp);
// export const db = getFirestore(); 
