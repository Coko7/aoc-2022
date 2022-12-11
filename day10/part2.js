const colors = require('colors');
const fs = require('fs');

let x = 1;

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const assemblyInstr = data.split('\n');

  const allCycles = assemblyToMachineInstr(assemblyInstr);

  let total = 0;

  let screen = '';

  for (let i = 0; i < allCycles.length; i++) {
    let cycle = allCycles[i];

    screen += paintScreen(i + 1, x);

    const signalStrength = (i + 1) * x;

    if ((i + 1) % 40 === 20) total += signalStrength;

    if (cycle.name === 'addx') {
      x += cycle.val;
    }
  }

  console.log(screen);

  console.log(`Full strength: ${total}`.green);
});

function paintScreen(cycle, x) {
  let pixels = '';

  let pixelPos = cycle % 40;

  if (isSpriteAtPos(pixelPos - 1, x)) pixels += '#'.green;
  else pixels += '.'.gray;

  if (pixelPos === 0) pixels += `\n`;

  return pixels;
}

function isSpriteAtPos(pos, x) {
  return pos >= x - 1 && pos <= x + 1;
}

function assemblyToMachineInstr(assemblyInstr) {
  const brokenDown = [];

  for (let instr of assemblyInstr) {
    const parts = instr.split(' ');

    if (parts[0] === 'noop') brokenDown.push(processNoop());
    else if (parts[0] === 'addx') {
      const addCycles = processAddX(parts[1]);

      brokenDown.push(addCycles[0]);
      brokenDown.push(addCycles[1]);
    }
  }

  return brokenDown;
}

function processNoop() {
  return {
    name: 'noop',
  };
}

function processAddX(val) {
  return [
    { name: 'preaddx' },
    {
      name: 'addx',
      val: parseInt(val),
    },
  ];
}
