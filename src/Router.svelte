<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const currentRoute = writable({});

  const updateRoute = (url: string) => {};
  export const push = (url: string) => {
    updateRoute(url);
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

  window.addEventListener("popstate", (event: PopStateEvent) => {
    console.log(
      "location: " +
        document.location +
        ", state: " +
        JSON.stringify(event.state)
    );
  });
</script>

<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import RadixTree from "./radix_tree";

  export let routes: Record<string, any> = {};

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
  let component = r.lookupRoute(location.href);
  const dispatch = createEventDispatcher();

  const dispatchNext = async (type: string, detail?: any) => {
    await tick();
    dispatch(type, detail);
  };

  currentRoute.subscribe((v) => {
    console.log("debug route =>", v);
  });

  window.onpopstate = console.log;
  console.log(new URL("http://google.com"));
  // $: console.log(routes);
</script>

{#if component}
  <svelte:component this={component} />
{/if}
