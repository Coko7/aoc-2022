fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const parts = data.split('\n\n');

  let stacks = readInitialState(parts[0]);
  console.log(stacks);

  const instructions = parts[1].split('\n');

  for (let instr of instructions) {
    processInstruction(instr, stacks);
  }

  printTopCrates(stacks);
});

function readInitialState(data) {
  const lines = data.split('\n');
  const stacks = [];

  for (let line of lines) {
    const aligned = parseCrateLine(line);
    insertIntoStacks(aligned, stacks);
  }

  for (let i = 0; i < stacks.length; i++) {
    stacks[i] = stacks[i].reverse();
  }

  return stacks;
}

function insertIntoStacks(alignedCrates, stacks) {
  for (let i = 0; i < alignedCrates.length; i++) {
    if (alignedCrates[i] !== null) {
      if (!stacks[i]) {
        stacks[i] = [];
      }
      stacks[i].push(alignedCrates[i]);
    }
  }
}

function parseCrateLine(input) {
  const alignedCrates = [];
  while (input.length > 0) {
    let crateOrNothingRes = parseCrateOrNothing(input);

    input = crateOrNothingRes.input;
    crate = crateOrNothingRes.res;

    alignedCrates.push(crate);
  }

  return alignedCrates;
}

function parseCrateOrNothing(input) {
  let res;
  if (input[0] === '[') {
    res = parseCrate(input);
  } else if (input[0] === ' ') {
    res = parseNoCrate(input);
  }

  let crate = res.res;

  if (res.input.length > 0) {
    res = parseSpacer(res.input);
  }

  return {
    input: res.input,
    res: crate,
  };
}

function parseCrate(input) {
  if (input[0] !== '[')
    throw new Error(`ParseCrate: Expected '[' but got ${input[0]}`);

  let letter;
  const letterCode = input[1].charCodeAt(0);
  if (letterCode >= 65 && letterCode <= 90) {
    letter = input[1];
  } else {
    throw new Error(
      `ParseCrate: Expected uppercase letter but got ${input[1]}`
    );
  }

  if (input[2] !== ']')
    throw new Error(`ParseCrate: Expected ']' but got ${input[2]}`);

  return {
    input: input.substr(3),
    res: letter,
  };
}

function parseNoCrate(input) {
  if (input[0] !== ' ')
    throw new Error(`ParseCrate: Expected ' ' but got ${input[0]}`);

  if (input[1] !== ' ')
    throw new Error(`ParseCrate: Expected ' ' but got ${input[1]}`);

  if (input[2] !== ' ')
    throw new Error(`ParseCrate: Expected ' ' but got ${input[2]}`);

  return {
    input: input.substr(3),
    res: null,
  };
}

function parseSpacer(input) {
  if (input[0] !== ' ') {
    throw new Error(`ParseSpacer: Expected ' ' but got ${input[1]}`);
  }

  return {
    input: input.substr(1),
    res: null,
  };
}

function processInstruction(line, stacks) {
  const parts = line.split(' ');

  if (parts[0] === 'move') {
    args = {
      count: parseInt(parts[1]),
      from: parseInt(parts[3]),
      to: parseInt(parts[5]),
    };
    processMoveInstr(args, stacks);
  }
}

function processMoveInstr(args, stacks) {
  count = args.count;
  from = args.from;
  to = args.to;

  for (let i = 0; i < count; i++) {
    let crate = stacks[from - 1].pop();
    stacks[to - 1].push(crate);
  }
}

function printTopCrates(stacks) {
  let msg = '';
  for (let stack of stacks) {
    msg = `${msg}${stack[stack.length - 1]}`;
  }
  console.log(`Top crates: ${msg}`);
}
