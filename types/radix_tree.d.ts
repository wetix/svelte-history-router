import type { SvelteComponent } from "svelte";
import type { SvelteComponentDev } from "svelte/internal";
declare type Component = typeof SvelteComponent | SvelteComponentDev;
declare type RouterOption = {
    routes: Record<string, Component>;
};
declare type RouteResult = {
    params: object;
    component: Component;
};
declare class Router {
    #private;
    constructor(opt: RouterOption);
    insertRoute: (loc: string, component: Component) => void;
    lookupRoute: (url: URL) => RouteResult;
}
export default Router;
