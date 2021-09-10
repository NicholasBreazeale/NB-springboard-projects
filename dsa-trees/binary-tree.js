/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    function callback(node) {
      // Leaf node found
      if (node.left === null && node.right === null) return 1;

      // Search other nodes
      let depth = Infinity;
      if (node.left !== null) depth = callback(node.left);
      if (node.right !== null) {
        const d = callback(node.right);
        if (depth > d) depth = d;
      }

      // Increment depth
      return depth + 1;
    }
    return (this.root === null ? 0 : callback(this.root));
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    function callback(node) {
      // Leaf node found
      if (node.left === null && node.right === null) return 1;

      // Search other nodes
      let depth = Infinity;
      if (node.left !== null) depth = callback(node.left);
      if (node.right !== null) {
        const d = callback(node.right);
        if (depth < d) depth = d;
      }

      // Increment depth
      return depth + 1;
    }
    return (this.root === null ? 0 : callback(this.root));
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    let max = -Infinity;
    function callback(node) {
      const left = (node.left === null ? 0 : callback(node.left));
      const right = (node.right === null ? 0 : callback(node.right));

      const oneBranchSum = (left > right ? left : right) + node.val;
      const twoBranchSum = left + right + node.val;
      max = (oneBranchSum > twoBranchSum ? oneBranchSum : twoBranchSum);

      return oneBranchSum;
    }

    if (this.root === null) return 0;

    callback(this.root);
    return max;
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    function callback(node) {
      let next = (node.val > lowerBound ? node.val : Infinity);

      for (const child of [node.left, node.right]) {
        if (child === null) continue;
        const n = callback(child);
        if (n !== null && next > n) next = n;
      }
      return (next === Infinity ? null : next);
    }
    return (this.root === null ? null : callback(this.root));
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
