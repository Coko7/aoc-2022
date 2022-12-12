fs = require('fs');
const colors = require('colors');

class Position {
  constructor(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.distanceFromOrigin = -1;
    this.visited = false;
  }

  setDistanceFromOrigin(distance) {
    this.distanceFromOrigin = distance;
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}, h: ${this.height}, d: ${this.distanceFromOrigin}`;
  }

  equals(otherPos) {
    return this.x === otherPos.x && this.y === otherPos.y;
  }
}

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let map = data.split('\n');

  let startPos;
  let endPos;

  for (let y = 0; y < map.length; y++) {
    map[y] = map[y].split('');

    for (let x = 0; x < map[y].length; x++) {
      const char = map[y][x];

      if (char === 'S') {
        map[y][x] = new Position(x, y, 0);
        startPos = map[y][x];
      } else if (char === 'E') {
        map[y][x] = new Position(x, y, char2Height('z'));
        endPos = map[y][x];
      } else if (isLowercaseLetter(map[y][x])) {
        const height = char2Height(char);
        if (height >= 0) map[y][x] = new Position(x, y, height);
      }
    }
  }

  // let allPosOfHeightA = getAllPosOfHeight(char2Height('a'), map);
  let allPosOfHeightA = getAllStartingPositions(map);

  let min = 1000000;
  for (let startingPoint of allPosOfHeightA) {
    let dist = findShortestPathDijkstra(startingPoint, endPos, map);
    if (dist < min) min = dist;
  }
  console.log(min);
});

function isLowercaseLetter(char) {
  return char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122;
}

function canMove(from, to) {
  return (
    Math.abs(from.x - to.x) <= 1 &&
    Math.abs(from.y - to.y) <= 1 &&
    to.height - from.height <= 1
  );
}

function char2Height(char) {
  return char.charCodeAt(0) - 97;
}

function getPossibleNextPositions(pos, map) {
  const positions = [];

  if (pos.x > 0 && canMove(pos, map[pos.y][pos.x - 1])) {
    positions.push(map[pos.y][pos.x - 1]);
  }

  if (pos.x < map[0].length - 1 && canMove(pos, map[pos.y][pos.x + 1])) {
    positions.push(map[pos.y][pos.x + 1]);
  }

  if (pos.y > 0 && canMove(pos, map[pos.y - 1][pos.x])) {
    positions.push(map[pos.y - 1][pos.x]);
  }

  if (pos.y < map.length - 1 && canMove(pos, map[pos.y + 1][pos.x])) {
    positions.push(map[pos.y + 1][pos.x]);
  }

  return positions;
}

function findShortestPathDijkstra(initialPos, endPos, map) {
  let unvisited = [];

  // Initialization
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].equals(initialPos)) {
        map[y][x].visited = false;
        map[y][x].setDistanceFromOrigin(0);
        unvisited.push(map[y][x]);
      } else {
        map[y][x].visited = false;
        const infinity = 2 * map.length * map[0].length;
        map[y][x].setDistanceFromOrigin(infinity);
        unvisited.push(map[y][x]);
      }
    }
  }

  // Main algorithm
  let currentPos = initialPos;

  while (true) {
    let neighbors = getPossibleNextPositions(currentPos, map);
    neighbors = neighbors.filter((n) => !n.visited);

    for (let neighbor of neighbors) {
      const dist = currentPos.distanceFromOrigin + 1;
      if (dist < neighbor.distanceFromOrigin) {
        neighbor.setDistanceFromOrigin(dist);
      }
    }

    currentPos.visited = true;
    unvisited = unvisited.filter((p) => !p.visited);

    if (endPos.visited) break;

    let closest = getClosestUnvisited(unvisited);
    currentPos = closest;
  }

  return endPos.distanceFromOrigin;
}

function getClosestUnvisited(unvisited) {
  let closest = unvisited[0];
  for (let i = 0; i < unvisited.length; i++) {
    if (unvisited[i].distanceFromOrigin < closest.distanceFromOrigin) {
      closest = unvisited[i];
    }
  }

  return closest;
}

function getAllStartingPositions(map) {
  const positions = [];

  for (let y = 0; y < map.length; y++) {
    // We return only the first column of input because the second column is the only one with 'b'.
    // So even if we take 'a' points that are closer to the goal, we will not be able to climb up since all the 'b' are on the left side.
    positions.push(map[y][0]);
  }

  return positions;
}
