import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    collection,
    onSnapshot //addition of realtime listener
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

let url = window.location.href;
let urlParams = new URLSearchParams(url.split('?')[1]);
let encodedUser = urlParams.get('username');
let decodedUser = decodeURIComponent(encodedUser);
let collectionHardModeOREasyMode = "HardMode";
if(decodedUser === 'null'){
  let url = `../Login/index.html`;
  window.location.replace(url);
}

initializeApp(firebaseConfig);

//init services
const db = getFirestore(); //our database is stored here 

  const easyModeButton = document.getElementById('easyMode');
  const hardModeButton = document.getElementById('hardMode');

  easyModeButton.addEventListener('click',()=>{
      collectionHardModeOREasyMode = "EasyMode";
      showLeaderBoards();
  })
  hardModeButton.addEventListener('click',()=>{
    collectionHardModeOREasyMode = "HardMode";
    showLeaderBoards();
  })

  document.getElementById('click').addEventListener('click',()=>{
      let url = `../HomePage/homeScreen.html?username=${encodedUser}`;
      window.location.replace(url); 
  })

function showLeaderBoards(){
  //specific collection reference
  const colRef = collection(db,collectionHardModeOREasyMode);
  let leaderboardData = [];

    onSnapshot(colRef,(snapshot)=>{
        let scores = [];
        console.log(snapshot.docs)
        //we push the colledction data into out array everytime there is a change in a collection
        snapshot.docs.forEach((doc)=>{
            //we are basically pushing data in the form of object that consists the returned data and an extra id variable 
            scores.push({...doc.data()}) //.data() method returns the data in object form
          })

        //console.log("This is collection log : ",scores);
        scores.sort((a, b) => b.score - a.score);
        let i = 1;
        leaderboardData = []
        scores.forEach((obj)=>{
            leaderboardData.push({...obj,rank: i}) 
            i++;
        })
        console.log(leaderboardData);
        LeaderBoards(leaderboardData);
    })
}

   // Function to make the leaderboard
   function LeaderBoards(leaderboardData) {
    const leaderboardBody = document.getElementById("leaderboardBody");

    // Clear existing rows
    leaderboardBody.innerHTML = "";

  
    for (let i = 0; i < leaderboardData.length; i++) {
      let row = leaderboardBody.insertRow(i);
      let rankCell = row.insertCell(0);
      let playerNameCell = row.insertCell(1);
      let scoreCell = row.insertCell(2);

      rankCell.textContent = leaderboardData[i].rank;
      playerNameCell.textContent = leaderboardData[i].name;
      scoreCell.textContent = leaderboardData[i].score;
    }
  }

