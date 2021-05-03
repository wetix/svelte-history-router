import { SvelteComponent } from "svelte";
import type { SvelteComponentTyped } from "svelte";

type RouterProps = {
  routes: Record<string, typeof SvelteComponent>;
};

type RouterEvents = {};

type RouterSlot = {};

declare class Router extends SvelteComponentTyped<
  RouterProps,
  RouterEvents,
  RouterSlot
> {}
