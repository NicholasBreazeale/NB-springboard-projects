/** Node: node for a linked list. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** LinkedList: chained-together nodes. */

class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  /** shift(): remove the node from the start of the list
   * and return its value. Should throw an error if the list is empty. */

  shift() {
    if (this.isEmpty()) throw new Error("Empty list");

    const val = this.first.val;

    this.first = this.first.next;
    this.size--;
    if (this.isEmpty()) this.last = null;

    return val;
  }

  /** peek(): return the value of the first node in the list. */

  peek() {
    if (this.isEmpty()) throw new Error("Empty list");

    return this.first.val;
  }

  /** isEmpty(): return true if the list is empty, otherwise false */

  isEmpty() {
    return this.size === 0;
  }
}

module.exports = { LinkedList, Node };
