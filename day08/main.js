fs = require('fs');
fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const trees = [];
  
  const lines = data.split('\n');
  for (let line of lines) {
    const row = [];
    for (let tree of line) {
      row.push(parseInt(tree));
    }
    trees.push(row);
  }

  const visibleTrees = getVisibleTreesCount(trees);
  console.log(visibleTrees);
});

function getVisibleTreesCount(trees) {
  const treesCp = trees.slice();
  let count = 0;
  let maxScenic = 0;
  for (let i = 0; i < treesCp.length; i++) {
    for (let j = 0; j < treesCp[i].length; j++) {
      if (isVisible(trees, j, i)) {
        count++;
        const score = getScenicScore(trees, j, i);
        console.log(`Scenic Score of [${j},${i}] is ${score}`);
        if (score > maxScenic) {
          maxScenic = score;
        }
      } else {
        //console.log(`Tree at x${j},j${i} is hidden`);
      }
    }
  }

  console.log("MAX " + maxScenic)

  return count;
}

function isVisible(trees, x, y) {
  const myTree = trees[y][x];

  if (x <= 0 || y <= 0 || x >= trees[0].length - 1 || y >= trees.length - 1)
    return true;

  let max = 0;
  for (let i = 0; i < y; i++) {
    const topTree = trees[i][x];
    if (topTree > max) max = topTree;
  }

  if (myTree > max) return true;

  max = 0;
  for (let i = x + 1; i < trees[y].length; i++) {
    const rightTree = trees[y][i];
    if (rightTree > max) max = rightTree;
  }

  if (myTree > max) return true;

  max = 0;
  for (let i = y + 1; i < trees.length; i++) {
    const bottomTree = trees[i][x];
    if (bottomTree > max) max = bottomTree;
  }

  if (myTree > max) return true;

  max = 0;
  for (let i = 0; i < x; i++) {
    const leftTree = trees[y][i];
    if (leftTree > max) max = leftTree;
  }

  if (myTree > max) return true;

  return false;
}

function getScenicScore(trees, x, y) {
  const myTree = trees[y][x];

  let topsVisible = 0;
  for (let i = y - 1; i >= 0; i--) {
    const top = trees[i][x];
    topsVisible++;
    if (top >= myTree) {
      break;
    }
  }

  let rightsVisible = 0;
  for (let i = x + 1; i < trees[0].length; i++) {
    const right = trees[y][i];
    rightsVisible++;
    if (right >= myTree) {
      break;
    }
  }

  let downsVisible = 0;
  for (let i = y + 1; i < trees.length; i++) {
    const down = trees[i][x];
    downsVisible++;
    if (down >= myTree) {
      break;
    }
  }

  let leftsVisible = 0;
  for (let i = x - 1; i >= 0; i--) {
    const left = trees[y][i];
    leftsVisible++;
    if (left >= myTree) {
      break;
    }
  }

  console.log(`${topsVisible} * ${rightsVisible} * ${downsVisible} * ${leftsVisible}`)
  return topsVisible * rightsVisible * downsVisible * leftsVisible;
}