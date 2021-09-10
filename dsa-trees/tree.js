/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    function callback(node) {
      let sum = node.val;
      for (const child of node.children) sum += callback(child);
      return sum;
    }
    return (this.root === null ? 0 : callback(this.root));
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    function callback(node) {
      let count = (node.val % 2 === 0 ? 1 : 0);
      for (const child of node.children) count += callback(child);
      return count;
    }
    return (this.root === null ? 0 : callback(this.root));
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound) {
    function callback(node) {
      let count = (node.val > lowerBound ? 1 : 0);
      for (const child of node.children) count += callback(child);
      return count;
    }
    return (this.root === null ? 0 : callback(this.root));
  }
}

module.exports = { Tree, TreeNode };
