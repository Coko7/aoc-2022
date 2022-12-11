fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let sacks = data.split('\n');

  let totalPrio = 0;

  for (let sack of sacks) {
    const dups = getDuplicates(sack);
    totalPrio += getPrioTot(dups);
  }

  console.log(totalPrio);
});

function getPrioTot(items) {
  let total = 0;
  for (let item of items) {
    total += getPrio(item);
  }
  return total;
}

function getPrio(letter) {
  const letterCode = letter.charCodeAt(0);
  if (letterCode >= 65 && letterCode <= 90) {
    return letterCode - 65 + 27;
  }

  if (letterCode >= 97 && letterCode <= 122) {
    return letterCode - 97 + 1;
  }
}

function getDuplicates(sack) {
  const pocket1 = sack.substr(0, sack.length / 2);
  const pocket2 = sack.substr(sack.length / 2);

  const dups = [];

  for (let c of pocket1) {
    if (pocket2.indexOf(c) > -1 && dups.indexOf(c) === -1) dups.push(c);
  }

  return dups;
}
