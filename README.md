# Svelte History Router

> A high performance history based router using History API.

<p>

[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)
[![npm](https://img.shields.io/npm/v/svelte-history-router.svg)](https://www.npmjs.com/package/svelte-history-router)
[![download](https://img.shields.io/npm/dw/svelte-history-router.svg)](https://www.npmjs.com/package/svelte-history-router)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/svelte-history-router)](https://bundlephobia.com/result?p=svelte-history-router)
[![LICENCE](https://img.shields.io/github/license/wetix/svelte-history-router)](https://github.com/wetix/svelte-history-router/blob/main/LICENSE)

</p>

## 🔨 Installation

```console
npm install svelte-history-router
```

or

```console
yarn add svelte-history-router
```

## ❓ Why another Router?

- Most of the router implementation are pretty naive, they use regex under the hook, which may have bad performance on routing especially you have a huge routing tree.
- Most of the router using context api, which may required some setup steps when we using with `vite` or `snowpack`.

## ✨ Features

- History based routing
- TypeScript as First Class Citizen
- Lightweight
- High performance
- Ship with multiple output formats (commonjs, iife, esmodule)
- No extra dependency
- Reactive functions
- Simple and configurable
<!-- - Dynamically-imported components and code-splitting -->

## 📝 How to use?

### Define your routes

Each route is a normal Svelte component, with the markup, scripts, bindings, etc. Any Svelte component can be a route.

The route definition is just a JavaScript dictionary (object) where the key is a string with the path (including parameters, etc), and the value is the route object.

For example:

```js
import Home from "./Home.svelte";
import AboutUs from "./AboutUs.svelte";
import MyProfile from "./MyProfile.svelte";
import MyInfo from "./MyInfo.svelte";
import MyPage from "./MyPage.svelte";
import NotFound from "./NotFound.svelte";

const routes = {
  // Exact path
  "/": Home,
  "/about-us": AboutUs,

  // Using named parameters, with last being optional
  "/me/:name/profile": MyProfile,
  "/me/:name/info": MyInfo,

  // Wildcard parameter
  "/me/*": MyPage,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};
```

Routes must begin with / (or \* for the catch-all route). When you using \* wildcard route, you cannot place route path after \*.

The order doesn't matters! Because the routing is follows the following priority :

1. Exact match
2. Placeholder match
3. Wildcard match

### Include the router view

To display the router, in a Svelte component (usually App.svelte), first import the router component. Then, display the router anywhere you'd like by placing the component in the markup. For example:

```svelte
<script>
    import Router from 'svelte-history-router';
    import routes from './routes.ts';
</script>

<body>
    <Router {routes}/>
</body>
```

### Navigating between pages

You can navigate between pages programmatically too:

```js
import { push, pop, replace } from "svelte-history-router";

// The push(url) method navigates to another page, just like clicking on a link
push("/me/joker/profile");

// The pop() method is equivalent to hitting the back button in the browser
pop();

// The replace(url) method navigates to a new page, but without adding a new entry in the browser's history stack
// So, clicking on the back button in the browser would not lead to the page users were visiting before the call to replace()
replace("/me/profile");
```

These methods can be used inside Svelte markup too, for example:

```svelte
<button on:click={() => push('/page')}>Go somewhere</button>
```

The push, pop and replace methods perform navigation actions only in the next iteration ("tick") of the JavaScript event loop. This makes it safe to use them also inside onMount callbacks within Svelte components.

### Parameters

You can get the page parameters from the $params readable store. This is a Svelte store, so it can be used reactively too.

```svelte
<script>
    import { params } from 'svelte-history-router';
</script>

<p>The page parameters is : {JSON.stringify($params)}</p>
```

<!-- https://svelte.dev/repl/6ff75248f7114cc983ebd70b7471171f?version=3.38.2 -->

## Sponsors

<img src="https://asset.wetix.my/images/logo/wetix.png" alt="WeTix" width="240px">

<!-- ## License

[svelte-router](https://github.com/wetix/svelte-router) is 100% free and open-source, under the [MIT license](https://github.com/wetix/svelte-router/blob/master/LICENSE). -->

## Big Thanks To

Thanks to these awesome companies for their support of Open Source developers ❤

[![GitHub](https://jstools.dev/img/badges/github.svg)](https://github.com/open-source)
[![NPM](https://jstools.dev/img/badges/npm.svg)](https://www.npmjs.com/)

Inspired by [radix-router](https://github.com/charlieduong94/radix-router)
