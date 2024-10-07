/*-------------- Constants -------------*/
const gridHeight = 20;
const gridWidth = 20;
const gridSize = gridHeight * gridWidth;
let snakePosition = [{ x: 10, y: 10 }];

/*---------- Variables (state) ---------*/

let gameIsActive = "";

/*----- Cached Element References  -----*/

const gameBoard = document.querySelector(".grid-container");
const snake = document.querySelector(".snake");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameMessage = document.getElementById("game-message");
 
/*-------------- Functions -------------*/

//create grid cells

/*
    for (let i = 0; i < gridSize; i++){
        const gridCell= document.createElement('div');
        gridCell.classList.add('grid-cell');
        gameBoard.appendChild(gridCell);
    };
    */

function startGame() {
  renderSnake();
  gameIsActive = true;
  countDown();
}

function countDown(){
    let timeLeft = 3; 
    gameMessage.innerText = timeLeft;
    let countdownInterval = setInterval(()=>{
        timeLeft -= 1;
        gameMessage.innerText = timeLeft;
        
        if (timeLeft <= 0){
            clearInterval(countdownInterval); 
            gameMessage.innerText = 'Enjoy the game!';
        }
    }, 1000);
}

countDown();

function renderSnake() {
  // Creating snakeBody
  const snakeBody = document.createElement("div");
  snakeBody.classList.add("snake-body");
  snakeBody.style.gridColumnStart = snakePosition[0].x;
  snakeBody.style.gridRowStart = snakePosition[0].y;
  // Adding snakeBody to gameBoard
  gameBoard.appendChild(snakeBody);
}

function unrenderSnake() {
  const snakeBody = document.querySelector(".snake-body");
  gameBoard.removeChild(snakeBody);
}

function moveSnake() {
  if (gameIsActive) {
    const movingSnake = { x: snakePosition[0].x, y: snakePosition[0].y - 1 };
    snakePosition.unshift(movingSnake);
    snakePosition.pop();
    unrenderSnake();
    renderSnake();
    checkLoseConditions();
    console.log(snakePosition);
  }
}

setInterval(moveSnake,100); // call moveSnakes every .5 second

function checkLoseConditions(){
    if (snakePosition[0].x === 0 || snakePosition[0].y === 0){
        gameMessage.innerText = `You Lose`;
        gameIsActive = false; 
        showRestartButton();
    }
}

function showRestartButton(){
    restartButton.style.display = 'block';
}

function restartGame(){
    unrenderSnake();
    snakePosition = [{ x: 10, y: 10 }];
    gameMessage.innerText = `Press Start to Play`
}
/*----------- Event Listeners ----------*/


startButton.addEventListener("click", startGame);
restartButton.addEventListener('click', restartGame);

// Movement Arrow Key
window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    moveSnake();
    // unrenderSnake();
    // renderSnake();
  }
});
