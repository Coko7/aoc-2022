fs = require('fs');
fs.readFile('./input2.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let total = 0;
  const groups = getGroups(data);

  for (let group of groups) {
    const badge = getBadge(group);
    const prio = getPrio(badge);
    total += prio;
    // console.log(`${badge}: ${prio}`);
  }

  console.log(total);
});

function getGroups(data) {
  const elves = data.split('\n');
  const groups = [];
  let group = [];

  let i = 1;
  for (let elf of elves) {
    group.push(elf);
    if (i === 3) {
      i = 1;
      groups.push(group);
      group = [];
      continue;
    }
    i++;
  }

  return groups;
}

function getBadge(group) {
  for (let item of group[0]) {
    if (group[1].indexOf(item) > -1 && group[2].indexOf(item) > -1) return item;
  }
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
