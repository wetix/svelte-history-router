<script lang="ts">
  import { createEventDispatcher, SvelteComponent, tick } from "svelte";
  import Router from "./radix_tree";
  import { location } from "./store";

  const dispatch = createEventDispatcher();

  export let routes: Record<string, typeof SvelteComponent> = {};

  const router = new Router({
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
  location.subscribe(async (loc) => {
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
