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
    pop: popFromTube,
    levitate: levitateBall,
    place: placeBall,
    transfer: transferToTube,
    getTopColor: getTopColor,
    isFull: tubeIsFull,
    isActive: tubeIsActive,
  };

  tubes.push(tube);

  return tube;
}

function addToTube(ballEl) {
  const { balls, capacity } = this;
  if (balls.length === capacity) return false;

  const idx = balls.length;
  balls.push(ballEl);
  this.place(ballEl, idx);

  return true;
}

function popFromTube() {
  const ballEl = this.balls.pop();

  return ballEl;
}

function levitateBall(ballEl) {
  const { baseValue, capacity, left } = this;
  ballEl.style.top = `${baseValue - tubeWidth * capacity}px`;
  ballEl.style.left = `${left}px`;
}

function placeBall(ballEl, idx) {
  const { baseValue, left } = this;

  ballEl.style.top = `${baseValue - tubeWidth * idx}px`;
  ballEl.style.left = `${left}px`;
}

function transferToTube(tube, delay) {
  const ballEl = this.balls.pop();
  const idx = tube.balls.length;
  tube.balls.push(ballEl);

  setTimeout(() => {
    this.levitate(ballEl);
    setTimeout(() => {
      tube.levitate(ballEl);
      setTimeout(() => tube.place(ballEl, idx), transitionSpeed);
    }, delay);
  }, delay);
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
  ballEl.style.transition = TRANSITION;
  ballEl.setAttribute("color", color);

  gameBoardEl.appendChild(ballEl);
  return ballEl;
}
