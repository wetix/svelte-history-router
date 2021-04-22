import type { SvelteComponent } from "svelte";

// node types
const ROOT_NODE = 0;
const NORMAL_NODE = 1;
const WILDCARD_NODE = 2;
const PLACEHOLDER_NODE = 3;

class Node {
  parent: null | Node = null;
  path: string = "";
  param: null | string = null;
  children: Node[] = [];
  type: number;
  component: typeof SvelteComponent;

  constructor(
    type: number,
    path: string = "",
    comp: typeof SvelteComponent = null
  ) {
    // this.parent = parent;
    this.type = type;
    this.path = path;
    if (type === PLACEHOLDER_NODE) {
      this.param = path.substr(1);
    }
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

/*
The registered path, against which the router matches incoming requests, can
contain two types of parameters:
 Syntax    Type
 :name     named parameter
 *name     catch-all parameter

Named parameters are dynamic path segments. They match anything until the
next '/' or the path end:
  Path: /

  Requests:
    /blog/go/request-routers            match: category="go", post="request-routers"
    /blog/go/request-routers/           no match, but the router would redirect
    /blog/go/                           no match
    /blog/go/request-routers/comments   no match

  
  Path: /blog/:category/:post

  Requests:
    /blog/go/request-routers            match: category="go", post="request-routers"
    /blog/go/request-routers/           no match, but the router would redirect
    /blog/go/                           no match
    /blog/go/request-routers/comments   no match

 Path: /files/*filepath

 Requests:
  /files/                             match: filepath="/"
  /files/LICENSE                      match: filepath="/LICENSE"
  /files/templates/article.html       match: filepath="/templates/article.html"
  /files                              no match, but the router would redirect
*/

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

  lookupRoute = (url: string): null | typeof SvelteComponent => {
    // const url = new URL(uri);
    // const { pathname } = url;
    const paths = url.replace(/^\//, "").split("/");
    console.log("lookup =>", url.replace(/^\//, ""));
    console.log("paths =>", paths);

    let node = this.#root;
    let children = node.children;
    let i = 0;
    let len = paths.length;
    for (; i < len; i++) {
      const path = paths[i];

      console.log(`path ${i} => ${path}`);
      walk: for (let j = 0; j < children.length; j++) {
        const child = children[j];
        console.log(`${path} == ${child.path}`, path == child.path);
        if ([WILDCARD_NODE, PLACEHOLDER_NODE].includes(child.type)) {
          if (i == len - 1) {
            console.log("point 1");
            return child.component;
          }

          children = child.children;
          break walk;
        }

        if (path != child.path) {
          continue;
        }

        if (path === child.path) {
          if (i == len - 1) {
            console.log("point 2");
            return child.component;
          }

          children = children[j].children;
          break walk;
        }
      }
    }

    console.log("point 3");

    return null;
  };
}

export default RadixTree;
