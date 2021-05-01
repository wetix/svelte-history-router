<script context="module" lang="ts">
  import { derived, writable } from "svelte/store";

  const location$ = writable(new URL(window.location.href));

  let router = null;
  export const location = derived(location$, (loc) => loc);
  export const push = (url: string) => {
    location$.set(new URL(`${window.location.origin}${url}`));
    window.history.pushState({}, "", url);
  };
  export const pop = () => {
    window.history.back();
    location$.set(new URL(window.location.href));
  };
  export const replace = (url: string) => {
    location$.set(new URL(`${window.location.origin}${url}`));
    window.history.replaceState({}, "", url);
  };

  // detect user click back or next on browser
  window.addEventListener("popstate", () => {
    location$.set(new URL(window.location.href));
  });
</script>

<script lang="ts">
  import { createEventDispatcher, SvelteComponent, tick } from "svelte";
  import Router from "./radix_tree";

  const dispatch = createEventDispatcher();

  export let routes: Record<string, typeof SvelteComponent> = {};

  router = new Router({
    routes,
  });

  // let component = router.lookupRoute(window.location.href);
  console.log("Location href =>", window.location.href);

  // const dispatchNext = async (type: string, detail?: any) => {
  //   await tick();
  //   dispatch(type, detail);
  // };

  let component = null;
  let params = {};
  let prevLoc: URL = null;
  location$.subscribe(async (loc) => {
    // if location is same, don't replace the component
    console.log("Previous =>", prevLoc);
    console.log("Current =>", loc);
    if (!prevLoc || prevLoc.pathname !== loc.pathname) {
      const result = router.lookupRoute(loc);
      await tick();
      component = result.component;
      params = result.params;
    }

    prevLoc = loc;
  });
</script>

<svelte:component this={component} {params} />
