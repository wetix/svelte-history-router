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

window.addEventListener("popstate", () => {
  location$.set(new URL(window.location.href));
});
