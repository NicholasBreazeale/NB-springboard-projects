class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    const newNode = new Node(val);

    // Empty tree
    if (this.root === null) {
      this.root = newNode;
      return this;
    }

    let search = this.root;
    while (true) {
      // Left side
      if (val < search.val) {
        // Insert new node
        if (search.left === null) {
          search.left = newNode;
          break;
        }
        // Traverse
        else search = search.left;
      }
      // Right side
      else {
        // Insert new node
        if (search.right === null) {
          search.right = newNode;
          break;
        }
        // Traverse
        else search = search.right;
      }
    }

    return this;
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {
    const newNode = new Node(val);

    function callback(node) {
      // Left side
      if (val < node.val) {
        // Insert new node
        if (node.left === null) node.left = newNode;
        // Traverse
        else callback(node.left);
      }
      // Right side
      else {
        // Insert new node
        if (node.right === null) node.right = newNode;
        // Traverse
        else callback(node.right);
      }
    }

    // Empty tree
    if (this.root === null) this.root = newNode;
    // Populated tree
    else callback(this.root);

    return this;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let search = this.root;
    while (search !== null) {
      // Node found
      if (val === search.val) return search;
      // Traverse
      search = (val < search.val ? search.left : search.right);
    }
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val) {
    function callback(node) {
      // Node not found
      if (node === null) return;
      // Node found
      if (val === node.val) return node;
      // Traverse
      return callback(val < node.val ? node.left : node.right);
    }
    return callback(this.root);
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    const nodes = [];

    function callback(node) {
      if (node === null) return;

      nodes.push(node.val);
      callback(node.left);
      callback(node.right);
    }
    callback(this.root);

    return nodes;
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    const nodes = [];

    function callback(node) {
      if (node === null) return;

      callback(node.left);
      nodes.push(node.val);
      callback(node.right);
    }
    callback(this.root);

    return nodes;
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    const nodes = [];

    function callback(node) {
      if (node === null) return;

      callback(node.left);
      callback(node.right);
      nodes.push(node.val);
    }
    callback(this.root);

    return nodes;
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    const nodes = [];

    const queue = [this.root];
    while (queue.length !== 0) {
      const node = queue[0];
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);

      nodes.push(queue.shift().val);
    }

    return nodes;
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {

  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {

  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    
  }
}

module.exports = BinarySearchTree;
