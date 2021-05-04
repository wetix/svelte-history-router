<script context="module" lang="ts">
  import { writable } from "svelte/store";

  const { set, subscribe } = writable(new URL(window.location.href));
  const params$ = writable<Record<string, string>>({});

  export const location = { subscribe };
  export const params = { subscribe: params$.subscribe };
  export const push = (url: string) => {
    set(new URL(`${window.location.origin}${url}`));
    window.history.pushState({}, "", url);
  };
  export const pop = () => {
    set(new URL(window.location.href));
    window.history.back();
  };
  export const replace = (url: string) => {
    set(new URL(`${window.location.origin}${url}`));
    window.history.replaceState({}, "", url);
  };

  window.addEventListener("popstate", () => {
    set(new URL(window.location.href));
  });
</script>

<script lang="ts">
  import { createEventDispatcher, SvelteComponent, tick } from "svelte";
  import type { SvelteComponentDev } from "svelte/internal";
  import Router from "./radix_tree";

  const dispatch = createEventDispatcher();

  export let routes: Record<
    string,
    typeof SvelteComponent | SvelteComponentDev
  > = {};

  const router = new Router({
    routes,
  });

  let component = null;
  let params = {};
  let prevLoc: URL = null;
  subscribe(async (loc) => {
    console.log("onChange =>", loc);
    // if location is same, don't replace the component
    if (!prevLoc || prevLoc.pathname !== loc.pathname) {
      const result = router.lookupRoute(loc);
      console.log(result.route);
      await tick();
      const { route } = result;
      component = result.component;
      params = result.params;
      params$.set(params);
      dispatch("loaded", {
        route,
        location: loc.pathname,
        querystring: loc.search,
        params,
        component,
      });
    }

    prevLoc = loc;
  });
</script>

<svelte:component this={component} {params} />
