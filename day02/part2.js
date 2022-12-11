fs = require('fs');

Number.prototype.mod = function (n) {
  'use strict';
  return ((this % n) + n) % n;
};

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let rounds = data.split('\n');
  console.log(rounds);

  let totalPts = 0;
  for (let round of rounds) {
    const inputs = round.split(' ');
    const myMove = whatToPlay(inputs[0], inputs[1]);
    const pts = getMyRoundResult(inputs[0], myMove);
    totalPts += pts;
  }

  console.log(totalPts);
});

function offsetMove(move, offset) {
  const moveCharCode = (move.charCodeAt(0) - 65) % 3;
  const offsettedCharCode = (moveCharCode + offset + 3) % 3;
  const offsettedMove = String.fromCharCode(offsettedCharCode + 65);

  return offsettedMove;
}

function whatToPlay(inputOpponent, result) {
  switch (result) {
    case 'X':
      return offsetMove(inputOpponent, -1);
    case 'Y':
      return inputOpponent;
    case 'Z':
      return offsetMove(inputOpponent, 1);
    default:
      throw new Error(`Unknown combination: ${inputOpponent}, ${result}`);
  }
}

function getVal(input) {
  return input.charCodeAt(0) - 64;
}

function getWinner(inputA, inputB) {
  const inputConcat = `${inputA}${inputB}`;
  switch (inputConcat) {
    case 'AA':
      return 0;
    case 'AB':
      return 2;
    case 'AC':
      return 1;
    case 'BA':
      return 1;
    case 'BB':
      return 0;
    case 'BC':
      return 2;
    case 'CA':
      return 2;
    case 'CB':
      return 1;
    case 'CC':
      return 0;
    default:
      throw new Error(`Unknown combination: ${inputA}, ${inputB}`);
  }
}

function getMyRoundPoints(winner) {
  if (winner === 0) return 3;
  if (winner === 1) return 0;
  if (winner === 2) return 6;
}

function getMyRoundResult(inputOpponent, inputMe) {
  const winner = getWinner(inputOpponent, inputMe);
  const moveVal = getVal(inputMe);
  const roundVal = getMyRoundPoints(winner);

  return moveVal + roundVal;
}
