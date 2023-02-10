const gameBoardEl = document.getElementById("gameBoard");

// CSS Related
const tubeWidth = 50; // px
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

let tubes;
let tubeCapacity;
let activeTube;

prepareGame(3, 4, 1);

function prepareGame(tubeCount, capacity, emptyTubeCount) {
  gameBoardEl.innerHTML = "";
  const { height, width } = gameBoardEl.getBoundingClientRect();
  const level = height / 2;
  const distance = width / (tubeCount + 1);
  const filledTubeCount = tubeCount - emptyTubeCount;

  tubes = [];
  tubeCapacity = capacity;
  activeTube = null;

  for (let i = 1; i <= tubeCount; i++) {
    createTube(distance * i, level, tubeCapacity);
  }

  const balls = createAndShuffleBalls(filledTubeCount, tubeCapacity);
  console.log(balls);
  let idx = 0;

  for (let i = 0; i < filledTubeCount; i++) {
    for (let j = 0; j < capacity; j++) {
      tubes[i].add(balls[idx]);
      idx++;
    }
  }
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
  };

  tubes.push(tube);

  return tube;
}

function addToTube(ballEl) {
  const { balls, capacity, baseValue, left } = this;
  if (balls.length == capacity) return false;

  const idx = balls.length;
  balls.push(ballEl);
  ballEl.style.top = `${baseValue - tubeWidth * idx}px`;
  ballEl.style.left = `${left}px`;

  return true;
}

function createAndShuffleBalls(setCount, capacity) {
  const balls = [];
  for (let i = 0; i < setCount; i++) {
    for (let j = 0; j < capacity; j++) {
      balls.push(createBall(colors[i]));
    }
  }

  console.log(balls);

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
  console.log(tubes[e.currentTarget.getAttribute("index")]);
  if (!activeTube) {
    // levitate ball
    activeTube = tubes[e.currentTarget.getAttribute("index")];
    const { baseValue, balls, capacity } = activeTube;
    if (balls.length == 0) {
      // no balls in tube
      activeTube = null;
      return;
    }
    const ballEl = balls[balls.length - 1];
    ballEl.style.top = `${baseValue - tubeWidth * capacity}px`;
    return;
  }

  // transfer ball
  const targetTube = tubes[e.currentTarget.getAttribute("index")];
  const ballEl = activeTube.balls.pop();
  if (!targetTube.add(ballEl)) {
    // tube is full
    activeTube.balls.push(ballEl);
    return;
  }
  activeTube = null;
}

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
