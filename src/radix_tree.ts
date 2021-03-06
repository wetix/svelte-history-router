import type { SvelteComponent } from "svelte";
import type { SvelteComponentDev } from "svelte/internal";

type Component = typeof SvelteComponent | SvelteComponentDev;

type RouterOption = {
  prefix: string;
  routes: Record<string, Component>;
  scrollRestoration: string;
};

type RouteResult = {
  route: string;
  params: Record<string, string>;
  component: Component;
};

// node types
const NORMAL_NODE = 0;
const PLACEHOLDER_NODE = 1;
const WILDCARD_NODE = 2;

class Node {
  path: string = "";
  param?: string = null;
  params: Record<string, number> = {};
  children: Record<string, Node> = {};
  type: number = 0;
  parent?: Node = null;
  placeholder?: Node = null;
  wildcard?: Node = null;
  component?: Component = null;

  constructor(parent: Node = null, type: number = 0, path: string = "") {
    this.parent = parent;
    this.type = type;
    this.path = path;
    if (type === PLACEHOLDER_NODE) {
      this.param = path.substr(1);
    }
  }
}

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
    /blog/go/request-routers/           no match
    /blog/go/                           no match
    /blog/go/request-routers/comments   no match

 Path: /files/*

 Requests:
  /files/                             match: filepath="/"
  /files/LICENSE                      match: filepath="/LICENSE"
  /files/templates/article.html       match: filepath="/templates/article.html"
  /files                              no match
*/

class Router {
  private root: Node = new Node();

  constructor(opt: Partial<RouterOption>) {
    Object.entries(opt.routes).forEach(([k, v]) => {
      this.insertRoute(opt.prefix + k, v);
    });
  }

  insertRoute = (loc: string, component: Component) => {
    const url = new URL(window.location.origin + loc);
    const pathname = url.pathname.replace(/^\/|\/$/g, "");
    const paths = pathname.split("/");
    const len = paths.length;

    let node = this.root;
    let childNode: Node;
    let nodeType: number;
    let path = "";
    let i = 0;

    for (; i < len; i++) {
      path = paths[i];
      nodeType = getNodeType(path);
      childNode = new Node(this.root == node ? null : node, nodeType, path);

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
    const pathname = url.pathname.replace(/^\/|\/$/g, "");
    const paths = pathname.split("/");
    const len = paths.length;

    let i = 0;
    let node = this.root;
    let params = {};
    let wildcardNode;

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
          params = Object.assign(params, { [node.param]: path });
        } else {
          break;
        }
      }
    }

    if (node == null || node.component == null) {
      node = wildcardNode;
    }

    let route = "";
    let component = node?.component;
    while (node != null) {
      route = "/" + node.path + route;
      node = node.parent;
    }

    return {
      route,
      params,
      component,
    };
  };
}

export default Router;
