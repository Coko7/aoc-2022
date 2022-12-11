export class Monkey {
  constructor(id, operationMethod, divisibilityTest, moduloClamp = -1) {
    this.id = id;
    this.operation = operationMethod;
    this.divisibilityTest = divisibilityTest;
    this.moduloClamp = moduloClamp;
    this.items = [];
    this.trueMonkey = null;
    this.falseMonkey = null;
    this.inspections = 0;
    this.verbose = false;
  }

  setPlayBuddies(trueMonkey, falseMonkey) {
    this.trueMonkey = trueMonkey;
    this.falseMonkey = falseMonkey;
  }

  setStartingItems(items) {
    this.items = items;
    this.inspections = 0;
  }

  inspectItems() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.verbose) {
        console.log(
          `Monkey ${this.id} inspects item with worry level of ${this.items[i]}`
        );
      }

      this.inspections++;
      this.items[i] = this.operation(this.items[i]);

      if (this.verbose) {
        console.log(`Worry level becomes ${this.items[i]} after operation`);
      }

      if (this.moduloClamp > 0)
        this.items[i] %= this.moduloClamp
      // // You are relieved the item has not been damaged
      // this.items[i] = Math.floor(this.items[i] / 3);
      // console.log(
      //   `Monkey gets bored with item. Worry level is divided by 3 to ${this.items[i]}`
      // );

      if (this.items[i] % this.divisibilityTest === 0) {
        if (this.verbose)
          console.log(`Worry level is divisible by ${this.divisibilityTest}`);
        this.throwItem(this.items[i], this.trueMonkey);
      } else {
        if (this.verbose)
          console.log(
            `Worry level is not divisible by ${this.divisibilityTest}`
          );
        this.throwItem(this.items[i], this.falseMonkey);
      }

      this.items[i] = null;
    }

    if (this.verbose) console.log('');

    this.items = this.items.filter((item) => item !== null);
  }

  throwItem(worryLevel, toMonkey) {
    if (this.verbose)
      console.log(
        `Item with WL of ${worryLevel} is sent to monkey ${toMonkey.id}`
      );
    toMonkey.items.push(worryLevel);
  }

  equals(otherMonkey) {
    return otherMonkey.id === this.id;
  }
}
