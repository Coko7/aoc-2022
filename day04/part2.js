fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const pairs = data.split('\n');
  let overlaps = 0;

  for (let pair of pairs) {
    const elves = pair.split(',');
    const elf1Sec = getSections(elves[0]);
    const elf2Sec = getSections(elves[1]);

    if (isOverlap(elf1Sec, elf2Sec)) overlaps++;
  }

  console.log(overlaps);
});

function getSections(range) {
  const bounds = range.split('-');

  return {
    start: parseInt(bounds[0]),
    end: parseInt(bounds[1]),
  };
}

function isOverlap(range1, range2) {
  let first, second;
  if (range1.start <= range2.start) {
    first = range1;
    second = range2;
  } else {
    first = range2;
    second = range1;
  }

  return first.end >= second.start;
}