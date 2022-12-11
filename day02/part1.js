fs = require('fs');
fs.readFile('./input-formatted.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let rounds = data.split('\n');
  console.log(rounds);

  let totalPts = 0;
  for (let round of rounds) {
    const inputs = round.split(' ');
    const pts = getMyRoundResult(inputs[0], inputs[1]);
    totalPts += pts;
  }

  console.log(totalPts);

  // let elvesInventories = data.split('\n\n');

  // for (let i = 0; i < elvesInventories.length; i++) {
  //   elvesInventories[i] = elvesInventories[i].split('\n');
  // }

  // //print2DArray(elvesInventories);

  // let elvesInvSum = [];
  // for (let i = 0; i < elvesInventories.length; i++) {
  //   elvesInvSum[i] = 0;
  //   elvesInventories[i].forEach((element) => {
  //     elvesInvSum[i] += parseInt(element);
  //   });
  // }

  // printArray(elvesInvSum);
});

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
