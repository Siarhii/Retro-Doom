//i have to make it so that IT wont replace highscore,rightnow its adding a doc everytime a player plays
//add 2 conditions -> first check if there is someone with the same username,if there is,check if the score of his is higher than current score,if yes then dont update the doc,if no then update the highscore
//making reloading mechanism more efficient

//added 0.05ms for buffer
//rifle sound  - 950 ms
//pistol - 450ms
//shorgun = 1350ms
//reloding - 1250ms
//swaping - 750ms
//dying - 140ms (no buffer for dying)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    collection,
    serverTimestamp,
    addDoc,
    doc,
    where,
    getDocs,
    query,
    updateDoc,
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

let url = window.location.href;
let urlParams = new URLSearchParams(url.split('?')[1]);
let decodedMode = decodeURIComponent(urlParams.get('gamemode'));
let decodedUsername = decodeURIComponent(urlParams.get('username'));

if(decodedUsername === 'null'){
    window.location.replace("./Login/index.html");
    if(decodedMode !== 'null' || decodedMode !== 'null'){
        let url = `../HomePage/homeScreen.html?username=${encodedName}`;
        window.location.replace(url);
    }
}

//init services
const db = getFirestore(); //our database is stored here 
let colRef;
//specific collection reference
setTimeout(()=>{
    colRef = collection(db, decodedMode);
},1000)

const canvas = document.querySelector('canvas');

if(isMobileDevice()){
    // canvas.width = 1366;
    // canvas.height = 768;

    canvas.width = 1362;
    canvas.height = 600;
  
} else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const c = canvas.getContext('2d');

//variables
let time = 60;
let gameOver = false;
let score = 0;
let fontSizeSmall = 20;
let fontsizeLarge = 50;
let buttonSizeMobile = 50;
let gameMode = decodedMode;
const mouseCoordiates = {
    x:null,
    y:null
}

//background image
const img = new Image();
img.src = "./Images/bg2.png";

//Crosshairs
const crosshair = new Image();
crosshair.src = "./Images/crosshair.png";
const shotgunCrosshair = new Image();
shotgunCrosshair.src = "./Images/shotgunCrosshair.png";

//sounds
const revshot = new Audio('./Sounds/revshot.mp3');
const shotgunshot = new Audio('./Sounds/shotgunshot.mp3');
const rifleshot = new Audio('./Sounds/rifleshot.mp3');
const swapSound = new Audio('./Sounds/swap.mp3');
const hit = new Audio('./Sounds/hit.mp3'); //used hit sound for dead 
const reloadSound = new Audio('./Sounds/reload.mp3');
const dead = new Audio('./Sounds/dead.mp3'); //used dead sound for damage/hit

