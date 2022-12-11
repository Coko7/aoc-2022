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

  for (let i = 0; i < allCycles.length; i++) {
    let cycle = allCycles[i];
    console.log(`cycle ${i + 1}:`);

    const signalStrength = (i + 1) * x;

    if ((i + 1) % 40 === 20) total += signalStrength;

    console.log(`Signal strength: ${signalStrength}`.red);

    console.log(`\tx (before) : ${x}`);

    console.log(`\t${cycle.name} ${cycle.val ? cycle.val : ''}`);

    if (cycle.name === 'addx') {
      x += cycle.val;
    }

    console.log(`\tx (after) : ${x}`);
  }

  console.log(`Full strength: ${total}`.green);
});

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
