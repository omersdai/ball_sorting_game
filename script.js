const gameBoardEl = document.getElementById("gameBoard");

// CSS Related
const tubeWidth = 50; // px
const ballSize = tubeWidth - 20; // px
const tubeHeight = 250; // px

let tubes = [];
let tubeCapacity = 4;
let activeTube = null;

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
    baseValue: tubeHeight + ((capacity - 1) / 2) * tubeWidth,
    element: tubeElement,
    balls: [],
    add: addToTube,
  };

  tubes.push(tube);

  return tube;
}

function createTubePiece() {
  const tubePiece = document.createElement("div");
  tubePiece.className = "tube-body";
  tubePiece.style.height = `${tubeWidth}px`;
  tubePiece.style.width = `${tubeWidth}px`;
  return tubePiece;
}

function createBall() {
  const ballEl = document.createElement("div");
  ballEl.className = "ball";
  gameBoardEl.appendChild(ballEl);
  return ballEl;
}

function addToTube(ballEl) {
  const { balls, baseValue, left } = this;
  const idx = balls.length;
  balls.push(ballEl);
  ballEl.style.top = `${baseValue - tubeWidth * idx}px`;
  ballEl.style.left = `${left}px`;
}

function tubeOnClick(e) {
  console.log(tubes[e.currentTarget.getAttribute("index")]);
  if (!activeTube) {
    // levitate ball
    activeTube = tubes[e.currentTarget.getAttribute("index")];
    const { baseValue, balls, capacity } = activeTube;
    if (balls.length == 0) {
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
  targetTube.add(ballEl);
  activeTube = null;

  console.log(targetTube);
}

const tube1 = createTube(250, 250, tubeCapacity);
const tube2 = createTube(500, 250, tubeCapacity);

const ballEl1 = createBall();
const ballEl2 = createBall();
const ballEl3 = createBall();

tube1.add(ballEl1);
tube1.add(ballEl2);
tube1.add(ballEl3);
