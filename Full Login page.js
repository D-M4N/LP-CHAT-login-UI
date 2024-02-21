//APP LOGIN INITIALIZATION

import { initializeApp } from "firebase/app"

import {
    getAuth
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCXImSzbJhdzmVkcMzZc8LgN9EDaCH6WUw",
    authDomain: "lowpro-chat.firebaseapp.com",
    projectId: "lowpro-chat",
    storageBucket: "lowpro-chat.appspot.com",
    messagingSenderId: "401818287275",
    appId: "1:401818287275:web:2d2e236e4c9d94a3cc0bee",
    measurementId: "G-BB1WMBCHER"
  };
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)



//REGISTRATION


import {
    createUserWithEmailAndPassword,
        sendEmailVerification
} from "firebase/auth";

const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(auth.currentUser)
}


// LOGIN


import {
    signInWithEmailAndPassword
} from "firebase/auth";

const signin = (email, password) => signInWithEmailAndPassword(auth, email, password)


// LOGOUT


import {
    signOut
} from "firebase/auth";

const signout = () => signOut(auth)


//PASSWORD RESET

import {
    sendPasswordResetEmail
} from "firebase/auth";

const resetPassword = email => sendPasswordResetEmail(auth, email)



// CALL AN AUTHENTICATED API ENDOPOINT 



//Now, we want to be able to prevent unauthorized users from accessing other people’s data. For this tutorial, 
//let’s use the example of a note system: anyone can write notes to themselves, 
//but you should only be able to read your own notes.
//To deal with authorization, you need to define additional Firebase Security Rules in your Firestore settings:



//match /note/{noteId} {
  //  allow write: if request.auth != null;
    //allow read: if request.auth.uid == resource.data.author;
//}


//The aforementioned security rule says that for the note collection, 
//anyone can write notes as long as they are authenticated. 
//But you’ll need to be the author of the note to be able to read it.

//We can test it out with the following piece of code. First, 
//we add a note containing the current user’s uid as the author, 
//and then we ask Firestore to return all the notes that belong to the same users:



//const db = getFirestore(app)

//const user = auth.currentUser

//await addDoc(collection(db, "note"), {
    //name: "my first note",
    //author: user.uid
//})

//await addDoc(collection(db, "note"), {
  //  name: "my second note",
    //author: "another random uid"
//})

//const res = await getDocs(query(collection(db, "note"), where("author", "==", user.uid)))

//res.forEach(s => console.log({
  //  id: s.id,
    //...s.data()
//}))


// output: displays the note "my first note"
//If you don’t add the where clause, 
//Firestore will return a Permission Denied error because you aren’t authorized to access data that doesn’t belong to you.

//Similarly, if the author’s uid is different from yours, it won’t be displayed.