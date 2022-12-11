fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const pairs = data.split('\n');
  let fullyContained = 0;

  for (let pair of pairs) {
    const elves = pair.split(',');
    const elf1Sec = getSections(elves[0]);
    const elf2Sec = getSections(elves[1]);

    if (
      isRangeContained(elf1Sec, elf2Sec) ||
      isRangeContained(elf2Sec, elf1Sec)
    )
      fullyContained++;
  }

  console.log(fullyContained);
});

function getSections(range) {
  const bounds = range.split('-');
  
  return {
    start: parseInt(bounds[0]),
    end: parseInt(bounds[1]),
  };
}

function isRangeContained(needle, haystack) {
  return needle.start >= haystack.start && needle.end <= haystack.end;
}
