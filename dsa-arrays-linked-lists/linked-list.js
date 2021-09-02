/** Node: node for a singly linked list. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** LinkedList: chained together nodes. */

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  /** push(val): add new value to end of list. */

  push(val) {
    const node = new Node(val);

    if (!this.head) this.head = node;

    if (this.tail) this.tail.next = node;
    this.tail = node;

    this.length++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    const node = new Node(val);

    if (this.head) node.next = this.head;
    this.head = node;

    if (!this.tail) this.tail = node;

    this.length++;
  }

  /** pop(): return & remove last item. */

  pop() {
    // Nothing to return
    if (!this.length) throw new Error("Empty list");

    const val = this.tail.val;

    // If there will be no more nodes after this operation, set head and tail to null
    if (!--this.length) {
      this.head = null;
      this.tail = null;
    }
    // Otherwise, shift tail
    else {
      let node = this.head;
      for (let i = 1; i < this.length; i++) {
        node = node.next;
      }
      node.next = null;
      this.tail = node;
    }

    return val;
  }

  /** shift(): return & remove first item. */

  shift() {
    // Nothing to return
    if (!this.length) throw new Error("Empty list");

    const val = this.head.val;

    // If there will be no more nodes after this operation, set head and tail to null
    if (!--this.length) {
      this.head = null;
      this.tail = null;
    }
    // Otherwise, shift head
    else {
      this.head = this.head.next;
    }

    return val;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    // Out of range
    if (idx >= this.length) throw new RangeError("idx out of list range");

    let node = this.head;
    for (let i = 0; i < idx; i++) node = node.next;
    return node.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    // Out of range
    if (idx >= this.length) throw new RangeError("idx of of list range");

    let node = this.head;
    for (let i = 0; i < idx; i++) node = node.next;
    node.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    // Can't insert out of range
    if (idx > this.length) throw new RangeError("idx out of list range");

    // idx is at the end of the list
    if (idx === this.length) this.push(val);
    // idx is at the beginning of the list
    else if (!idx) this.unshift(val);
    // idx is in the middle of the list
    else {
      const newNode = new Node(val);

      let node = this.head;
      for (let i = 1; i < idx; i++) node = node.next;
      newNode.next = node.next;
      node.next = newNode;
      this.length++;
    }
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    // Can't remove out of range
    if (idx > this.length) throw new RangeError("idx out of list range");

    // idx is at the end of the list
    if (idx === this.length) return this.pop();
    // idx is at the beginning of the list
    else if (!idx) return this.shift();
    // idx is in the middle of the list
    else {
      let node = this.head;
      for (let i = 1; i < idx; i++) node = node.next;
      const val = node.next.val;
      node.next = node.next.next;
      return val;
    }
  }

  /** average(): return an average of all values in the list */

  average() {
    // Empty list
    if (!this.length) return 0;

    let node = this.head;
    let sum = node.val;
    for (let i = 1; i < this.length; i++) {
      node = node.next;
      sum += node.val;
    }

    return sum / this.length;
  }
}

module.exports = LinkedList;
