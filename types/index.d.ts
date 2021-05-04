import Router from "./Router";
export { Router };
export declare const location: import("svelte/store").Readable<URL>;
export declare const params: import("svelte/store").Readable<
  Record<string, string>
>;
export declare const push: (url: string) => void;
export declare const pop: () => void;
export declare const replace: (url: string) => void;
