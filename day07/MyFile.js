export class MyFile {
  constructor(name, type, parent, size = null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.files = [];
    this.size = size;
  }

  isDir() {
    return this.type === 'd';
  }

  isFile() {
    return this.type === 'f';
  }

  getFile(name, type) {
    if (this.isFile())
      throw new Error('Non-dir File cannot contain other file');

    if (this.isDir()) {
      const file = this.files.find((f) => f.name === name && f.type === type);

      return file;
    }

    throw new Error('unknown file type ' + this.type);
  }

  getSize() {
    if (this.isFile()) return this.size;

    if (this.isDir()) {
      let total = 0;
      for (let file of this.files) {
        total += file.getSize();
      }
      return total;
    }
  }

  print(level = 0) {
    let indent = '';
    for (let i = 0; i < level; i++) indent += ' ';

    if (this.isDir()) {
      console.log(`${indent}- ${this.name} (${this.getSize()}):`);
    } else if (this.isFile()) {
      console.log(`${indent}- ${this.name} (${this.size})`);
    }

    for (let file of this.files) {
      file.print(level + 1);
    }
  }
}
