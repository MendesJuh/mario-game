const ImageAssets = {
    clouds: "./assets/img/clouds.png",
    mario: "./assets/img/mario.gif",
    deadMario: "./assets/img/game-over.png",
    pipe: "./assets/img/pipe.png",
    coin: "./assets/img/coin.gif",
    groundTile: "./assets/img/ground-tile.png"
}

const SoundAssets = {
    jump: "./assets/sounds/jump.wav",
    coin: "./assets/sounds/coin.wav",
    dead: "./assets/sounds/dead.wav",
}

let score = 0;
let speed = 10;
const gameBoardDiv = document.querySelector('.game-board');
const gameBoard = {
    width: gameBoardDiv.offsetWidth,
    height: gameBoardDiv.offsetHeight
}

var marioElement = `<img id="mario" src="${ImageAssets.mario}" />`;
var pipeElement = `<img id="pipe" src="${ImageAssets.pipe}" />`;
var coinElement = `<img id="coin" src="${ImageAssets.coin}" />`;
var cloudsElement = `<img id="clouds" src="${ImageAssets.clouds}" />`;
var groundDivElement = document.querySelector('.ground');
var scoreElement = document.querySelector('.score');

// Mario Data
var mario = {
    width: 150,
    height: 150,
    x: 75 / 4,
    y: gameBoard.height - 150,
    isJumping: false,
}

// Pipe Data
var pipe = {
    width: 80,
    height: 100,
    x: gameBoard.width,
    y: gameBoard.height - 100,
}

// Coin Data
var coin = {
    width: 60,
    height: 60,
    x: gameBoard.width + gameBoard.width / 2,
    y: gameBoard.height - 60,
}

// Clouds Data
var clouds = {
    width: 1084,
    height: 492,
    x: gameBoard.width,
    y: 256 - 128,
}

// Ground Data
var ground = {
    width: gameBoard.width,
    height: 100,
    xOffset: 0,
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

        // play jump sound
        const jumpSound = new Audio(SoundAssets.jump);
        jumpSound.play();

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
        if(Math.random() > 0.5) {
            console.log("low coin");
            coin.y = gameBoard.height - 60;
        } else {
            console.log("high coin");
            coin.y = gameBoard.height - 60 - 10 - pipe.height;
        }
        coinElement.style.top = coin.y + "px";

        coin.x = gameBoard.width;
        coinElement.style.display = "block";

    }
}

// check coin collision
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

// check pipe collision
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

// Principal Game Loop
var gameLoop = setInterval(() => {
    animateClouds();
    animatePipe();
    animateCoin();

    // Coin collision 
    if (coinCollision(marioElement, coinElement)) {
        coinElement.style.display = "none";
        score += 10 * (speed + 1) / 5;
        scoreElement.innerHTML = `Score: ${score.toFixed(0)}`;
        // play coin sound
        const coinSound = new Audio(SoundAssets.coin);
        coinSound.play();
        speed += 0.05;
    }

    // Coin Pipe collision
    if (coinCollision(coinElement, pipeElement)) {
        coinElement.style.display = "none";
        coin.x = gameBoard.width;
        coinElement.style.left = coin.x + "px";
    }

    // Pipe collision
    if (pipeCollision(marioElement, pipeElement)) {
        clearInterval(gameLoop);
        marioElement.src = ImageAssets.deadMario;
        marioElement.style.width = "auto";
        document.querySelector('.game-over').innerHTML = "Game Over";
        document.querySelector('.restart').style.display = "block";
        // play dead sound
        const deadSound = new Audio(SoundAssets.dead);
        deadSound.play();
        // remove event listener
        document.removeEventListener("keydown", jump);
        document.removeEventListener("touchstart", jump);
    }

    
        



    //move ground
    ground.xOffset -= speed;
    groundDivElement.style.backgroundPositionX = ground.xOffset + "px";

}, 1000 / 60);

const restart = () => {
    location.reload();
}

// Initialize the game
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

    // Ground
    groundDivElement.style.width = ground.width + "px";
    groundDivElement.style.height = ground.height + "px";
    groundDivElement.style.position = "relative";
    groundDivElement.style.backgroundImage = "url(" + ImageAssets.groundTile + ")";
    groundDivElement.style.backgroundSize = "100px 100px";
    groundDivElement.style.backgroundRepeat = "repeat-x";
    groundDivElement.style.zIndex = "0";
    groundDivElement.style.backgroundPositionX = ground.xOffset + "px";


    // add event listener for jump
    // key press event
    document.addEventListener('keydown', (e) => {
        jump();
    });

    // touch event for mobile
    document.addEventListener('touchstart', (e) => {
        jump();
    });

    // restart button
    document.querySelector('.restart').addEventListener('click', () => {
        restart();
    });


}

init();