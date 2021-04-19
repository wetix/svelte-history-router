<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const currentRoute = writable({});
  export const push = (url: string) => {
    history.pushState({}, "", url);
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
  import { createEventDispatcher } from "svelte";
  import RadixTree from "./radix_tree";

  export let routes: Record<string, any> = {};

  const rtree = new RadixTree();
  let component = null;
  Object.entries(routes).forEach(([k, v]) => {
    console.log("====================>");
    console.log(k);
    rtree.insert(k);
    component = v;
  });

  const dispatch = createEventDispatcher();

  console.log(new URL("http://google.com"));
  $: console.log(routes);
</script>

{#if component}
  <svelte:component this={component} />
{/if}
