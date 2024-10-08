/*-------------- Constants -------------*/
const gridHeight = 20;
const gridWidth = 20;
const gridSize = gridHeight * gridWidth;
let snakePosition = [{ x: 10, y: 10 }];
let fruitPosition = {} ;

/*---------- Variables (state) ---------*/

let gameIsActive = "";
let snakeDirection;
let directionInterval;

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
  countDown();
  renderSnake();
}

function countDown() {
  let timeLeft = 3;
  gameMessage.innerText = timeLeft;
  let countdownInterval = setInterval(() => {
    timeLeft -= 1;
    gameMessage.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      gameMessage.innerText = "Enjoy the game!";
      gameIsActive = true;
    }
  }, 1000);
}

function RandomCoordinate(min = 2, max = 20) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateFruits() {
    fruitPosition.x = RandomCoordinate();
    fruitPosition.y = RandomCoordinate();
    const fruitElement = document.createElement('div');
    fruitElement.classList.add('fruit');
    fruitElement.style.gridColumnStart = fruitPosition.x;
    fruitElement.style.gridRowStart = fruitPosition.y;
    gameBoard.appendChild(fruitElement);
}

generateFruits();

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
  let movingSnake;
  if (gameIsActive) {
    switch (snakeDirection) {
      case "up":
        movingSnake = { x: snakePosition[0].x, y: snakePosition[0].y - 1 };
        break;
      case "right":
        movingSnake = { x: snakePosition[0].x + 1, y: snakePosition[0].y };
        break;
      case "down":
        movingSnake = { x: snakePosition[0].x, y: snakePosition[0].y + 1 };
        break;
      case "left":
        movingSnake = { x: snakePosition[0].x - 1, y: snakePosition[0].y };
        break;
    }
    snakePosition.unshift(movingSnake);
    snakePosition.pop();
    unrenderSnake();
    renderSnake();
    checkLoseConditions();
    movementInterval();
    console.log(snakePosition);
  }
}

function movementInterval() {
  clearInterval(directionInterval);
  directionInterval = setInterval(moveSnake, 100);
}

function checkLoseConditions() {
  if (
    snakePosition[0].x === 0 ||
    snakePosition[0].y === 0 ||
    snakePosition[0].x === 21 ||
    snakePosition[0].y === 21
  ) {
    gameMessage.innerText = `You Lose`;
    unrenderSnake();
    gameIsActive = false;
    showRestartButton();
  }
}

function showRestartButton() {
  restartButton.style.display = "block";
}

function restartGame() {
  //   unrenderSnake();
  snakePosition = [{ x: 10, y: 10 }];
  snakeDirection = "up";
  gameMessage.innerText = `Press Start to Play`;
}
/*----------- Event Listeners ----------*/

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

window.addEventListener("keydown", function (event) {
  event.preventDefault();
  switch (event.key) {
    case "ArrowUp":
      snakeDirection = "up";
      break;
    case "ArrowLeft":
      snakeDirection = "left";
      break;
    case "ArrowDown":
      snakeDirection = "down";
      break;
    case "ArrowRight":
      snakeDirection = "right";
      break;
  }
  moveSnake();
});
