<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const currentRoute = writable({});
  const location$ = writable(location.pathname);

  let router = null;
  const updateRoute = (url: string) => {
    // router.lookupRoute(url);
    console.log(router);
    console.log("Route to =>", url);
  };

  export const push = (url: string) => {
    // updateRoute(url);
    location$.set(url);
    window.history.pushState({}, "", url);
  };
  export const pop = () => {
    window.history.back();
    setTimeout(() => {
      updateRoute(window.location.href);
    }, 0);
  };
  export const replace = (url: string) => {
    updateRoute(url);
    window.history.replaceState({}, "", url);
  };

  // detect user click back or next on browser
  window.addEventListener("popstate", () => {
    location$.set(location.pathname);
  });
</script>

<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import RadixTree from "./radix_tree";

  const dispatch = createEventDispatcher();

  export let routes: Record<string, any> = {};

  router = new RadixTree();
  const newRouter = () => {
    const trie = new RadixTree();
    Object.entries(routes).forEach(([k, v]) => {
      // console.log("====================>");
      // console.log(k);
      trie.insertRoute(k, v);
      // component = v;
    });
    return trie;
  };

  const r = newRouter();
  let component = r.lookupRoute(window.location.href);
  console.log("Location href =>", window.location.href);

  // const dispatchNext = async (type: string, detail?: any) => {
  //   await tick();
  //   dispatch(type, detail);
  // };

  location$.subscribe(async (loc) => {
    await tick();
    console.log("location change =>", loc);
    component = r.lookupRoute(loc);
  });
</script>

{#if component}
  <svelte:component this={component} params={{}} />
{/if}
