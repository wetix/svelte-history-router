import type { SvelteComponent } from "svelte";

type Component = typeof SvelteComponent;

// node types
const ROOT_NODE = 0;
const NORMAL_NODE = 1;
const PLACEHOLDER_NODE = 2;
const WILDCARD_NODE = 3;

class Node {
  path: string = "";
  param: null | string = null;
  children: Record<string, Node> = {};
  type: number = 0;
  parent: null | Node = null;
  placeholder: null | Node = null;
  wildcard: null | Node = null;
  component: Component = null;

  constructor(parent: Node = null, type: number = 0, path: string = "") {
    this.parent = parent;
    this.type = type;
    this.path = path;
    if (type === PLACEHOLDER_NODE) {
      this.param = path.substr(1);
    }
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
  if (path.includes("*")) return WILDCARD_NODE;
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

type RouterOption = {
  routes: Record<string, Component>;
};

type RouteResult = {
  params: object;
  component: Component;
};

class Router {
  #root: Node = new Node();

  constructor(opt: RouterOption) {
    Object.entries(opt.routes).forEach(([k, v]) => {
      this.insertRoute(k, v);
    });
    console.log(this.#root);
  }

  insertRoute = (loc: string, component: Component) => {
    const url = new URL(
      /^(http|https)\:\/\//.test(loc) ? loc : "http://wetix.my" + loc
    );

    let node = this.#root;
    let pathname = url.pathname.substr(1);
    if (pathname == "") {
      node.path = pathname;
      node.component = component;
      return;
    }

    const paths = pathname.split("/");
    const len = paths.length;

    let childNode: Node;
    let nodeType: number;
    let path = "";
    let i = 0;

    for (; i < len; i++) {
      path = paths[i];
      nodeType = getNodeType(path);
      childNode = new Node(node, nodeType, path);
      switch (nodeType) {
        case PLACEHOLDER_NODE:
          if (node.placeholder) {
            childNode = node.placeholder;
          } else {
            node.placeholder = childNode;
          }
          break;

        case WILDCARD_NODE:
          if (node.wildcard != null)
            throw new Error("multiple wildcard doesn't allow");
          node.wildcard = childNode;
          break;

        default:
          if (!(path in node.children)) {
            // console.log("Node path =>", node.path, node);
            node.children[path] = childNode;
          } else {
            childNode = node.children[path];
          }
          break;
      }

      node = childNode;
      if (i >= len - 1) {
        node.component = component;
      }
    }
  };

  lookupRoute = (url: URL): RouteResult => {
    let pathname = url.pathname.substr(1);
    console.log("==================================>");
    console.log("lookUp =>", pathname);

    let node = this.#root;
    let component: Component = null;
    let params = {};
    if (pathname === "") {
      component = node.component;
      return {
        params,
        component,
      };
    }

    const paths = pathname.split("/");
    const len = paths.length;
    let wildcardNode;

    let i = 0;
    for (; i < len; i++) {
      const path = paths[i];
      if (node.wildcard !== null) {
        wildcardNode = node.wildcard;
      }

      const childNode = node.children[path];
      if (childNode) {
        node = childNode;
      } else {
        node = node.placeholder;
        if (node != null) {
          params = Object.assign({ [node.param]: path });
          // paramsFound = true
        } else {
          break;
        }
      }
    }

    if (node == null || node.component == null) {
      node = wildcardNode;
    }

    return {
      params,
      component: node.component,
    };
  };
}

export default Router;
