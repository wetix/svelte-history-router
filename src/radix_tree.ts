// node types
const NORMAL_NODE = 0;
const WILDCARD_NODE = 1;
const PLACEHOLDER_NODE = 2;

function Node(options) {
  options = options || {};
  this.type = options.type || NORMAL_NODE;

  // if placeholder node
  this.paramName = options.paramName || null;

  this.parent = options.parent || null;
  this.children = {};
  this.data = options.data || null;

  // keep track of special child nodes
  this.wildcardChildNode = null;
  this.placeholderChildNode = null;
}

class RadixTree {
  insert(url: string) {
    const paths = url.trim().split("/");
    console.log(paths);
    let i = 0;
    let len = paths.length;
    for (; i < len; i++) {
      console.log(paths[i]);
    }
  }

  lookup(url: string) {}
}

export default RadixTree;
