import * as fs from 'fs';
import { Monkey } from './Monkey.js';

let monkeys = [];

const moduloClamp = 19 * 7 * 17 * 13 * 11 * 2 * 5 * 3;

let m0 = new Monkey(0, (item) => item * 13, 19, moduloClamp);
let m1 = new Monkey(1, (item) => item * item, 7, moduloClamp);
let m2 = new Monkey(2, (item) => item + 6, 17, moduloClamp);
let m3 = new Monkey(3, (item) => item + 2, 13, moduloClamp);
let m4 = new Monkey(4, (item) => item + 3, 11, moduloClamp);
let m5 = new Monkey(5, (item) => item + 4, 2, moduloClamp);
let m6 = new Monkey(6, (item) => item + 8, 5, moduloClamp);
let m7 = new Monkey(7, (item) => item * 7, 3, moduloClamp);

monkeys.push(m0, m1, m2, m3, m4, m5, m6, m7);

m0.setPlayBuddies(monkeys[5], monkeys[6]);
m1.setPlayBuddies(monkeys[5], monkeys[0]);
m2.setPlayBuddies(monkeys[1], monkeys[0]);
m3.setPlayBuddies(monkeys[1], monkeys[2]);
m4.setPlayBuddies(monkeys[3], monkeys[7]);
m5.setPlayBuddies(monkeys[4], monkeys[6]);
m6.setPlayBuddies(monkeys[4], monkeys[7]);
m7.setPlayBuddies(monkeys[2], monkeys[3]);

m0.setStartingItems([72, 97]);
m1.setStartingItems([55, 70, 90, 74, 95]);
m2.setStartingItems([74, 97, 66, 57]);
m3.setStartingItems([86, 54, 53]);
m4.setStartingItems([50, 65, 78, 50, 62, 99]);
m5.setStartingItems([90]);
m6.setStartingItems([88, 92, 63, 94, 96, 82, 53, 53]);
m7.setStartingItems([70, 60, 71, 69, 77, 70, 98]);

// const moduloClamp = 23 * 19 * 13 * 17;

// let m0 = new Monkey(0, (item) => item * 19, 23, moduloClamp);
// let m1 = new Monkey(1, (item) => item + 6, 19, moduloClamp);
// let m2 = new Monkey(2, (item) => item * item, 13, moduloClamp);
// let m3 = new Monkey(3, (item) => item + 3, 17, moduloClamp);

// monkeys.push(m0, m1, m2, m3);

// m0.setPlayBuddies(monkeys[2], monkeys[3]);
// m1.setPlayBuddies(monkeys[2], monkeys[0]);
// m2.setPlayBuddies(monkeys[1], monkeys[3]);
// m3.setPlayBuddies(monkeys[0], monkeys[1]);

// m0.setStartingItems([79, 98]);
// m1.setStartingItems([54, 65, 75, 74]);
// m2.setStartingItems([79, 60, 97]);
// m3.setStartingItems([74]);

const maxRounds = 10000;
for (let i = 0; i < maxRounds; i++) {
  const round = i + 1;
  if (round % 1000 === 0 || round === 1 || round === 20) {
    console.log(`\n== After round ${round} ==`);
  }
  for (let monkey of monkeys) {
    monkey.inspectItems();
    //console.log('');
    if (round % 1000 === 0 || round === 1 || round === 20) {
      console.log(
        `Monkey ${monkey.id} inspected items ${monkey.inspections} times`
      );
    }
  }
}

// Get the two most active monkeys
let mostActiveMonkeys = getMostActiveMonkeys(monkeys, 2);

let monkeyBusiness = 1;
for (let monkey of mostActiveMonkeys) {
  monkeyBusiness *= monkey.inspections;
}

console.log(`Monkey business: ${monkeyBusiness}`);

function getMostActiveMonkeys(monkeys, count) {
  const mostActiveMonkeys = [];
  let searchArr = [...monkeys];

  for (let i = 0; i < count; i++) {
    let maxMonkey = getMostActiveMonkey(searchArr);
    searchArr = searchArr.filter((monkey) => !monkey.equals(maxMonkey));
    mostActiveMonkeys.push(maxMonkey);
  }

  return mostActiveMonkeys;
}

function getMostActiveMonkey(monkeys) {
  let monkeyMax = monkeys[0];
  for (let monkey of monkeys) {
    if (monkey.inspections > monkeyMax.inspections) {
      monkeyMax = monkey;
    }
  }

  return monkeyMax;
}

// fs.readFile('./input.txt', 'utf8', function (err, data) {
//   if (err) {
//     return console.log(err);
//   }
// });
