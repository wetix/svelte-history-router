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
  import Router from "./radix_tree";

  const dispatch = createEventDispatcher();

  export let routes: Record<string, any> = {};

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
  location$.subscribe(async (loc) => {
    console.log("location change =>", loc);
    const result = router.lookupRoute(loc);
    await tick();
    console.log("Result =>", result);
    // if location is same, don't replace the component
    component = result.component;
    params = result.params;
    // component = router.lookupRoute(loc);
  });
</script>

<svelte:component this={component} {params} />
