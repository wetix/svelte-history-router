// @ts-ignore
import { push } from "./Router.svelte";

export const link = (node: HTMLElement) => {
  const onClick = (e: Event) => {
    let el = e.target as HTMLElement;
    while (el && "A" !== el.nodeName.toUpperCase())
      el = el.parentNode as HTMLElement;
    if (!el) return;
    const { origin } = location;
    const href = el.getAttribute("href");
    let url: URL = null;
    if (/^(http|https)\:\/\//.test(href)) url = new URL(href);
    else url = new URL(origin + href);
    if (origin != url.origin) return;
    e.preventDefault();
    push(url.pathname);
  };

  node.addEventListener("click", onClick);

  return {
    // When the element is destroyed, remove the click event
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
};
