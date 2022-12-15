const fs = require('fs');

fs.readFile('./input-s.txt', 'utf8', function (err, data) {
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

  const minCoos = getMinCoords([...sensors, ...beacons]);
  const maxCoos = getMaxCoords([...sensors, ...beacons]);

  const map = [];
  for (let y = minCoos.y; y <= maxCoos.y; y++) {
    map[y] = [];
    for (let x = minCoos.x; x <= maxCoos.x; x++) {
      map[y][x] = '.';
    }
  }

  for (let sensor of sensors) {
    map[sensor.y][sensor.x] = sensor;
  }
  for (let beacon of beacons) {
    map[beacon.y][beacon.x] = beacon;
  }

  console.log('map created');

  for (let sensor of sensors) {
    const dist = sensor.distanceFromBeacon();

    for (let y = minCoos.y; y <= maxCoos.y; y++) {
      for (let x = minCoos.x; x <= maxCoos.x; x++) {
        const cur = new Position(x, y);
        if (sensor.distanceFrom(cur) <= dist) {
          if (map[y][x] === '.') map[y][x] = '#';
        }
      }
    }
  }

  console.log('dead spots updates');

  let minCoords = getMinCoords([...sensors, ...beacons]);
  let maxCoords = getMaxCoords([...sensors, ...beacons]);

  const yS = 10;
  let count = 0;
  
  for (let x = minCoords.x; x <= maxCoords.x; x++) {
    for (let sensor of sensors) {
      const dist = sensor.distanceFromBeacon();
      const cur = new Position(x, yS);
      if (sensor.distanceFrom(cur) <= dist) {
        if (map[yS][x] === '.') map[yS][x] = '#';
      }
    }
    if (map[yS][x] === '#') count++;
  }

  console.log(`line ${yS}: ${count}`);
  // for (let y = minCoords.y; y <= maxCoords.y; y++) {
  //   let count = 0;
  //   for (let x = minCoords.x; x <= maxCoords.x; x++) {
  //     if (map[y][lineToSearch] === '#') count++;
  //   }

  //   console.log(`line ${y}: ${count}`);
  // }

  displayMap(map, [...sensors, ...beacons]);
});

function displayMap(map, objects) {
  let msg = '';
  let minCoords = getMinCoords(objects);
  let maxCoords = getMaxCoords(objects);
  for (let y = minCoords.y; y <= maxCoords.y; y++) {
    msg += y + ' ';
    for (let x = minCoords.x; x <= maxCoords.x; x++) {
      if (map[y][x] === '#') msg += '#';
      else if (map[y][x] === '.') msg += '.';
      else msg += map[y][x].toMapString();
    }
    msg += '\n';
  }

  console.log(msg);
}

function getMinCoords(objects) {
  let min_x = objects[0].x;
  let min_y = objects[0].y;
  for (let obj of objects) {
    if (obj.x < min_x) min_x = obj.x;
    if (obj.y < min_y) min_y = obj.y;
  }

  return new Position(min_x - 10, min_y - 10);
}

function getMaxCoords(objects) {
  let max_x = objects[0].x;
  let max_y = objects[0].y;
  for (let obj of objects) {
    if (obj.x > max_x) max_x = obj.x;
    if (obj.y > max_y) max_y = obj.y;
  }

  return new Position(max_x + 10, max_y + 10);
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
