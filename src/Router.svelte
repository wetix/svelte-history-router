<script context="module" lang="ts">
  import { tick } from "svelte";
  import { writable } from "svelte/store";

  const { set, subscribe } = writable(new URL(location.href));
  const params$ = writable<Record<string, string>>({});

  export const url = { subscribe };
  export const params = { subscribe: params$.subscribe };

  export const push = async (pathname: string) => {
    await tick();
    set(new URL(location.origin + pathname));
    history.pushState({}, "", pathname);
  };

  export const pop = async () => {
    await tick();
    history.back();
    setTimeout(() => {
      set(new URL(location.href));
    }, 0);
  };

  export const replace = async (pathname: string) => {
    await tick();
    set(new URL(location.origin + pathname));
    history.replaceState({}, "", pathname);
  };

  addEventListener("popstate", () => {
    set(new URL(location.href));
  });
</script>

<script lang="ts">
  import { onMount, createEventDispatcher, SvelteComponent } from "svelte";
  import type { SvelteComponentDev } from "svelte/internal";
  import Router from "./radix_tree";

  const dispatch = createEventDispatcher();
  const dispatchOnNext = async (evt: string, data: Record<string, any>) => {
    await tick();
    dispatch(evt, data);
  };

  // export let prefix = "";
  export let routes: Record<
    string,
    typeof SvelteComponent | SvelteComponentDev
  > = {};
  export let scrollRestoration = "auto";

  const router = new Router({
    routes,
    scrollRestoration,
  });

  let component = null;
  let params: Record<string, string> = {};
  let prevLoc: URL = null;
  let route = "";

  onMount(() => {
    // prevent memory leak
    const unsubscribe = subscribe(async (loc) => {
      // dispatchOnNext("change", {
      //   location: loc,
      //   params,
      //   component,
      // });

      // if location is same, don't replace the component
      if (!prevLoc || prevLoc.pathname !== loc.pathname) {
        const result = router.lookupRoute(loc);
        route = result.route;
        component = result.component;
        params = result.params;
        params$.set(params);

        dispatchOnNext("routeLoaded", {
          route,
          location: loc,
          params,
          component,
        });
      }

      prevLoc = loc;
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:component this={component} {params} />
