fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const markerLen = 14;
  console.log(locateFirstMarker(data, markerLen));
});

function locateFirstMarker(stream, size) {
  for (let i = 0; i < stream.length; i++) {
    const str = stream.substr(i, size);
    if (isMarker(str, size)) return i + size;
  }
}

function isMarker(str, len) {
  if (str.length !== len) throw new Error('cant happen');

  const dups = [];
  for (let i = 0; i < str.length; i++) {
    if (!dups.includes(str[i])) dups.push(str[i]);
  }

  return dups.length === len;
}
