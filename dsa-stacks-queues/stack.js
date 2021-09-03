const { LinkedList, Node } = require("./linkedList");

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */

class Stack extends LinkedList {
  /** push(val): add new value to end of the stack. Returns undefined. */

  push(val) {
    const node = new Node(val);

    if (this.isEmpty()) this.last = node;
    else node.next = this.first;
    this.first = node;

    this.size++;
  }

  pop = this.shift;
}

module.exports = Stack;
