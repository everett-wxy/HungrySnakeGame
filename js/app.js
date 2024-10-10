/*-------------- Constants -------------*/

/*---------- Variables (state) ---------*/

let gameIsActive = "";
let snakePosition = [{ x: undefined, y: undefined }];
let fruitPosition = {};
let directionInterval;
let snakeDirection;
let ifCollideBody = false;
let speed = 100;
let score = 0;
let highscore = 0;
let spawnRareFruit = false;

/*----- Cached Element References  -----*/

const gameBoard = document.querySelector(".grid-container");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameMessage = document.getElementById("game-message");
const scoreEl = document.getElementById("score");
const gameLogo = document.getElementById("game-logo");
const gameTitle = document.getElementById("title");
const instruction = document.getElementById("instructions");
const highscoreEl = document.getElementById("high-score");
const highscoreMessage = document.querySelector(".high-score");

/*-------------- Functions -------------*/

function startGame() {
  snakePosition[0] = { x: 10, y: 10 };
  countDown();
  renderSnakeHead();
  generateFruits();
  snakeDirection = "up";
  movementInterval();
  score = 0;
  gameLogo.style.visibility = "hidden";
  gameTitle.style.visibility = "hidden";
  instruction.style.visibility = "hidden";
  startButton.style.display = "none";
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
  if (snakePosition[0].x === 0 || snakePosition[0].y === 0) {
    return;
  }
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

  while (
    snakePosition.some(
      (i) => i.x === fruitPosition.x && i.y === fruitPosition.y
    )
  ) {
    fruitPosition = { x: RandomCoordinate(), y: RandomCoordinate() };
  }
  generateRareFruit();
  const fruitElement = document.createElement("div");
  if (spawnRareFruit) {
    fruitElement.classList.add("special-fruit");
  } else fruitElement.classList.add("fruit");
  fruitElement.style.gridColumnStart = fruitPosition.x;
  fruitElement.style.gridRowStart = fruitPosition.y;
  gameBoard.appendChild(fruitElement);
}

function generateRareFruit() {
  const randomNum = Math.random();
  if (randomNum < 0.5) {
    spawnRareFruit = true;
  } else {
    spawnRareFruit = false;
  }
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
    checkLoseConditions();
    renderSnakeHead(); // creating html element of snake head
    eatFruit();
    movementInterval();
  }
}

function movementInterval() {
  clearInterval(directionInterval);
  directionInterval = setInterval(moveSnake, speed);
}

function eatFruit() {
  if (
    fruitPosition.x === snakePosition[0].x &&
    fruitPosition.y === snakePosition[0].y
  ) {
    let fruitElement;
    if (spawnRareFruit) {
      fruitElement = document.querySelector(".special-fruit");
    } else fruitElement = document.querySelector(".fruit");
    fruitElement.remove();
    if (spawnRareFruit) {
      score += 5;
    } else score++;
    updateScore();
    growBody();
    generateFruits();
    
  }
}

function growBody() {
  let newBodyCoordinates;
  let snakeGrow;
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
  speed *= 0.95;
}

function updateScore() {
  scoreEl.innerText = score;
}

function checkLoseConditions() {
  checkBodyCollision();
  if (
    snakePosition[0].x === 0 ||
    snakePosition[0].y === 0 ||
    snakePosition[0].x === 21 ||
    snakePosition[0].y === 21 ||
    ifCollideBody
  ) {
    gameMessage.innerText = `You Lose`;
    gameIsActive = false;
    showRestartButton();
    clearInterval(directionInterval);
    startButton.style.display = "none";
  }
}

// if the head of snake comes into contact with any coordinates of the body

function checkBodyCollision() {
  let head = { x: snakePosition[0].x, y: snakePosition[0].y };

  for (i = 1; i < snakePosition.length; i++) {
    if (
      (ifCollideBody =
        head.x === snakePosition[i].x && head.y === snakePosition[i].y)
    ) {
      return;
    }
  }
}

function showRestartButton() {
  restartButton.style.display = "block";
}

function restartGame() {
  gameBoard.innerHTML = "";
  snakePosition = [{ x: 10, y: 10 }];
  snakeDirection = "up";
  ifCollideBody = false;
  gameMessage.innerText = `Play again and beat your high score`;
  startButton.style.display = "block";
  restartButton.style.display = "none";
  gameLogo.style.visibility = "visible";
  gameTitle.style.visibility = "visible";
  instruction.style.visibility = "visible";
  updateHighScore();
  score = 0;
  speed = 100;
  updateScore();
}

function updateHighScore() {
  if (score > highscore) {
    highscore = score;
    highscoreEl.innerText = highscore;
    highscoreMessage.style.display = "block";
  }
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
