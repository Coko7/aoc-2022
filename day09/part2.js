const colors = require('colors');
const fs = require('fs');

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  offset(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  pos() {
    return new Position(this.x, this.y);
  }

  getDist(otherPos) {
    const dist = Math.sqrt(
      Math.pow(this.x - otherPos.x, 2) + Math.pow(this.y - otherPos.y, 2)
    );

    return dist;
  }

  equals(otherPos) {
    return this.x === otherPos.x && this.y === otherPos.y;
  }

  toString() {
    return `[${this.x},${this.y}]`;
  }
}

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const moves = data.split('\n');

  const allPos = processMoves(moves, 10);
  console.log(allPos);
  console.log(allPos.length);

  displayTrail(allPos, 3);
});

function processMoves(moves, ropeSize) {
  const knots = [];

  for (let i = 0; i < ropeSize; i++) {
    knots.push(new Position(0, 0));
  }

  let tail = knots[ropeSize - 1];

  const tailPositions = [tail.pos()];

  for (let move of moves) {
    const parts = move.split(' ');
    const dir = parts[0];
    const steps = parseInt(parts[1]);

    const dirVec = processDir(dir);
    processMove(dirVec, steps, knots, tailPositions);
  }

  return tailPositions;
}

function processMove(directionVector, steps, knots, tailPositions) {
  let head = knots[0];
  let tail = knots[knots.length - 1];

  console.log(
    `======== MOVE [${directionVector[0]},${directionVector[1]}] * ${steps} ========`
  );

  for (let i = 0; i < steps; i++) {
    // console.log(
    //   `\n>======= MOVE [${directionVector[0]},${directionVector[1]}] =======<`
    // );

    head.offset(directionVector[0], directionVector[1]);

    // console.log('H: ' + head.toString());

    for (let j = 1; j < knots.length; j++) {
      let prevKnot = knots[j - 1];
      let curKnot = knots[j];

      moveKnot(prevKnot, curKnot)
    }

    const tail = knots[knots.length - 1].pos();
    const alreadyVisited = tailPositions.find((p) => p.equals(tail));
    if (!alreadyVisited) tailPositions.push(tail);
    
    displayRope(knots, 1);

    console.log("");
    // console.log(
    //   `head: [${hPos[0]},${hPos[1]}], tail: [${tPos[0]},${tPos[1]}]`
    // );
  }


  return tail.pos();
}

function moveKnot(prevKnot, knot) {
  const dx = prevKnot.x - knot.x;
  const dy = prevKnot.y - knot.y;

  if (Math.abs(dx) >= 2 && dy === 0) {
    knot.x += dx / 2;
    return;
  }

  if (Math.abs(dy) >= 2 && dx === 0) {
    knot.y += dy / 2;
    return;
  }

  if (Math.abs(dx) >= 2 && Math.abs(dy) === 1) {
    knot.x += dx / 2;
    knot.y += dy;
  }
  else if (Math.abs(dy) >= 2 && Math.abs(dx) === 1) {
    knot.x += dx;
    knot.y += dy / 2;
  }
  else if (Math.abs(dy) >= 2 && Math.abs(dx) >= 2) {
    knot.x += dx / 2;
    knot.y += dy / 2;
  }
}

function processDir(direction) {
  if (direction === 'D') return [0, 1];
  if (direction === 'R') return [1, 0];
  if (direction === 'L') return [-1, 0];
  if (direction === 'U') return [0, -1];
}

function displayRope(knots, padding = 1) {
  const minX = getMinX(knots) - padding;
  const maxX = getMaxX(knots) + padding;
  const minY = getMinY(knots) - padding;
  const maxY = getMaxY(knots) + padding;

  for (let y = minY; y <= maxY; y++) {
    let line = '';
    for (let x = minX; x <= maxX; x++) {
      const knotIdxAtPos = knots.findIndex((k) => k.x === x && k.y === y);

      if (knotIdxAtPos > -1) {
        if (knotIdxAtPos === 0) line += 'H'
        else line += knotIdxAtPos;
      } else line += '.'.gray;
    }

    console.log(line);
  }
}

function displayTrail(positions, padding = 1) {
  const minX = getMinX(positions) - padding;
  const maxX = getMaxX(positions) + padding;
  const minY = getMinY(positions) - padding;
  const maxY = getMaxY(positions) + padding;

  const last = positions[positions.length - 1];

  for (let y = minY; y <= maxY; y++) {
    let line = '';
    for (let x = minX; x <= maxX; x++) {
      const visitedPos = positions.find((p) => p.x === x && p.y === y);

      if (x === 0 && y === 0) line += 's'.red;
      else if (visitedPos) {
        if (visitedPos.equals(last)) line += '@'.red;
        else line += '#';
      } else line += '.'.gray;
    }

    console.log(line);
  }
}

function getMinX(positions) {
  let min = positions[0].x;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].x < min) {
      min = positions[i].x;
    }
  }

  return min;
}

function getMaxX(positions) {
  let max = positions[0].x;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].x > max) {
      max = positions[i].x;
    }
  }

  return max;
}

function getMinY(positions) {
  let min = positions[0].y;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].y < min) {
      min = positions[i].y;
    }
  }

  return min;
}

function getMaxY(positions) {
  let max = positions[0].y;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i].y > max) {
      max = positions[i].y;
    }
  }

  return max;
}
