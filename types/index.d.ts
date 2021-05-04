import type { Readable } from "svelte/store";
import Router from "./Router";
export { Router };
export declare const location: Readable<URL>;
export declare const params: Readable<Record<string, string>>;
export declare const push: (url: string) => void;
export declare const pop: () => void;
export declare const replace: (url: string) => void;
