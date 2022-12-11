fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let elvesInventories = data.split('\n\n');

  for (let i = 0; i < elvesInventories.length; i++) {
    elvesInventories[i] = elvesInventories[i].split('\n');
  }

  //print2DArray(elvesInventories);

  let elvesInvSum = [];
  for (let i = 0; i < elvesInventories.length; i++) {
    elvesInvSum[i] = 0;
    elvesInventories[i].forEach((element) => {
      elvesInvSum[i] += parseInt(element);
    });
  }

  printArray(elvesInvSum);
});

function printArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(`${i + 1}:${arr[i]}`);
  }
}

function print2DArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    process.stdout.write(`e ${i + 1}: `);
    for (let j = 0; j < arr[i].length; j++) {
      process.stdout.write(`${arr[i][j]}, `);
    }
    console.log('');
  }
}
