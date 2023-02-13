const url = "https://test-82589-default-rtdb.europe-west1.firebasedatabase.app/user.json";

let userArr = [];

async function upsertUser(userObj) {

    await fetchUserList();

    if (!updateUser(userObj)) {
        userArr.push(userObj); 
    }

    userArr.sort((a, b) => {
        return b.score - a.score;
    });

    const init = {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify( userArr ),
        method: "PUT",
    }

    await fetch(url, init);

    console.log("upsert " + userObj.userTag);

    function updateUser(obj) {
        return userArr.some(user => {
            if (user.userTag === obj.userTag) {
                if (obj.score > user.score)
                user.score = obj.score;
                return true;
            }
        }) 
    }

}

async function fetchUserList() {
    const fetches = await fetch(url);

    const data = await fetches.json();

    const users = Object.values(data);

    userArr = users;
}

let start = document.querySelector('.start');
let namnSida = document.querySelector('.name');
let namnInmatning = document.querySelector('#namn');
let spel = document.querySelector('.game');
let playerName = "";
var roundSound;

start.addEventListener('click', (e) => {
    if (namnInmatning.value === "") {
        return;
    }
    e.preventDefault();
    namnSida.style.display = "none";
    spel.style.display = "flex";
    document.body.display = "block";
    const uppercase = namnInmatning.value.charAt(0).toUpperCase()
        + namnInmatning.value.slice(1);
    playerName = uppercase;

    const playerData = {
        userTag: playerName,
        score: 0
    };
    
    upsertUser(playerData);

    select.classList.add("hoverable");
});

let computerImg = document.querySelectorAll('.computer img');
let computerH1 = document.querySelectorAll('.computer h1');
let scoreboard = document.querySelectorAll('.score h1');
let title = document.querySelector('.title');
let imgNr = 0;
let spinDelay = 1000;
let intervalID;
let times = 0;
let msgNbr = 0;

async function resetSpin() {
    imgNr = 0;
    spinDelay = ((Math.random() * 1000) + 1000);
    console.log(spinDelay);
    intervalID;
    times = 0;
    clearInterval(intervalID);
    setTimeout(async () => {
        isSelected = false;
        selected.style.filter = "brightness(100%)"
        selected.style.borderBottom = "none";
        computerH1[1].style.color = "rgba(255, 255, 255, 0)";
        computerH1[0].style.color = "rgba(255, 255, 255, 0)";
        computerH1[1].innerText = "You won!";
        select.classList.add("hoverable");

    }, 2000);

}

let winMsg = ["You can't defeat me!", "I'm better.", "I'm Stronger"]
let playerScore = 0;
let computerScore = 0;
let resetGame = false;

document.addEventListener('click', function (e) {
    if (resetGame) {
        reset();
    }
});

function reset() {
    title.innerText = "";
    playerScore = 0;
    computerScore = 0;
    scoreboard[1].innerText = "";
    scoreboard[2].innerText = "";
    title.style.width = "0";
    resetGame = false;
}

function spin() {
    intervalID = setInterval(spinChoices, (Math.random() * 50) + 30);

    setTimeout(async function() {
        msgNbr++;
        if (msgNbr >= 3) {
            msgNbr = 0;
        }

        clearInterval(intervalID);
        if (getWinner() == "player") {
            computerH1[1].style.color = "white";
            playerScore++;
            roundSound = new Audio("../audio/win sound.mp3");
            roundSound.volume = 0.1;
            roundSound.play();
            
        } else if (getWinner() == "computer") {
            computerH1[0].style.color = "white";
            computerH1[0].innerText = "Computer: " + winMsg[msgNbr];
            roundSound = new Audio("../audio/game over.mp3");
            roundSound.volume = 0.1;
            roundSound.play();
            computerScore++;
            playerScore = 0;

        } else {
            computerH1[1].innerText = "Draw";
            computerH1[1].style.color = "white";
        }
        const playerData = {
            userTag: playerName,
            score: playerScore
        };
    
        await upsertUser(playerData);
        resetSpin();
        scoreboard.forEach(el => {
            el.style.visibility = "visible";
            el.style.fontSize = "22px";
        })
        scoreboard[0].innerText = playerName + ": " + playerScore;
        scoreboard[1].style.borderBottom = "2px solid black";
        scoreboard[2].innerText = (userArr[0] == null) ? "-" : userArr[0].userTag + ": " + userArr[0].score;
        scoreboard[3].innerText = (userArr[1] == null) ? "-" : userArr[1].userTag + ": " + userArr[1].score;
        scoreboard[4].innerText = (userArr[2] == null) ? "-" : userArr[2].userTag + ": " + userArr[2].score;
        scoreboard[5].innerText = (userArr[3] == null) ? "-" : userArr[3].userTag + ": " + userArr[3].score;
        scoreboard[6].innerText = (userArr[4] == null) ? "-" : userArr[4].userTag + ": " + userArr[4].score;
        
        
    }, spinDelay);
    
}

function winnerMessag() {
    roundSound.volume = 0.2;
    if (computerScore > playerScore) {
        title.innerText = "You Lose."
        roundSound = new Audio("../audio/game over.mp3");
        roundSound.play();
    } else if (computerScore == playerScore) {
        title.innerText = "Draw."
        roundSound = new Audio("../audio/game over.mp3");
        roundSound.play();
    } else {
        title.innerText = "You Win!"
        roundSound = new Audio("../audio/win sound.mp3");
        roundSound.play();
    }
    title.style.width = "100%";
}

let computer;
let currItem;

function spinChoices() {
    if (imgNr > 2) {
        imgNr = 0;
    }
    if (times >= 5 && times < 12) {
        clearInterval(intervalID);
        intervalID = setInterval(spinChoices, ((Math.random(100) * 100) + 50));

    } else if (times >= 12) {
        clearInterval(intervalID);
        intervalID = setInterval(spinChoices, ((Math.random(100) * 100) + 100));
    }

    computerImg[0].src = `../img/img${imgNr}.png`;
    let list = ["sten", "sax", "påse"];
    computer = list[imgNr];
    imgNr++;
    times++;

    var snd = new Audio("../audio/spin.wav");
    snd.volume = 0.07;
    snd.play();
}

let select = document.querySelector('.player-choices');
let isSelected = false;
let selected;

select.addEventListener('click', (e) => {
    if (!isSelected) {
        e.target.style.filter = "brightness(90%)"
        e.target.style.borderBottom = "solid 1px black";
        selected = e.target;
        computerImg[1].src = e.target.src;
        currItem = e.target.id;
        
        select.classList.remove("hoverable");
        
        spin();
        isSelected = true;
    }
});

function getWinner() {
    if ((computer == "sten" && currItem == "påse") || (computer == "påse" && currItem == "sax") || (computer == "sax" && currItem == "sten")) {
        
        console.log(currItem + " pc: " + computer);
        return "player";
    } else if (computer != currItem) {
        
        console.log(currItem + " pc: " + computer);
        return "computer";
    }
}