//Adding buttons to swap guns in Mobile devices
if(isMobileDevice()){
    fontSizeSmall = 18;
    fontsizeLarge = 40;
    const button = document.createElement("button");
    button.style.position = "absolute";
    button.style.top = `${canvas.height * 0.3}px`;
    button.style.left = `${canvas.width * 0.05}px`;
    button.style.width = `${buttonSizeMobile}px`;
    button.style.height = `${buttonSizeMobile}px`;
    button.style.zIndex = "1"; // to make button appear above canvas
    button.style.backgroundImage = "url('./Images/Guns/revolverMobile.png')"; 
    button.style.backgroundSize = "cover"; 
    button.style.backgroundPosition = "center"; 
    button.style.backgroundColor = "red";
    document.body.appendChild(button);
    button.addEventListener('click',(e)=>{
        if(gameOver === false){
            swapGun(revolver);
        } 
    })
    
    const shotgunButton = document.createElement("button");
    shotgunButton.style.position = "absolute";
    shotgunButton.style.top = `${canvas.height * 0.4}px`;
    shotgunButton.style.left = `${canvas.width * 0.05}px`;
    shotgunButton.style.width = `${buttonSizeMobile}px`;
    shotgunButton.style.height = `${buttonSizeMobile}px`;
    shotgunButton.style.zIndex = "1"; // to make button appear above canvas
    shotgunButton.style.backgroundImage = "url('./Images/Guns/shotgunMobile.png')"; 
    shotgunButton.style.backgroundSize = "cover"; 
    shotgunButton.style.backgroundPosition = "center"; 
    document.body.appendChild(shotgunButton); 
    shotgunButton.addEventListener('click',(e)=>{
        if(gameOver === false){
            swapGun(shotgun);
        }
    })

    const ArButton = document.createElement("button");
    ArButton.style.position = "absolute";
    ArButton.style.top = `${canvas.height * 0.5}px`;
    ArButton.style.left = `${canvas.width * 0.05}px`;
    ArButton.style.width = `${buttonSizeMobile}px`;
    ArButton.style.height = `${buttonSizeMobile}px`;
    ArButton.style.zIndex = "1"; // to make button appear above canvas
    ArButton.style.backgroundImage = "url('./Images/Guns/arMobile.png')"; 
    ArButton.style.backgroundSize = "cover"; 
    ArButton.style.backgroundPosition = "center";
    document.body.appendChild(ArButton); 
    ArButton.addEventListener('click',(e)=>{
        if(gameOver === false){
            swapGun(rifle);
        }
    })

    const reloadButton = document.createElement("button");
    reloadButton.style.position = "absolute";
    reloadButton.style.top = `${canvas.height * 0.6}px`;
    reloadButton.style.left = `${canvas.width * 0.05}px`;
    reloadButton.style.width = `${buttonSizeMobile}px`;
    reloadButton.style.height = `${buttonSizeMobile}px`;
    reloadButton.style.zIndex = "1"; // to make button appear above canvas
    reloadButton.style.backgroundImage = "url('./Images/reloadButton.jpeg')"; 
    reloadButton.style.backgroundSize = "cover"; 
    reloadButton.style.backgroundPosition = "center";
    document.body.appendChild(reloadButton); 
    reloadButton.addEventListener('click',(e)=>{
        if(gameOver === false){
            reload(currentGunRef);
        }
    })
}

