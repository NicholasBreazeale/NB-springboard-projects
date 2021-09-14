class Node {
  constructor(value, adjacent = new Set()) {
    this.value = value;
    this.adjacent = adjacent;
  }
}

class Graph {
  constructor() {
    this.nodes = new Set();
  }

  // this function accepts a Node instance and adds it to the nodes property on the graph
  addVertex(vertex) {
    this.nodes.add(vertex);
  }

  // this function accepts an array of Node instances and adds them to the nodes property on the graph
  addVertices(vertexArray) {
    for (const vertex of vertexArray) this.nodes.add(vertex);
  }

  // this function accepts two vertices and updates their adjacent values to include the other vertex
  addEdge(v1, v2) {
    const nodes = [null, null];
    for (const node of this.nodes) {
      if (node === v1) nodes[0] = v1;
      else if (node === v2) nodes[1] = v2;
    }

    if (nodes.includes(null)) throw new Error("Vertex not found.");

    nodes[0].adjacent.add(nodes[1]);
    nodes[1].adjacent.add(nodes[0]);
  }

  // this function accepts two vertices and updates their adjacent values to remove the other vertex
  removeEdge(v1, v2) {
    const nodes = [null, null];
    for (const node of this.nodes) {
      if (node === v1) nodes[0] = v1;
      else if (node === v2) nodes[1] = v2;
    }

    if (nodes.includes(null)) throw new Error("Vertex not found.");

    nodes[0].adjacent.delete(nodes[1]);
    nodes[1].adjacent.delete(nodes[0]);
  }

  // this function accepts a vertex and removes it from the nodes property, it also updates any adjacency lists that include that vertex
  removeVertex(vertex) {
    this.nodes.forEach(val => val.adjacent.delete(vertex));
    this.nodes.delete(vertex);
  }

  // this function returns an array of Node values using DFS
  depthFirstSearch(start) {
    const searched = [];

    function callback(node) {
      searched.push(node);
      node.adjacent.forEach(val => {
        if (!searched.includes(val)) callback(val);
      });
    }
    callback(start);

    return searched.reduce((acc, val) => {
      acc.push(val.value);
      return acc;
    }, []);
  }

  // this function returns an array of Node values using BFS
  breadthFirstSearch(start) {
    const searched = [];

    const queue = [start];
    while (queue.length) {
      searched.push(queue[0]);
      queue[0].adjacent.forEach(val => {
        if (!searched.includes(val) && !queue.includes(val)) queue.push(val);
      });
      queue.shift();
    }

    return searched.reduce((acc, val) => {
      acc.push(val.value);
      return acc;
    }, []);
  }
}

module.exports = {Graph, Node}