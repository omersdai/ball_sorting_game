const titleEl = document.getElementById("title");
const leftArrowBtn = document.getElementById("leftArrow");
const rightArrowBtn = document.getElementById("rightArrow");
const resetBtn = document.getElementById("reset");
const gameLevelEl = document.getElementById("gameLevel");
const gameBoardEl = document.getElementById("gameBoard");

// CSS Related
const tubeWidth = 40; // px
const ballSize = tubeWidth - 20; // px
const colors = [
  "bg-blue",
  "bg-yellow",
  "bg-green",
  "bg-red",
  "bg-orange",
  "bg-purple",
  "bg-pink",
];
const COMPLETE = "complete";

let tubes;
let tubeCapacity;
let activeTube;
let gameLevel = 0;
let gameJson;

generateRandomGame(9, 4, 2);
// initializeGame();

function initializeGame() {
  gameLevel = parseInt(gameLevelEl.innerText) - 1;
  gameJson = games[gameLevel];
  loadLevel();
}

function resetGame() {
  loadLevel();
}

function loadLevel() {
  const game = JSON.parse(gameJson);
  const tubeCount = game.length;
  const capacity = game[0].length;

  generateTubes(tubeCount, capacity);
  generateBalls(game);
}

function generateRandomGame(tubeCount, capacity, emptyTubeCount) {
  generateTubes(tubeCount, capacity);
  generateRandomBalls(tubeCount, capacity, emptyTubeCount);
}

function generateTubes(tubeCount, capacity) {
  gameBoardEl.innerHTML = "";
  const { height, width } = gameBoardEl.getBoundingClientRect();
  const left = width / (tubeCount + 1);
  const top = height / 2;

  tubes = [];
  tubeCapacity = capacity;
  activeTube = null;
  gameLevelEl.innerText = gameLevel + 1;

  for (let i = 1; i <= tubeCount; i++) {
    createTube(left * i, top, capacity);
  }
}

function generateBalls(game) {
  console.log(game);
  tubes.forEach((tube, idx) =>
    game[idx].forEach((color) => tube.add(createBall(color)))
  );
}

function generateRandomBalls(tubeCount, capacity, emptyTubeCount) {
  const filledTubeCount = tubeCount - emptyTubeCount;
  const balls = createAndShuffleBalls(filledTubeCount, capacity);

  let idx = 0;
  for (let i = 0; i < filledTubeCount; i++) {
    for (let j = 0; j < capacity; j++) {
      tubes[i].add(balls[idx]);
      idx++;
    }
  }

  const game = tubes.map((tube) =>
    tube.balls.map((ballEl) => ballEl.getAttribute("color"))
  );
  gameJson = JSON.stringify(game);
  console.log(gameJson);
}

function printGame() {
  const jsonString = JSON.stringify(gameJson);
  console.log(jsonString);
  console.log(JSON.parse(jsonString));
}

function createTube(left, top, capacity) {
  const tubeElement = document.createElement("div");
  tubeElement.className = "tube-container";
  tubeElement.style.left = `${left}px`;
  tubeElement.style.top = `${top}px`;
  tubeElement.setAttribute("index", tubes.length);
  tubeElement.addEventListener("click", tubeOnClick);

  for (let i = 0; i < capacity; i++) {
    tubeElement.appendChild(createTubePiece());
  }

  tubeElement.lastChild.classList.add("tube-bottom");

  gameBoardEl.appendChild(tubeElement);

  const tube = {
    left,
    top,
    capacity,
    baseValue: top + ((capacity - 1) / 2) * tubeWidth, // height of the bottom of the tube in px
    element: tubeElement,
    balls: [],
    add: addToTube,
    getTopColor: getTopColor,
    isFull: tubeIsFull,
    isActive: tubeIsActive,
  };

  tubes.push(tube);

  return tube;
}

function addToTube(ballEl) {
  const { balls, capacity, baseValue, left } = this;
  if (balls.length === capacity) return false;

  const idx = balls.length;
  balls.push(ballEl);
  ballEl.style.top = `${baseValue - tubeWidth * idx}px`;
  ballEl.style.left = `${left}px`;

  return true;
}

function getTopColor() {
  const balls = this.balls;
  return balls.length === 0
    ? null
    : balls[balls.length - 1].getAttribute("color");
}

function tubeIsFull() {
  return this.balls.length === this.capacity;
}

function tubeIsActive() {
  return !this.element.classList.contains(COMPLETE);
}

function createAndShuffleBalls(setCount, capacity) {
  const balls = [];
  for (let i = 0; i < setCount; i++) {
    for (let j = 0; j < capacity; j++) {
      balls.push(createBall(colors[i]));
    }
  }

  return shuffle(balls);
}

function createTubePiece() {
  const tubePiece = document.createElement("div");
  tubePiece.className = "tube-body";
  tubePiece.style.height = `${tubeWidth}px`;
  tubePiece.style.width = `${tubeWidth}px`;
  return tubePiece;
}

function createBall(color) {
  const ballEl = document.createElement("div");
  ballEl.className = "ball " + color;
  ballEl.style.height = `${ballSize}px`;
  ballEl.style.width = `${ballSize}px`;
  ballEl.setAttribute("color", color);

  gameBoardEl.appendChild(ballEl);
  return ballEl;
}

function tubeOnClick(e) {
  const tube = tubes[e.currentTarget.getAttribute("index")];
  if (!tube.isActive()) return;

  if (!activeTube) {
    levitateBall(tube);
  } else {
    transferBall(tube);
  }
}

function levitateBall(tube) {
  activeTube = tube;
  const { baseValue, balls, capacity } = activeTube;
  if (balls.length === 0) {
    // no balls in tube
    activeTube = null;
    return;
  }
  const ballEl = balls[balls.length - 1];
  ballEl.style.top = `${baseValue - tubeWidth * capacity}px`;
}

function transferBall(tube) {
  const targetTube = tube;
  if (activeTube === targetTube) {
    const ballEl = activeTube.balls.pop();
    activeTube.add(ballEl);
    activeTube = null;
    return;
  }

  const targetColor = targetTube.getTopColor();
  const ballColor = activeTube.getTopColor();

  if (
    targetTube.isFull() ||
    (targetColor !== null && targetColor !== ballColor)
  )
    return;

  while (ballColor === activeTube.getTopColor() && !targetTube.isFull()) {
    const ballEl = activeTube.balls.pop();
    targetTube.add(ballEl);
  }

  if (
    targetTube.isFull() &&
    targetTube.balls.filter(
      (ballEl) => ballEl.getAttribute("color") !== targetColor
    ).length === 0
  ) {
    targetTube.element.classList.add(COMPLETE);
  }

  activeTube = null;
}

function changeLevel(skip = 1) {
  gameLevel += skip;
  gameLevel = Math.max(Math.min(gameLevel, games.length - 1), 0);
  gameLevelEl.innerText = gameLevel + 1;
  gameJson = games[gameLevel];
  loadLevel();
}

titleEl.addEventListener("click", () => printGame());
leftArrowBtn.addEventListener("click", () => changeLevel(-1));
rightArrowBtn.addEventListener("click", () => changeLevel(1));
resetBtn.addEventListener("click", () => resetGame());

function shuffle(arr) {
  shuffledArr = [];

  while (0 < arr.length) {
    const idx = getRandomNumber(0, arr.length - 1);
    shuffledArr.push(arr[idx]);
    arr[idx] = arr[arr.length - 1];
    arr.pop();
  }

  return shuffledArr;
}

function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}