//Event listeners - mouse coordinates ,resizing ,gunchange ,firing 
canvas.addEventListener('mousemove',canvasMousemove)
canvas.addEventListener('click',canvasClick)
window.addEventListener('keypress',windowKeypress)
window.addEventListener('resize',function(){
    if(!isMobileDevice()){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
})

//Ending game/GameOver
setTimeout(() => {
    gameOver = true;
    c.font = `${fontsizeLarge}px "Press Start 2P", extrabold`;
    setTimeout(()=>{
        canvas.removeEventListener('click',canvasClick);
    },1500)
    canvas.removeEventListener('mousemove',canvasMousemove)
    window.removeEventListener('keypress',windowKeypress);
    
    c.drawImage(img, 0, 0, canvas.width,canvas.height);

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    
    let gameOverText = "Game over";
    let gameOverTextWidth = c.measureText(gameOverText).width;
    c.fillText(gameOverText, centerX - gameOverTextWidth / 2, centerY - 50);
    
    let scoreText = "Your Score : " + score;
    let scoreTextWidth = c.measureText(scoreText).width;
    c.fillText(scoreText, centerX - scoreTextWidth / 2, centerY + 50);

    //Play Again and Leaderboards Button
    const playAgainButton = document.createElement("button");
    playAgainButton.style.position = "absolute";
    playAgainButton.style.top = `${canvas.height * 0.65}px`;
    playAgainButton.style.left = `${canvas.width * 0.35}px`;
    playAgainButton.style.width = `${buttonSizeMobile * 3.5}px`;
    playAgainButton.style.height = `${buttonSizeMobile * 2}px`;
    playAgainButton.style.border = `0px`;
    playAgainButton.style.zIndex = "1"; // to make button appear above canvas
    playAgainButton.style.backgroundImage = "url('./Images/playAgainImage.png')"; 
    playAgainButton.style.backgroundSize = "cover"; 
    playAgainButton.style.backgroundPosition = "center"; 
    playAgainButton.style.backgroundColor = "transparent";
    document.body.appendChild(playAgainButton);
    playAgainButton.addEventListener('click',(e)=>{
        const encodedUsername = encodeURIComponent(decodedUsername);
        let url = `./HomePage/homeScreen.html?username=${encodedUsername}`;
        window.location.replace(url);
    })

    const leaderboardButton = document.createElement("button");
    leaderboardButton.style.position = "absolute";
    leaderboardButton.style.top = `${canvas.height * 0.65}px`;
    leaderboardButton.style.left = `${canvas.width * 0.55}px`;
    leaderboardButton.style.width = `${buttonSizeMobile * 3.5}px`;
    leaderboardButton.style.height = `${buttonSizeMobile * 2}px`;
    leaderboardButton.style.border = `0px`;
    leaderboardButton.style.zIndex = "1"; // to make button appear above canvas
    leaderboardButton.style.backgroundImage = "url('./Images/leaderboard.png')"; 
    leaderboardButton.style.backgroundSize = "cover"; 
    leaderboardButton.style.backgroundPosition = "center"; 
    leaderboardButton.style.backgroundColor = "transparent";
    document.body.appendChild(leaderboardButton);
    leaderboardButton.addEventListener('click',(e)=>{
        const encodedUsername = encodeURIComponent(decodedUsername);
        let url = `./LeaderBoards/Leaderboards.html?username=${encodedUsername}`;
        window.location.replace(url);
    })

    let q = query(colRef, where("name", "==", decodedUsername));
    
    getDocs(q)
    .then((querySnapshot) => {
        if (!(querySnapshot.empty)) {
            querySnapshot.forEach((docu) => {
                if(docu.data().score < score){
                    const docRef = doc(db,decodedMode,docu.id);
                    updateDoc(docRef,{
                        score:score
                    })
                    console.log("Document Updated!")
                }
            });
        } else {
           addingDocument();
        }
    })
    .catch((error) => {
        console.error("Error getting documents:", error);
    });

}, time * 1000);

//timer
setInterval(()=>{
    time -= 1
},1000)

//CLASSES
//Guns
function gun ( x, y, magSize, reloadtime, dmg ,imgSrc,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.magSize = magSize;
    this.bullets = magSize;
    this.reloadtime = reloadtime;
    this.damage = dmg
    this.image = new Image();
    this.image.src = imgSrc;
    this.reloading = false;
    
    this.draw = function(){
        //c.fillStyle = "green";
        //c.fillRect(this.x,this.y,this.width,this.height);  
        c.drawImage(this.image, this.x, this.y,this.width, this.height);
    }        

    this.update = function(){
        this.draw();
    }

    this.setImage = function (imgSrc){
        this.image.src = imgSrc;
    }
}

//enemies
function pigEnemy(x,y,width,height,dx,dy,imgSrc,movement){
    this.x = x;
    this.y = y ;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
   
    this.health = 60
    this.frameCounter = 0;
    this.currentFrame = 1;
    this.image = new Image();
    this.image.src = imgSrc;
    this.directionOfMovement = movement;
    this.points = 1;
  
    this.draw = function(){
        c.fillStyle = "green";
        //c.fillRect(this.x,this.y,this.width,this.height);  
        c.drawImage(this.image, this.x, this.y, 104, 96);
    }        

    this.update = function(){
        this.x += this.dx;

        this.draw();
    }
    this.setImage = function (imgSrc){
        this.image.src = imgSrc;
    }
}

function sunEnemy(x,y,r,dx,dy,imgSrc){
    this.x = x;
    this.y = y ;
    this.r = r;
    this.health = 60
    this.maxRadius = 20;
    this.minRadius = r;
    this.dx = dx;
    this.dy = dy;
    this.frameCounter = 0;
    this.currentFrame = 1;
    this.image = new Image();
    this.image.src = imgSrc;
    this.offset = r + 8;
    this.points = 2;
   
    this.draw = function(){
        // c.beginPath();
        // c.arc(this.x,this.y,this.r,0,2*Math.PI,false);
        // c.strokeStyle = `white`;
        // c.stroke();
        // c.fillStyle = `green`;
        // c.fill();

        c.drawImage(this.image, this.x-(this.offset+4), this.y-this.offset, 104, 96);
    }

    this.update = function(){
        if(this.x + this.r>innerWidth || this.x - this.r < 0){
            this.dx = -this.dx;
        }
        if(this.y + this.r>innerHeight || this.y - this.r < 0){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

    this.setImage = function (imgSrc){
        this.image.src = imgSrc;
    }
}

function eyeEnemy (x,y,r,imgSrc){
    sunEnemy.call(this,x,y,r,0,0,imgSrc);
    this.health = 90;
    this.points = 3;

    this.draw = function(){
        c.drawImage(this.image, this.x-this.offset, this.y-this.offset, 120, 120);
    }
}

//INIIALISING Guns
const revolver = new gun(canvas.width-(canvas.width/2),canvas.height-(canvas.height * 0.184),6,1000,45,"./Images/Guns/revolver.png",canvas.width * 0.1, canvas.height * 0.2);

const shotgun = new gun(canvas.width-(canvas.width/2),canvas.height-(canvas.height * 0.184),2,2000,100,"./Images/Guns/shotgun.png",canvas.width * 0.1, canvas.height * 0.20);

const rifle = new gun(canvas.width-(canvas.width/2),canvas.height-(canvas.height * 0.184),30,2000,89,"./Images/Guns/ar.png",canvas.width * 0.1, canvas.height * 0.2);

let currentGunRef = revolver;


//shooting/clicking

//arrays to store live enemies
let sunEnemies = [];
let pigEnemies = [];
let eyeEnemies = [];
let eyeEnemyScreenTime = 2000;
let negativeScorePoints = 0; //this will be -1 for hard mode

//generating enemies
//eyeEnemy
setInterval(()=>{
    if(eyeEnemies.length<2){
        let r = 60;
        let offset = r;
        let x = Math.random() * (canvas.width - (r*2)) + r;
        let y = Math.random() * (canvas.height - (r*2)) + r;
    
        let e1 = new eyeEnemy(x,y,r,"./Images/eyeEnemy/0.png");
        e1.offset = offset;
        setInterval(()=>{
            let index = eyeEnemies.indexOf(e1);
            if (index !== -1) {
                eyeEnemies.splice(index, 1);
                score -= negativeScorePoints
            }
            e1.r = 0;
        },eyeEnemyScreenTime)
        eyeEnemies.push(e1);
    }
},5000)

//pigEnemy
setInterval(()=>{
    if(pigEnemies.length < 2){
        let directionOfMovement = Math.random() < 0.5 ? "LeftToRight" : "RightToLeft";
        let width = 100;
        let height = 100;
        let rectX;
        let rectY = canvas.height * 0.76;
        let dy = 0;
        let dx;
        let imgSrc;
        if(directionOfMovement === "LeftToRight"){
            rectX = Math.floor(Math.random() * (canvas.width - (canvas.width * 0.40)));
            dx = 3;
            imgSrc = "./Images/pigEnemy/right0.png"
        }
        else if(directionOfMovement === "RightToLeft"){
            rectX = Math.floor(Math.random() * (canvas.width - width)); 
            dx = -3
            imgSrc = "./Images/pigEnemy/left0.png"
        }
        const e1 = new pigEnemy(rectX,rectY,width,height,dx,dy,imgSrc,directionOfMovement);
        pigEnemies.push(e1);
    }
},3000)

//pigEnemy
setInterval(()=>{
    if(sunEnemies.length < 2){
        let r = 40;
        let x = Math.random() * (canvas.width - (r*2)) + r;
        let y = Math.random() * (canvas.height - (r*2)) + r;
        let dx = (Math.random() - 0.5) * 5;
        let dy = (Math.random() - 0.5) * 5;
        const e1 = new sunEnemy(x,y,r,dx,dy,"./Images/sunEnemy/0.png");
        sunEnemies.push(e1);
    }

    //pig Out of screen
    for (let i = 0; i < pigEnemies.length; i++) {
        if (
            pigEnemies[i].x + pigEnemies[i].width < 0 ||
            pigEnemies[i].x > canvas.width
        ) {
            score -= negativeScorePoints;
            pigEnemies.splice(i, 1);
        }
    } 
},1000)

//hard mode 
if(gameMode === "HardMode"){
    eyeEnemyScreenTime = 1000;
    negativeScorePoints = 1;
    setInterval(()=>{
        
            for(let i=0;i<sunEnemies.length;i++){
                sunEnemies[i].dx = (Math.random() - 0.5) * 10;
                sunEnemies[i].dy = (Math.random() - 0.5) * 10;
                sunEnemies[i].points = 3;
            }
            for(let i=0;i<pigEnemies.length;i++){
                pigEnemies[i].dx = pigEnemies[i].dx * 1.2;
            }
            for(let i=0;i<eyeEnemies.length;i++){
                eyeEnemies[i].points = 2
            }

    },200)
}

//animation
function animate(){
 if(gameOver == false){

        //leveling it so that all devices will show same speed
        setTimeout(()=>{
            requestAnimationFrame(animate);
        },10)

        c.clearRect(0,0,innerWidth,innerHeight);

        //background here
        c.drawImage(img, 0, 0, canvas.width,canvas.height);
  
        //updating enemies position on canvas
        for(let i=0;i<sunEnemies.length;i++){
            const enemy = sunEnemies[i];
            enemy.frameCounter++;
            if(enemy.frameCounter % 10 === 0) {
                enemy.currentFrame = (enemy.currentFrame + 1) % 4; // Update the current frame index
                
                let imgSrc = `./Images/sunEnemy/${enemy.currentFrame}.png`;
                enemy.setImage(imgSrc); // Update sun enemy with the new image frame
            }
            sunEnemies[i].update();
        }

        for(let i=0;i<pigEnemies.length;i++){
            const enemy = pigEnemies[i];
            enemy.frameCounter++;
            if(enemy.frameCounter % 10 === 0) {
                enemy.currentFrame = ((enemy.currentFrame + 1) % 7); 
                let imgSrc;
                if(enemy.directionOfMovement === "LeftToRight"){
                    imgSrc = `./Images/pigEnemy/right${enemy.currentFrame}.png`;
                }
                else {
                    imgSrc = `./Images/pigEnemy/left${enemy.currentFrame}.png`;
                }
                enemy.setImage(imgSrc); 
            }
            pigEnemies[i].update();
        }

        for(let i=0;i<eyeEnemies.length;i++){
            const enemy = eyeEnemies[i];
            enemy.frameCounter++;
            if(enemy.frameCounter % 10 === 0) {
                enemy.currentFrame = (enemy.currentFrame + 1) % 5; 
                
                let imgSrc = `./Images/eyeEnemy/${enemy.currentFrame}.png`;
                enemy.setImage(imgSrc); 
            }
            eyeEnemies[i].update();
        }

            //updating gun image
            currentGunRef.update();
    }
    drawAimPointer(mouseCoordiates.x,mouseCoordiates.y);

    //displaying score,time,bullets on canvas
    c.font = `${fontSizeSmall}px "Press Start 2P", extrabold`;
    c.fillStyle = 'white';

    // Score at top left
    c.fillText("Score: " + score, canvas.width * 0.02, canvas.height * 0.04);

    //Bullets at top right
    c.fillText("Bullets: "+`${currentGunRef.bullets}`, canvas.width - (canvas.width * 0.15), (canvas.height * 0.04));

    // Time at top middle
    let timeText = "Time: " + time;
    let timeTextWidth = c.measureText(timeText).width;
    c.fillText(timeText, (canvas.width - timeTextWidth) / 2, canvas.height * 0.04);
}

animate();

//fire shakescreen effect
function shakeScreen(i) {
    const intensity = i; 
    const duration = 200; 
    const startTime = Date.now();
    let offsetX = 0;
    let offsetY = 0;

    function updatePosition() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
            offsetX = Math.random() * intensity * 2 - intensity;
            offsetY = Math.random() * intensity * 2 - intensity;

            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            requestAnimationFrame(updatePosition);
        } else {
            canvas.style.transform = "translate(0, 0)";
        }
    }
    updatePosition();
}

//Event Listeners Functions
function canvasClick(){  
    if(currentGunRef === revolver && currentGunRef.reloading === false){
        revolver.image.src = "./Images/Guns/revolverFlash.png";
        setTimeout(() => {
            revolver.image.src = "./Images/Guns/revolver.png";
            revshot.play();
        }, 200);
        shakeScreen(4);
        pauseFire(600);
        revolver.bullets--; 
        if(currentGunRef.bullets === 0){
           setTimeout(()=>{
            reload(currentGunRef);
           },100);
        }
    }else if(currentGunRef === shotgun && currentGunRef.reloading === false){
        shotgun.image.src = "./Images/Guns/shotgunFlash.png";
        setTimeout(() => {
            shotgun.image.src = "./Images/Guns/shotgun.png";
            shotgunshot.play();
        }, 200);
        shakeScreen(10);
        pauseFire(1400);
        shotgun.bullets--;
        if(currentGunRef.bullets === 0){
            setTimeout(()=>{
                reload(currentGunRef);
               },100);
         }
    }else if(currentGunRef === rifle && currentGunRef.reloading === false){
        rifle.image.src = "./Images/Guns/arFlash.png";
        setTimeout(() => {
            rifle.image.src = "./Images/Guns/ar.png";
            rifleshot.play();
        }, 200);
        shakeScreen(3);
        shakeScreen(3);
        shakeScreen(3);
        pauseFire(800);
        rifle.bullets = rifle.bullets - 3;
        if(currentGunRef.bullets === 0){
            setTimeout(()=>{
                reload(currentGunRef);
               },100);
         }
    }
    
    //checking HitMark,Damage
    //sunEnemies
    for(let i=0;i<sunEnemies.length;i++){
        if (
            mouseCoordiates.x > sunEnemies[i].x - sunEnemies[i].r &&
            mouseCoordiates.x < sunEnemies[i].x + sunEnemies[i].r &&
            mouseCoordiates.y > sunEnemies[i].y - sunEnemies[i].r &&
            mouseCoordiates.y < sunEnemies[i].y + sunEnemies[i].r 
            && currentGunRef.reloading === false   
        ) {
                sunEnemies[i].health-=currentGunRef.damage
                crosshair.src = "./Images/hitmark.png"
                shotgunCrosshair.src = "./Images/hitmark.png"
                setTimeout(()=>{
                    crosshair.src = "./Images/crosshair.png"
                    shotgunCrosshair.src = "./Images/shotgunCrosshair.png"
                },200)
                if(sunEnemies[i].health <= 0){
                    score += sunEnemies[i].points;
                    sunEnemies.splice(i,1);
                    hit.play();
                    break;
                 }
                 else {
                    dead.play();
                    break;
                 }
        }  
    }
    //pigEnemies
    for(let i=0;i<pigEnemies.length;i++){
        if (
            mouseCoordiates.x > pigEnemies[i].x - pigEnemies[i].width  &&
            mouseCoordiates.x < pigEnemies[i].x + pigEnemies[i].width &&
            mouseCoordiates.y > pigEnemies[i].y - pigEnemies[i].height  &&
            mouseCoordiates.y < pigEnemies[i].y + pigEnemies[i].height
            && currentGunRef.reloading === false 
        ) {
            pigEnemies[i].health-=currentGunRef.damage
            crosshair.src = "./Images/hitmark.png"
            shotgunCrosshair.src = "./Images/hitmark.png"
            setTimeout(()=>{
                crosshair.src = "./Images/crosshair.png"
                shotgunCrosshair.src = "./Images/shotgunCrosshair.png"
            },200)
            if(pigEnemies[i].health <= 0){
                score += pigEnemies[i].points;
                pigEnemies.splice(i,1);
                hit.play();
                break;
            }
             else {
                dead.play();
            }
        }
    } 
    //eyeEnemies
    for(let i=0;i<eyeEnemies.length;i++){
        //for eyeEnemies
        if (
            mouseCoordiates.x > eyeEnemies[i].x - eyeEnemies[i].r &&
            mouseCoordiates.x < eyeEnemies[i].x + eyeEnemies[i].r &&
            mouseCoordiates.y > eyeEnemies[i].y - eyeEnemies[i].r &&
            mouseCoordiates.y < eyeEnemies[i].y + eyeEnemies[i].r
            && currentGunRef.reloading === false 
          ) {
            eyeEnemies[i].health-=currentGunRef.damage
            crosshair.src = "./Images/hitmark.png"
            shotgunCrosshair.src = "./Images/hitmark.png"
            setTimeout(()=>{
                crosshair.src = "./Images/crosshair.png"
                shotgunCrosshair.src = "./Images/shotgunCrosshair.png"
            },200)
             if(eyeEnemies[i].health <= 0){
                score += eyeEnemies[i].points;
                eyeEnemies.splice(i,1);
                hit.play();
                break;
             }
             else {
                dead.play();
             }
          }  
    } 
}
//swapguns and reload
function windowKeypress(e){
    if(e.key == "1" && currentGunRef != revolver){
         swapGun(revolver);  
    }
    if(e.key == "2" && currentGunRef != rifle){
        swapGun(rifle);   
    }
    if(e.key == "3" && currentGunRef != shotgun){
        swapGun(shotgun);
    }
    if(e.key == "r"){
        reload(currentGunRef);
    }
 }

function canvasMousemove(e){
    const rect = canvas.getBoundingClientRect();
    mouseCoordiates.x = e.clientX - rect.left;
    mouseCoordiates.y = e.clientY - rect.top;
    
    currentGunRef.x = mouseCoordiates.x - (canvas.width * 0.08/2);
}

//to reduce spam (halts gun fire for specified time after each click)
function pauseFire(duration){
    canvas.removeEventListener('click',canvasClick)
    setTimeout(()=>{
        canvas.addEventListener('click',canvasClick)
    },duration)
}

function drawAimPointer(x, y) {
     canvas.style.cursor = "none";
     if(gameOver){
        canvas.style.cursor = "auto";
     }
    // const pointerSize = 10; // Adjust the size of the pointer
    // c.beginPath();
    // c.arc(x, y, pointerSize, 0, Math.PI * 2);
    // c.fillStyle = "green"; // Set the color of the pointer
    // c.fill();
    // c.closePath();
    if(currentGunRef.reloading === true){
        crosshair.src = "";
        shotgunCrosshair.src = "";
    }
        if(currentGunRef === shotgun){
            c.drawImage(shotgunCrosshair,x-32.5, y-32.5, 40, 40);
        }
        else {
            c.drawImage(crosshair,x-32.5, y-32.5, 40, 40);
        }  
}

function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const userAgent = navigator.userAgent;
    return mobileRegex.test(userAgent);
}

function swapGun(swapedGunRef){
    if(currentGunRef.reloading === true ){
        crosshair.src = "./Images/crosshair.png"
        shotgunCrosshair.src = "./Images/shotgunCrosshair.png"
    }
    swapSound.play();
    currentGunRef = swapedGunRef;
    window.removeEventListener('keypress',windowKeypress);
    setTimeout(()=>{
        window.addEventListener('keypress',windowKeypress);
    },800)  
}

function reload(currentGunReference){
    reloadSound.play();
    currentGunReference.reloading = true
    setTimeout(()=>{
        currentGunReference.bullets = currentGunReference.magSize
        currentGunReference.reloading = false
        crosshair.src = "./Images/crosshair.png"
        shotgunCrosshair.src = "./Images/shotgunCrosshair.png"
    },currentGunReference.reloadtime) 
}

async function addingDocument() {
    try {
        await addDoc(colRef, {
            name: decodedUsername,
            score: score,
            createdAt: serverTimestamp(),
        });
        console.log("Score saved");
        return encodeURIComponent(decodedUsername);
    } catch (error) {
        console.error("Error saving score:", error);
    }
}
