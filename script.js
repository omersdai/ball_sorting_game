const gameBoardEl = document.getElementById("gameBoard");
const tubes = [];

// CSS Related
const tubeWidth = 50; // px
const ballSize = tubeWidth - 20; // px

function createTube(left, top, size) {
  const tubeElement = document.createElement("div");
  tubeElement.className = "tube-container";
  tubeElement.style.left = `${left}px`;
  tubeElement.style.top = `${top}px`;

  for (let i = 0; i < size; i++) {
    tubeElement.appendChild(createTubePiece());
  }

  tubeElement.lastChild.classList.add("tube-bottom");
  gameBoardEl.appendChild(tubeElement);

  return {
    baseValue: 250 + ((size - 1) / 2) * tubeWidth,
    element: tubeElement,
    balls: [],
    add: addToTube,
  };
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
  const idx = this.balls.length;
  this.balls.push(ballEl);
  ballEl.style.top = `${this.baseValue - tubeWidth * idx}px`;
}

const tube = createTube(250, 250, 4);
const ballEl1 = createBall();
const ballEl2 = createBall();
const ballEl3 = createBall();

tube.add(ballEl1);
tube.add(ballEl2);
tube.add(ballEl3);
