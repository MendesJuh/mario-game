const assets = {
    clouds: "./assets/clouds.png",
    mario: "./assets/mario.gif",
    deadMario: "./assets/game-over.png",
    pipe: "./assets/pipe.png",
    coin: "./assets/coin.gif",
}

let score = 0;
let speed = 10;
const gameBoardDiv = document.querySelector('.game-board');
const gameBoard = {
    width: gameBoardDiv.offsetWidth,
    height: gameBoardDiv.offsetHeight
}

var marioElement = `<img id="mario" src="${assets.mario}" />`;
var pipeElement = `<img id="pipe" src="${assets.pipe}" />`;
var coinElement = `<img id="coin" src="${assets.coin}" />`;
var cloudsElement = `<img id="clouds" src="${assets.clouds}" />`;

var scoreElement = document.querySelector('.score');

var mario = {
    width: 150,
    height: 150,
    x: 75 / 4,
    y: gameBoard.height - 150,
    isJumping: false,
}

var pipe = {
    width: 80,
    height: 100,
    x: gameBoard.width,
    y: gameBoard.height - 100,
}

var coin = {
    width: 60,
    height: 60,
    x: gameBoard.width + gameBoard.width / 2,
    y: gameBoard.height - 60,
}

var clouds = {
    width: 1084,
    height: 492,
    x: gameBoard.width,
    y: 256 - 128,
}

var init = () => {
    gameBoardDiv.innerHTML += marioElement;
    gameBoardDiv.innerHTML += pipeElement;
    gameBoardDiv.innerHTML += coinElement;
    gameBoardDiv.innerHTML += cloudsElement;

    marioElement = document.querySelector('#mario');
    pipeElement = document.querySelector('#pipe');
    coinElement = document.querySelector('#coin');
    cloudsElement = document.querySelector('#clouds');

    marioElement.style.width = mario.width + "px";
    marioElement.style.height = mario.height + "px";
    marioElement.style.position = "absolute";
    marioElement.style.left = mario.x + "px";
    marioElement.style.top = mario.y + "px";
    marioElement.style.zIndex = "1";

    pipeElement.style.width = pipe.width + "px";
    pipeElement.style.height = pipe.height + "px";
    pipeElement.style.position = "absolute";
    pipeElement.style.left = pipe.x + "px";
    pipeElement.style.top = pipe.y + "px";
    pipeElement.style.zIndex = "1";

    coinElement.style.width = coin.width + "px";
    coinElement.style.height = coin.height + "px";
    coinElement.style.position = "absolute";
    coinElement.style.left = coin.x + "px";
    coinElement.style.top = coin.y + "px";
    coinElement.style.zIndex = "1";

    cloudsElement.style.width = clouds.width + "px";
    cloudsElement.style.height = clouds.height + "px";
    cloudsElement.style.position = "absolute";
    cloudsElement.style.left = clouds.x + "px";
    cloudsElement.style.top = clouds.y + "px";
    cloudsElement.style.zIndex = "0";

    scoreElement.innerHTML = `Score: ${score.toFixed(0)}`;
}

// mario jump
const jump = () => {
    if (mario.isJumping) {
        return;
    } else {
        mario.isJumping = true;
        const jumpHeight = mario.height * 5;
        const jumpDuration = 1000;

        let jumpStart = Date.now();
        let jumpEnd = jumpStart + jumpDuration;
        let jumpInterval = setInterval(() => {
            let now = Date.now();
            let t = Math.min(1, (now - jumpStart) / jumpDuration);
            let y = jumpHeight * (1 - t) * t;
            mario.y = gameBoard.height - mario.height - y;
            marioElement.style.top = mario.y + "px";
            if (now > jumpEnd) {
                clearInterval(jumpInterval);
                mario.isJumping = false;
            }
        }
            , 20);
    }
}

// cloud animation
const animateClouds = () => {
    clouds.x -= speed * 0.5;
    cloudsElement.style.left = clouds.x + "px";
    if (clouds.x + parseInt(clouds.width) < 0) {
        clouds.x = gameBoard.width;
        // new random width and height maintaining aspect ratio
        const ratio = clouds.width / clouds.height;

        // new random x
        clouds.y = Math.floor(Math.random() * gameBoard.height);
        console.log(clouds.y);

        // update the element
        cloudsElement.style.width = clouds.width + "px";
        cloudsElement.style.height = clouds.height + "px";
        cloudsElement.style.top = clouds.y + "px";
    }
}

// pipe animation
const animatePipe = () => {
    pipe.x -= speed;
    pipeElement.style.left = pipe.x + "px";
    if (pipe.x + parseInt(pipe.width) < 0) {
        pipe.x = gameBoard.width;
    }
}

// coin animation
const animateCoin = () => {
    coin.x -= speed;
    coinElement.style.left = coin.x + "px";
    if (coin.x + parseInt(coin.width) < 0) {
        coin.x = gameBoard.width;
        coinElement.style.display = "block";
    }
}

const coinCollision = (marioElement, coinElement) => {
    const marioRect = marioElement.getBoundingClientRect();
    const coinRect = coinElement.getBoundingClientRect();

    if (marioRect.top < coinRect.top + coinRect.height &&
        marioRect.top + marioRect.height > coinRect.top &&
        marioRect.left < coinRect.left + coinRect.width &&
        marioRect.left + marioRect.width > coinRect.left) {
        return true;
    }
    return false;
}


const pipeCollision = (marioElement, pipeElement) => {
    const marioRect = marioElement.getBoundingClientRect();
    const pipeRect = pipeElement.getBoundingClientRect();

    // colide with only the left side of the pipe
    if (marioRect.top < pipeRect.top + pipeRect.height &&
        marioRect.top + marioRect.height > pipeRect.top &&
        marioRect.left < pipeRect.left + pipeRect.width / 2 && // only left side
        marioRect.left + marioRect.width > pipeRect.left) {
        return true;
    }
    return false;
}

var gameLoop = setInterval(() => {
    animateClouds();
    animatePipe();
    animateCoin();

    // Coin collision 
    if (coinCollision(marioElement, coinElement)) {
        coinElement.style.display = "none";
        score += 10;
        scoreElement.innerHTML = `Score: ${score.toFixed(0)}`;
    }

    // Pipe collision
    if (pipeCollision(marioElement, pipeElement)) {
        clearInterval(gameLoop);
        marioElement.src = assets.deadMario;
        marioElement.style.width = "auto";
        document.querySelector('.game-over').innerHTML = "Game Over";
        document.querySelector('.restart').style.display = "block";
    }


}, 1000 / 60);

const restart = () => {
    location.reload();
}

init();

// key press event
document.addEventListener('keydown', (e) => {
    jump();
});


// restart button
document.querySelector('.restart').addEventListener('click', () => {
    restart();
});