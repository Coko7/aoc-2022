const fs = require('fs');

const allRocks = [];

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const map = initMap(data);

  simulateFallingSand(map);

  //displayCave(map);

  console.log(countStillSand(map));
});

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromPosText(txt) {
    const parts = txt.split(',');
    return new Position(parseInt(parts[0]), parseInt(parts[1]));
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }

  equals(otherPos) {
    return this.x === otherPos.x && this.y === otherPos.y;
  }
}

function initMap(data) {
  const map = [];
  const lines = data.split('\n');

  for (let line of lines) {
    const rocks = parseLineIntoRocks(line);
    for (let rock of rocks) {
      allRocks.push(rock);
    }
  }

  const maxCoords = getMaxCoords(allRocks);

  console.log(getMinCoords(allRocks));
  console.log(maxCoords);

  for (let y = 0; y <= maxCoords.y + 5; y++) {
    map[y] = [];

    for (let x = 0; x <= maxCoords.x + 5; x++) {
      map[y][x] = '';
    }
  }

  for (let rock of allRocks) {
    if (!map[rock.y]) map[rock.y] = [];
    map[rock.y][rock.x] = 'r';
  }

  return map;
}

function getMinCoords(rocks) {
  let min_x = rocks[0].x;
  let min_y = rocks[0].y;
  for (let rock of rocks) {
    if (rock.x < min_x) min_x = rock.x;
    if (rock.y < min_y) min_y = rock.y;
  }

  return new Position(min_x, min_y);
}

function getMaxCoords(rocks) {
  let max_x = rocks[0].x;
  let max_y = rocks[0].y;
  for (let rock of rocks) {
    if (rock.x > max_x) max_x = rock.x;
    if (rock.y > max_y) max_y = rock.y;
  }

  return new Position(max_x, max_y);
}

function parseLineIntoRocks(line) {
  const rockPositions = [];
  const pathBnds = line.split(' -> ');

  for (let i = 1; i < pathBnds.length; i++) {
    const start = Position.fromPosText(pathBnds[i - 1]);
    const end = Position.fromPosText(pathBnds[i]);
    const rocks = getRocksFromPath(start, end);
    for (let rock of rocks) {
      rockPositions.push(rock);
    }
  }

  return rockPositions;
}

function getRocksFromPath(pathStart, pathEnd) {
  const rocks = [];
  if (pathStart.x !== pathEnd.x) {
    let min = pathStart.x < pathEnd.x ? pathStart : pathEnd;
    let max = pathEnd.x > pathStart.x ? pathEnd : pathStart;
    for (let i = min.x; i <= max.x; i++) {
      rocks.push(new Position(i, pathStart.y));
    }
  }

  if (pathStart.y !== pathEnd.y) {
    let min = pathStart.y < pathEnd.y ? pathStart : pathEnd;
    let max = pathEnd.y > pathStart.y ? pathEnd : pathStart;
    for (let i = min.y; i <= max.y; i++) {
      rocks.push(new Position(pathStart.x, i));
    }
  }

  return rocks;
}

function displayCave(map) {
  let msg = '';
  let minCoords = getMinCoords(allRocks);
  let maxCoords = getMaxCoords(allRocks);
  for (let y = 0; y < maxCoords.y + 5; y++) {
    for (let x = minCoords.x - 5; x < maxCoords.x + 5; x++) {
      if (map[y][x] === 'r') msg += '#';
      else if (map[y][x] === 's') msg += '+';
      else msg += '.';
    }
    msg += '\n';
  }

  console.log(msg);
}

function simulateFallingSand(map) {
  const maxCoords = getMaxCoords(allRocks);
  while (true) {
    let spawnPos = new Position(500, 0);
    let sandPos = spawnPos;
    map[sandPos.y][sandPos.x] = 's';
    let nextPosOfSand = getNextPosOfSand(sandPos, map);

    if (nextPosOfSand.equals(spawnPos)) return;

    while (!nextPosOfSand.equals(sandPos)) {
      map[sandPos.y][sandPos.x] = '';
      sandPos = nextPosOfSand;

      if (sandPos.y >= maxCoords.y + 1) {
        return;
      }

      map[sandPos.y][sandPos.x] = 's';
      nextPosOfSand = getNextPosOfSand(sandPos, map);
    }
  }
}

function getNextPosOfSand(sandPos, map) {
  if (map[sandPos.y + 1][sandPos.x] === '')
    return new Position(sandPos.x, sandPos.y + 1);
  if (map[sandPos.y + 1][sandPos.x - 1] === '')
    return new Position(sandPos.x - 1, sandPos.y + 1);
  if (map[sandPos.y + 1][sandPos.x + 1] === '')
    return new Position(sandPos.x + 1, sandPos.y + 1);

  return new Position(sandPos.x, sandPos.y);
}

function countStillSand(map) {
  let tot = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 's') tot++;
    }
  }

  return tot;
}
