import type { SvelteComponent } from "svelte";

type Component = typeof SvelteComponent;

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
  component: Component = null;

  constructor(type: number, path: string = "") {
    // this.parent = parent;
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

type RouterOption = {
  routes: Record<string, typeof SvelteComponent>;
};

type RouteResult = {
  params: object;
  component: typeof SvelteComponent;
};

class RadixTree {
  #root: Node = new Node(ROOT_NODE, "/");
  constructor(opt: RouterOption) {
    Object.entries(opt.routes).forEach(([k, v]) => {
      this.insertRoute(k, v);
    });

    console.log(this.#root);
  }

  insertRoute = (loc: string, component: typeof SvelteComponent) => {
    const url = new URL(
      /^(http|https)\:\/\//.test(loc) ? loc : "http://wetix.my" + loc
    );

    let node = this.#root;
    let { pathname } = url;
    // pathname = pathname.replace(/^\//, "")
    let childNode: Node;
    let nodeType: number;
    console.log("==================================>");
    console.log("pathname =====>", pathname);
    if (pathname === "/") {
      node.path = pathname;
      node.type = getNodeType(pathname);
      node.component = component;
      return;
    }

    let path = "";

    while (pathname.length > 0) {
      pathname = pathname.replace(/^\//, "");
      const offset = pathname.indexOf("/");
      if (offset > -1) {
        path = pathname.substr(0, offset);
      } else {
        path = pathname.substr(0);
      }

      const regexp = new RegExp(`^${path}`);
      pathname = pathname.replace(regexp, "");
      console.log("path =>", pathname.indexOf("/"), path);
      nodeType = getNodeType(path);
      childNode = new Node(nodeType, path);

      const idx = node.children.findIndex((v) => v.path === path);
      if (idx < 0) {
        node.children.push(childNode);
        node = childNode;
      } else {
        node = node.children[idx];
      }

      console.log("Final pathname=>", pathname, pathname.length);
      if (pathname === "") {
        childNode.component = component;
        break;
      }
    }

    console.log("==================================>");
    // let i = 0;
    // let len = paths.length;
    // let node = this.#root;

    // let idx: number = 0;
    // let path: string = "";

    // for (; i < len; i++) {
    //   path = paths[i];
    //   if (path === "") continue;

    //   // check the path exists or not

    //   nodeType = getNodeType(path);

    //   node = childNode;
    //   console.log("nodeType =>", nodeType);
    // }
    // console.log(this.#root);
  };

  lookupRoute = (url: URL): RouteResult => {
    let { pathname } = url;
    pathname = pathname.replace(/^\//, "");

    console.log("lookUp =>", pathname);

    let node = this.#root;
    let component: Component = null;
    const params = {};
    if (pathname === "") {
      component = node.component;
      return {
        params,
        component,
      };
    }

    const paths = pathname.split("/");

    let children = node.children;
    let i = 0;
    let len = paths.length;
    const possibleRoutes = [];
    outer: for (; i < len; i++) {
      const path = paths[i];
      console.log(`path ${i} => ${path}`);
      walk: for (let j = 0; j < children.length; j++) {
        const child = children[j];
        console.log(`${path} == ${child.path}`, path == child.path);
        if ([WILDCARD_NODE, PLACEHOLDER_NODE].includes(child.type)) {
          if (i == len - 1) {
            console.log("point 1");
            component = child.component;
            break outer;
          }
          children = child.children;
          break walk;
        }
        console.log(`childpath ${i},${j} => ${path} ${child.path}`);
        if (path != child.path) {
          continue;
        }
        if (i == len - 1) {
          console.log(child);
          component = child.component;
          console.log("point 2");
          break outer;
        }
        console.log("here");
        children = children[j].children;
        break walk;
      }
    }

    return {
      params,
      component,
    };
  };
}

export default RadixTree;
