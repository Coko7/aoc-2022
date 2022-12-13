const fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const packets = readPackets(data);
  packets.push([[2]], [[6]]);

  // bubble sort
  for (let i = 0; i < packets.length; i++) {
    for (let j = 0; j < packets.length - i - 1; j++) {
      const comp = comparePairs(packets[j], packets[j + 1]);
      if (!comp) {
        let temp = packets[j];
        packets[j] = packets[j + 1];
        packets[j + 1] = temp;
      }
    }
  }

  let divPos1;
  let divPos2;
  for (let i = 0; i < packets.length; i++) {
    if (isDivider(packets[i], 2)) divPos1 = i + 1;
    if (isDivider(packets[i], 6)) divPos2 = i + 1;
  }

  console.log(divPos1 * divPos2);
});

function isDivider(packet, div) {
  return (
    Array.isArray(packet) &&
    packet.length === 1 &&
    Array.isArray(packet[0]) &&
    packet[0].length === 1 &&
    packet[0][0] === div
  );
}

function comparePairs(p1, p2) {
  if (p1.length === 0 && p2.length === 0) return 'cont';
  if (p1.length === 0) return true;
  if (p2.length === 0) return false;

  let left = p1[0];
  let right = p2[0];

  if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) return true;
    if (left > right) return false;

    return comparePairs(p1.slice(1), p2.slice(1));
  }

  if (!Array.isArray(left)) left = [left];
  if (!Array.isArray(right)) right = [right];

  const res = comparePairs(left, right);

  if (res !== 'cont') return res;
  else return comparePairs(p1.slice(1), p2.slice(1));
}

function readPackets(data) {
  let packets = data.split('\n');

  packets = packets.filter((p) => p.length > 0);

  for (let i = 0; i < packets.length; i++) {
    packets[i] = JSON.parse(packets[i]);
  }

  return packets;
}
