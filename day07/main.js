import * as fs from 'fs';
import { MyFile } from './MyFile.js';

let rootFS = new MyFile('/', 'd', null);

let cwd = rootFS;

const deviceTotalStorage = 70_000_000;
const updateSize = 30_000_000;

fs.readFile('./input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  initFileSystem(data);
  rootFS.print();

  const FSSize = rootFS.getSize();
  const freeSpace = deviceTotalStorage - FSSize;
  const space2free = updateSize - freeSpace;

  console.log(space2free);
  const dirs = findAllSubDirsWithSizeAtLeast(rootFS, space2free);

  let min = dirs[0];
  for (let i = 1; i < dirs.length; i++) {
    if (dirs[i].getSize() < min.getSize()) {
      min = dirs[i];
    }
  }

  console.log(min.name + ' ' + min.getSize());
});

function initFileSystem(shellCommands) {
  const cmdAndRes = shellCommands.split('\n');

  for (let i = 0; i < cmdAndRes.length; i++) {
    let parts = cmdAndRes[i].split(' ');

    if (parts[1] === 'cd') {
      cwd = processCd(parts[2]);
    } else if (parts[1] === 'ls') {
      let lsResLines = [];
      let j = i + 1;
      while (!cmdAndRes[j].startsWith('$')) {
        lsResLines.push(cmdAndRes[j++]);
        if (j >= cmdAndRes.length) break;
      }

      processLs(lsResLines);
    }
  }
}

function processCd(arg) {
  if (arg === '/') return rootFS;
  if (arg === '..') return cwd.parent;

  const dir = cwd.getFile(arg, 'd');
  if (dir) return dir;

  throw new Error(`No such dir: '${arg}'`);
}

function processLs(resLines) {
  for (let line of resLines) {
    const parts = line.split(' ');

    if (parts[0] === 'dir') {
      if (!cwd.getFile(parts[1], 'd')) {
        const niu = new MyFile(parts[1], 'd', cwd);
        cwd.files.push(niu);
      }
    } else if (!isNaN(parts[0])) {
      const fileSize = parseInt(parts[0]);
      const niu = new MyFile(parts[1], 'f', cwd, fileSize);
      cwd.files.push(niu);
    }
  }
}

function findAllSubDirsWithSizeAtMost(dir, size) {
  let subdirs = [];

  const dirSize = dir.getSize();
  if (dirSize <= size && dir.isDir()) subdirs.push(dir);

  for (let subDir of dir.files) {
    let subdirdirs = findAllSubDirsWithSizeAtMost(subDir, size);
    subdirs = [...subdirs, ...subdirdirs];
  }
  return subdirs;
}

function findAllSubDirsWithSizeAtLeast(dir, size) {
  let subdirs = [];

  const dirSize = dir.getSize();
  if (dirSize >= size && dir.isDir()) subdirs.push(dir);

  for (let subDir of dir.files) {
    let subdirdirs = findAllSubDirsWithSizeAtLeast(subDir, size);
    subdirs = [...subdirs, ...subdirdirs];
  }
  return subdirs;
}
