import type { SvelteComponent } from "svelte";

// node types
const ROOT_NODE = 0;
const NORMAL_NODE = 1;
const WILDCARD_NODE = 2;
const PLACEHOLDER_NODE = 3;

class Node {
  parent: null | Node = null;
  path: String = "";
  children: Node[] = [];
  type: number;
  component: typeof SvelteComponent;

  constructor(
    type: number,
    path: string = "",
    comp: typeof SvelteComponent = null
  ) {
    this.type = type;
    this.path = path;
    this.component = comp;
  }
}

// function Node(options) {
//   options = options || {};
//   this.type = options.type || NORMAL_NODE;

//   // if placeholder node
//   this.paramName = options.paramName || null;

//   this.parent = options.parent || null;
//   this.children = {};
//   this.data = options.data || null;

//   // keep track of special child nodes
//   this.wildcardChildNode = null;
//   this.placeholderChildNode = null;
// }

const getNodeType = (path: string) => {
  if (path.startsWith(":")) return PLACEHOLDER_NODE;
  if (path == "*") return WILDCARD_NODE;
  return NORMAL_NODE;
};

class RadixTree {
  #root: Node = new Node(ROOT_NODE, "/");

  insertRoute = (url: string, comp: typeof SvelteComponent) => {
    const paths = url.trim().split("/");
    console.log("path =>", url);

    let i = 0;
    let len = paths.length;
    let node = this.#root;
    let childNode: Node;
    let nodeType: number;
    let idx: number = 0;
    let path: string = "";

    for (; i < len; i++) {
      path = paths[i];
      if (path === "") continue;

      // check the path exists or not
      idx = node.children.findIndex((v) => v.path === path);
      nodeType = getNodeType(path);
      childNode = new Node(nodeType, path, comp);
      if (idx < 0) {
        node.children.push(childNode);
      } else {
        node = node.children[idx];
        console.log("procedd next");
        continue;
      }

      node = childNode;
      console.log("nodeType =>", nodeType);
    }
    console.log(this.#root);
  };

  lookupRoute = (uri: string): null | typeof SvelteComponent => {
    const url = new URL(uri);
    const { pathname } = url;
    const paths = pathname.split("/");
    console.log("lookup =>");
    console.log(url);
    console.log(paths);

    let node = this.#root;
    let i = 1;
    let len = paths.length;
    for (; i < len; i++) {
      const path = paths[i];

      for (let j = 0; j < node.children.length; j++) {
        if (path != node.children[j].path) {
          continue;
        }

        if (i == len - 1) {
          return node.children[j].component;
        }
        console.log();
      }
      console.log("path =>", path);
    }

    return null;
  };
}

export default RadixTree;
