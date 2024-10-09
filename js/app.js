/*-------------- Constants -------------*/
const gridHeight = 20;
const gridWidth = 20;
const gridSize = gridHeight * gridWidth;

/*---------- Variables (state) ---------*/

let gameIsActive = "";
let snakePosition = [{ x: undefined, y: undefined }];
let fruitPosition = {};
let directionInterval;
let snakeDirection;

/*----- Cached Element References  -----*/

const gameBoard = document.querySelector(".grid-container");
const snake = document.querySelector(".snake");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameMessage = document.getElementById("game-message");

/*-------------- Functions -------------*/

function startGame() {
  snakePosition[0] = { x: 10, y: 10 };
  countDown();
  renderSnakeHead();
  generateFruits();
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
  }, 500);
}

function renderSnakeHead() {
  const snakeBody = document.createElement("div"); // creating new div element
  snakeBody.classList.add("snake-body"); // adding class to div element
  snakeBody.style.gridColumnStart = snakePosition[0].x; // adding grid column css value
  snakeBody.style.gridRowStart = snakePosition[0].y;
  gameBoard.insertBefore(snakeBody, gameBoard.firstChild); // add html element at the beginning of gameBoard
}

function unrenderSnakeTail() {
  const snakeBody = document.querySelectorAll(".snake-body");
  const lastSnakeElement = snakeBody[snakeBody.length - 1];
  gameBoard.removeChild(lastSnakeElement); // remove the last element of gameBoar with .snake-body class
}

function RandomCoordinate(min = 2, max = 20) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateFruits() {
  fruitPosition = { x: RandomCoordinate(), y: RandomCoordinate() };
  const fruitElement = document.createElement("div");
  fruitElement.classList.add("fruit");
  fruitElement.style.gridColumnStart = fruitPosition.x;
  fruitElement.style.gridRowStart = fruitPosition.y;
  gameBoard.appendChild(fruitElement);
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
    snakePosition.unshift(movingSnake); // add updated coordinates  to start of array 'snakePosition'
    snakePosition.pop(); //remove last coordinates of array 'snakePosition'
    unrenderSnakeTail(); // remove html element of snake tail
    renderSnakeHead(); // creating html element of snake head
    eatFruit();
    checkLoseConditions();
    movementInterval();
  }
}

function movementInterval() {
  clearInterval(directionInterval);
  directionInterval = setInterval(moveSnake, 100);
}

function eatFruit() {
  if (
    fruitPosition.x === snakePosition[0].x &&
    fruitPosition.y === snakePosition[0].y
  ) {
    const fruitElement = document.querySelector(".fruit");
    fruitElement.remove();
    generateFruits();
    growBody();
  }
}

function growBody() {
  let newBodyCoordinates;
  let snakeGrow;
  // error is thrown because length of snake at the beginning is less than 2
  if (snakePosition.length < 2) {
    switch (snakeDirection) {
      case "up":
        newBodyCoordinates = {
          x: snakePosition[snakePosition.length - 1].x,
          y: snakePosition[snakePosition.length - 1].y + 1,
        };
        break;
      case "down":
        newBodyCoordinates = {
          x: snakePosition[snakePosition.length - 1].x,
          y: snakePosition[snakePosition.length - 1].y - 1,
        };
        break;
      case "left":
        newBodyCoordinates = {
          x: snakePosition[snakePosition.length - 1].x - 1,
          y: snakePosition[snakePosition.length - 1].y,
        };
        break;
      case "right":
        newBodyCoordinates = {
          x: snakePosition[snakePosition.length - 1].x + 1,
          y: snakePosition[snakePosition.length - 1].y,
        };
        break;
    }
  } else {
    newBodyCoordinates = {
      x:
        snakePosition[snakePosition.length - 1].x +
        (snakePosition[snakePosition.length - 1].x -
          snakePosition[snakePosition.length - 2].x),
      y:
        snakePosition[snakePosition.length - 1].y +
        (snakePosition[snakePosition.length - 1].y -
          snakePosition[snakePosition.length - 2].y),
    };
  }
  snakePosition.push(newBodyCoordinates);
  snakeGrow = document.createElement("div");
  snakeGrow.classList.add("snake-body");
  snakeGrow.style.gridColumnStart = newBodyCoordinates.x;
  snakeGrow.style.gridRowStart = newBodyCoordinates.y;
  gameBoard.appendChild(snakeGrow);
}

function checkLoseConditions() {
  if (
    snakePosition[0].x === 0 ||
    snakePosition[0].y === 0 ||
    snakePosition[0].x === 21 ||
    snakePosition[0].y === 21
  ) {
    gameMessage.innerText = `You Lose`;
    unrenderSnakeTail();
    gameIsActive = false;
    showRestartButton();
  }
}

function showRestartButton() {
  restartButton.style.display = "block";
}

function restartGame() {
  gameBoard.innerHTML = "";
  snakePosition = [{ x: 10, y: 10 }];
  snakeDirection = "up";
  gameMessage.innerText = `Press Start to Play`;
}
/*----------- Event Listeners ----------*/

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

window.addEventListener("keydown", function (event) {
  event.preventDefault();
  if (
    (event.key === "ArrowUp" && snakeDirection !== "down") ||
    (event.key === "ArrowDown" && snakeDirection !== "up") ||
    (event.key === "ArrowLeft" && snakeDirection !== "right") ||
    (event.key === "ArrowRight" && snakeDirection !== "left")
  ) {
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
  }
  moveSnake();
});
