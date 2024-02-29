import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'

import {
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,  
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

import {
    collection,
    getFirestore,
    addDoc, 
    serverTimestamp ,
    query,
    where,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyDZNxv9hLjR4Gi1o3qvVQQvS21bMSrblas",
  authDomain: "testing-firebase-45420.firebaseapp.com",
  projectId: "testing-firebase-45420",
  storageBucket: "testing-firebase-45420.appspot.com",
  messagingSenderId: "198508568598",
  appId: "1:198508568598:web:1bbf05b3566bdc681bd537",
  measurementId: "G-FHWHMR4F2R"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
let colRef = collection(db,'Users');

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("loginButton").addEventListener("click", login);
        document.getElementById("signupButton").addEventListener("click", signup);
    });
  
    document.getElementById("signupLink").addEventListener("click", function () {
      toggleForm();
    });
    document.getElementById("loginLink").addEventListener("click", function () {
      toggleForm();
    });

    async function signup() {
      let signupUsername = document.getElementById("signupUsername").value;
      let signupEmail = document.getElementById("signupEmail").value;
      let signupPassword = document.getElementById("signupPassword").value;
  
      const alreadyExists = await checkIfUsernameOrEmailAlreadyExists(signupUsername,signupEmail)
      if(alreadyExists){
        return 
      }
     
      createUserWithEmailAndPassword(auth,signupEmail,signupPassword)
        .then((cred)=>{
            return updateProfile(cred.user, { displayName: signupUsername })
                .then(() => {
                    addingDocument(signupUsername,signupEmail);
                    const username = cred.user.displayName;
                    const encodedUsername = encodeURIComponent(username);
                    let url = `../HomePage/homeScreen.html?username=${encodedUsername}`;
                    window.location.replace(url);
                })
                .catch((error) => {
                    console.error('Display name update error:', error.message);
                });
        }).catch((err)=>{
          console.log(err)
          alert(err.message)
        })
    }
  
  function login() {
    let loginEmail = document.getElementById("loginEmail").value;
    let loginPassword = document.getElementById("loginPassword").value;

    if(!check6DigitPassword(loginPassword)){
      alert("The password should be more than 6 characters.");
      return;
    };

    signInWithEmailAndPassword(auth,loginEmail,loginPassword)
    .then((cred) => {
      const username = cred.user.displayName;
      const encodedUsername = encodeURIComponent(username);
      let url = `../HomePage/homeScreen.html?username=${encodedUsername}`;
      window.location.replace(url);
    })
    .catch((error) => {
      switch (error.code) {
          case "auth/invalid-credential":
              console.error('Invalid credential error:', error.message);
              alert("Invalid credentials. Please check your email and password.");
              break;
          case "auth/user-not-found":
              console.error('User not found error:', error.message);
              alert("User not found. Please check your email.");
              break;
          case "auth/wrong-password":
              console.error('Wrong password error:', error.message);
              alert("Wrong password. Please try again.");
              break;
          default:
              console.error('Unknown error:', error.code, error.message);
              alert("An error occurred. Please try again later.");
              break;
      }
    });
  }

  async function checkIfUsernameOrEmailAlreadyExists(name, email) {
    const nameQuery = query(colRef, where("name", "==", name));
    const emailQuery = query(colRef, where("email", "==", email));

    try {
        const nameSnapshot = await getDocs(nameQuery);
        const emailSnapshot = await getDocs(emailQuery);

        if (!nameSnapshot.empty) {
            alert("Username already exists!");
            return true;
        }

        if (!emailSnapshot.empty) {
            alert("Email already exists!");
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error checking existing username or email:", error);
        alert("An error occurred. Please try again later.");
        return true; 
    }
}

  function toggleForm() {
    document.getElementById("loginContainer").classList.toggle("hidden");
    document.getElementById("signupContainer").classList.toggle("hidden");
  }
  
  async function addingDocument(Uname,Email) {
    try {
        await addDoc(colRef, {
            name: Uname,
            email:Email ,
            createdAt: serverTimestamp(),
        });
        console.log("User saved.");
        return
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

function check6DigitPassword(pass){
  return pass.length >= 6
}