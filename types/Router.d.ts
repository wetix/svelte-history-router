import { SvelteComponent } from "svelte";
import type { SvelteComponentTyped } from "svelte";
import type { SvelteComponentDev } from "svelte/internal";

type RouterProps = {
  prefix?: string;
  routes: Record<string, typeof SvelteComponent | SvelteComponentDev>;
  scrollRestoration?: "auto" | "manual";
};

type RouterEvents = {
  routeLoaded: CustomEvent<{
    route: string;
    location: URL;
    params: Record<string, string>;
    component: typeof SvelteComponent;
  }>;
};

type RouterSlot = {};

declare class Router extends SvelteComponentTyped<
  RouterProps,
  RouterEvents,
  RouterSlot
> {}
export default Router;
