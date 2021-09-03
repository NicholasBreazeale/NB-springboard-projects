const { LinkedList, Node } = require("./linkedList");

/** Queue: chained-together nodes where you can
 *  remove from the front or add to the back. */

class Queue extends LinkedList {
  /** enqueue(val): add new value to end of the queue. Returns undefined. */

  enqueue(val) {
    const node = new Node(val);

    if (this.isEmpty()) this.first = node;
    else this.last.next = node;
    this.last = node;

    this.size++;
  }

  dequeue = this.shift;
}

module.exports = Queue;
