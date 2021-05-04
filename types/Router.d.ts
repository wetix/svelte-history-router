import { SvelteComponent } from "svelte";
import type { SvelteComponentTyped } from "svelte";

type RouterProps = {
  routes: Record<string, typeof SvelteComponent>;
};

type RouterEvents = {
  change: CustomEvent<{}>;
  loaded: CustomEvent<{
    route: string;
    location: string;
    params: Record<string, string>;
    querystring: string;
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
