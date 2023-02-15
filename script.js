const titleEl = document.getElementById("title");
const leftArrowBtn = document.getElementById("leftArrow");
const rightArrowBtn = document.getElementById("rightArrow");
const resetBtn = document.getElementById("reset");
const gameLevelEl = document.getElementById("gameLevel");
const gameBoardEl = document.getElementById("gameBoard");

// CSS Related
const tubeWidth = 40; // px
const ballSize = tubeWidth - 20; // px
const transitionSpeed = 200; // milli seconds
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
const TRANSITION = `${transitionSpeed}ms ease`;
const LEVITATING = "levitating";
const STORAGE_KEY = "ballSortingGame";
const CLICK = "click";

let gameLevel = localStorage.getItem(STORAGE_KEY)
  ? parseInt(localStorage.getItem(STORAGE_KEY))
  : 0;
let gameJson;
let tubes;
let tubeCapacity;
let activeTube;

// generateRandomGame(9, 4, 2);

loadLevel();

function initializeGame() {
  saveLevel();
  activeTube = null;
}

function resetGame() {
  loadLevel();
}

function loadLevel() {
  initializeGame();
  const game = JSON.parse(gameJson);
  const tubeCount = game.length;
  const capacity = game[0].length;

  generateTubes(tubeCount, capacity);
  generateBalls(game);
}

function generateRandomGame(tubeCount, capacity, emptyTubeCount) {
  initializeGame();
  generateTubes(tubeCount, capacity);
  generateRandomBalls(tubeCount, capacity, emptyTubeCount);
}

function generateTubes(tubeCount, capacity) {
  tubes = [];
  tubeCapacity = capacity;

  gameBoardEl.innerHTML = "";
  const { height, width } = gameBoardEl.getBoundingClientRect();
  const left = width / (tubeCount + 1);
  const top = height / 2;

  for (let i = 1; i <= tubeCount; i++) {
    createTube(left * i, top, tubeCapacity);
  }
}

function generateBalls(game) {
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

function printGame() {
  const jsonString = JSON.stringify(gameJson);
  console.log(jsonString);
  console.log(JSON.parse(jsonString));
}

function tubeOnClick(e) {
  const tube = tubes[e.currentTarget.getAttribute("index")];
  if (!tube.isActive()) return;

  if (!activeTube) {
    activateTube(tube);
  } else {
    transferBall(tube);
  }
}

function activateTube(tube) {
  activeTube = tube;
  const { balls } = activeTube;
  if (balls.length === 0) {
    // no balls in tube
    activeTube = null;
    return;
  }
  const ballEl = balls[balls.length - 1];
  activeTube.levitate(ballEl);
}

function transferBall(tube) {
  const targetTube = tube;
  if (activeTube === targetTube) {
    const ballEl = activeTube.pop();
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

  let count = 0;
  while (ballColor === activeTube.getTopColor() && !targetTube.isFull()) {
    activeTube.transfer(targetTube, transitionSpeed * count);
    count++;
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
  loadLevel();
}

titleEl.addEventListener(CLICK, () => printGame());
leftArrowBtn.addEventListener(CLICK, () => changeLevel(-1));
rightArrowBtn.addEventListener(CLICK, () => changeLevel(1));
resetBtn.addEventListener(CLICK, () => resetGame());

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

function saveLevel() {
  localStorage.setItem(STORAGE_KEY, gameLevel);
  gameLevelEl.innerText = gameLevel + 1;
  gameJson = games[gameLevel];
}
