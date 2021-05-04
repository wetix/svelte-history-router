<script lang="ts">
  import { createEventDispatcher, SvelteComponent, tick } from "svelte";
  import type { SvelteComponentDev } from "svelte/internal";
  import Router from "./radix_tree";
  import { location } from "./store";

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
  location.subscribe(async (loc) => {
    // if location is same, don't replace the component
    if (!prevLoc || prevLoc.pathname !== loc.pathname) {
      const result = router.lookupRoute(loc);
      await tick();
      component = result.component;
      params = result.params;
      dispatch("loaded", {
        route: "",
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
