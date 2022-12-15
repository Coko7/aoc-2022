const fs = require('fs');

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const sensors = [];
  const beacons = [];

  const lines = data.split('\n');

  for (let line of lines) {
    const parts = line.split(':');

    const sensor = Position.fromPosText(parts[0], false);
    const beacon = Position.fromPosText(parts[1], true);

    sensor.closestBeacon = beacon;

    sensors.push(sensor);
    beacons.push(beacon);
  }

  console.log('objects parsed');

  const yS = 2000000;

  console.log('dead spots updated');

  let minCoords = getMinCoords([...sensors, ...beacons]);
  let maxCoords = getMaxCoords([...sensors, ...beacons]);

  let count = 0;

  for (let x = minCoords.x; x <= maxCoords.x; x++) {
    if (!canCellHoldBeacon(x, yS, sensors)) count++;
  }

  console.log(`line ${yS}: ${count}`);
});

function canCellHoldBeacon(x, y, sensors) {
  for (let sensor of sensors) {
    const distFromBeac = sensor.distanceFromBeacon();

    const cell = new Position(x, y);
    if (sensor.distanceFrom(cell) <= distFromBeac) return false;
  }

  return true;
}

function getMinCoords(objects) {
  let min_x = objects[0].x;
  let min_y = objects[0].y;
  for (let obj of objects) {
    if (obj.x < min_x) min_x = obj.x;
    if (obj.y < min_y) min_y = obj.y;
  }

  return new Position(min_x - 10000000, min_y - 10000000);
}

function getMaxCoords(objects) {
  let max_x = objects[0].x;
  let max_y = objects[0].y;
  for (let obj of objects) {
    if (obj.x > max_x) max_x = obj.x;
    if (obj.y > max_y) max_y = obj.y;
  }

  return new Position(max_x + 10000000, max_y + 10000000);
}

class Position {
  constructor(x, y, isBeacon) {
    this.x = x;
    this.y = y;
    this.isBeacon = isBeacon;
    this.closestBeacon = null;
  }

  static fromPosText(txt, isBeacon) {
    const parts = txt.split(',');
    return new Position(parseInt(parts[0]), parseInt(parts[1]), isBeacon);
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }

  toMapString() {
    return this.isBeacon ? 'B' : 'S';
  }

  equals(otherPos) {
    return this.x === otherPos.x && this.y === otherPos.y;
  }

  distanceFrom(otherPos) {
    return Math.abs(this.x - otherPos.x) + Math.abs(this.y - otherPos.y);
  }

  distanceFromBeacon() {
    return this.distanceFrom(this.closestBeacon);
  }
}
