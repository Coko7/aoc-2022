const fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const pairs = readPairs(data);

  let indicesSum = 0;
  for (let i = 0; i < pairs.length; i++) {
    const res = comparePairs(pairs[i][0], pairs[i][1]);
    if (res) {
      const pairNum = i + 1;
      console.log(`Pairs ${pairNum} are in right order`);
      indicesSum += pairNum;
    }
  }

  console.log(indicesSum);
});

function comparePairsFlat(p1, p2) {
  p1 = p1.flat();
  p2 = p2.flat();

  for (let i = 0; i < p1.length; i++) {
    if (i >= p2.length) return false;

    if (p1[i] < p2[i]) return true;
    if (p1[i] > p2[i]) return false;
  }

  return true;
}

function comparePairs(p1, p2) {
  if (p1.length === 0 && p2.length === 0) return 'cont';
  if (p1.length === 0) return true;
  if (p2.length === 0) return false;

  let left = p1.shift();
  let right = p2.shift();

  if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) return true;
    if (left > right) return false;

    return comparePairs(p1, p2);
  }

  if (!Array.isArray(left)) left = [left];
  if (!Array.isArray(right)) right = [right];

  const res = comparePairs(left, right);

  if (res !== 'cont') return res;
  else return comparePairs(p1, p2);
}

function readPairs(data) {
  let pairs = data.split('\n\n');

  for (let i = 0; i < pairs.length; i++) {
    pairs[i] = pairs[i].split('\n');

    for (let j = 0; j < pairs[i].length; j++) {
      pairs[i][j] = JSON.parse(pairs[i][j]);
    }
  }

  return pairs;
}
