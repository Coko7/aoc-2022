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
    sensor.distanceFromBeacon = sensor.distanceFrom(sensor.closestBeacon);

    sensors.push(sensor);
    beacons.push(beacon);
  }

  console.log('objects parsed');

  // for (let x = minCoords.x; x <= maxCoords.x; x++) {
  //   if (!canCellHoldBeacon(x, yS, sensors)) count++;
  // }

  const db = whereIsDistressBeacon(
    sensors,
    beacons,
    new Position(0, 0),
    new Position(4000000, 4000000)
  );

  const fr = db.x * 4000000 + db.y;

  console.log(`pos: ${db}, f: ${fr}`);
});

function whereIsDistressBeacon(sensors, beacons, minCoos, maxCoos) {
  for (let y = minCoos.y; y <= maxCoos.y; y++) {
    for (let x = minCoos.x; x <= maxCoos.x; x++) {
      const cellInfo = getCellInfo(x, y, sensors);

      if (cellInfo.isDistress) return new Position(x, y);

      // console.log(y + ',' + x + ' invalunt: ' + cellInfo.invalidUntilX);
      x = cellInfo.invalidUntilX;
    }

    if (y % 10000 === 0) console.log(`Line ${y} checked!`);
  }

  return null;
}

function getNextPossibleX(cell, sensor) {
  const absYDiff = Math.abs(cell.y - sensor.y);
  const rad = sensor.distanceFromBeacon - absYDiff;
  return sensor.x + rad;
}

// function getNextPossibleX(cell, sensor) {
//   const absYDiff = Math.abs(cell.y - sensor.y);
//   let b = PythaCalcB(absYDiff, sensor.distanceFromBeacon);
//   b = parseInt(b);

//   return sensor.x + b;
// }

function PythaCalcB(a, c) {
  const b2 = Math.pow(c, 2) - Math.pow(a, 2);
  const b = Math.sqrt(b2);
  return b;
}

function getCellInfo(x, y, sensors) {
  for (let sensor of sensors) {
    const cell = new Position(x, y);
    const distSensor2Cell = sensor.distanceFrom(cell);

    if (distSensor2Cell <= sensor.distanceFromBeacon) {
      const nextX = getNextPossibleX(cell, sensor);
      return {
        x: x,
        y: y,
        sensor: sensor,
        invalidUntilX: nextX,
        isDistress: false,
      };
    }
  }

  return {
    x: x,
    y: y,
    isDistress: true,
  };
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
    this.distanceFromBeacon = -1;
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
}
