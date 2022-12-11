fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const moves = data.split('\n');

  const allPos = processMoves(moves);
  console.log(allPos);
  console.log(allPos.length)
});

function processMoves(moves) {
  const hPos = [0, 0];
  const tPos = [0, 0];
  const tailPositions = [tPos.slice()];

  for (let move of moves) {
    const parts = move.split(' ');
    const dir = parts[0];
    const steps = parseInt(parts[1]);

    const movement = processDir(dir);

    for (let i = 0; i < steps; i++) {
      hPos[0] += movement[0];
      hPos[1] += movement[1];

      const dist = getDist(hPos, tPos);

      if (dist >= 2) {
        const xDiff = hPos[0] - tPos[0];
        const yDiff = hPos[1] - tPos[1];

        if (Math.abs(xDiff) >= 2) {
          if (hPos[1] !== tPos[1]) {
            tPos[1] = hPos[1]
          }

          tPos[0] += xDiff / 2;
        }

        if (Math.abs(yDiff) >= 2) {
          if (hPos[0] !== tPos[0]) {
            tPos[0] = hPos[0]
          }

          tPos[1] += yDiff / 2;
        }

        const alreadyVisited = tailPositions.find(p => p[0] === tPos[0] && p[1] === tPos[1]);
        if (!alreadyVisited)
          tailPositions.push(tPos.slice());
      }

      //console.log(`head: [${hPos[0]},${hPos[1]}], tail: [${tPos[0]},${tPos[1]}]`)
    }
  }

  return tailPositions;
}

function getDist(headPos, tailPos) {
  const dist = Math.sqrt(
    Math.pow(tailPos[0] - headPos[0], 2) + Math.pow(tailPos[1] - headPos[1], 2)
  );

  return dist;
}

function processDir(direction) {
  if (direction === 'D') return [0, -1];
  if (direction === 'R') return [1, 0];
  if (direction === 'L') return [-1, 0];
  if (direction === 'U') return [0, 1];
}
