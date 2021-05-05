import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import bundleSize from "rollup-plugin-bundle-size";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

const rollupPlugins = [
  svelte({
    preprocess: sveltePreprocess({ sourceMap: !production }),
    compilerOptions: {
      // enable run-time checks when not in production
      dev: !production,
    },
  }),
  // we'll extract any component CSS out into
  // a separate file - better for performance
  css({ output: "bundle.css" }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs
  resolve({
    browser: true,
    dedupe: ["svelte"],
  }),
  commonjs(),
  typescript({
    sourceMap: !production,
    inlineSources: !production,
  }),
];

export default [
  {
    input: "src/index.js",
    output: [
      {
        format: "esm",
        file: "lib/esm/index.js",
      },
      {
        format: "cjs",
        file: "lib/cjs/index.js",
      },
      {
        format: "iife",
        name: "svelteHistoryRouter",
        file: "lib/index.js",
      },
      {
        format: "iife",
        name: "svelteHistoryRouter",
        file: "lib/index.min.js",
        plugins: [terser()],
      },
    ],
    plugins: [...rollupPlugins, bundleSize()],
  },
  {
    input: "src/index.js",
    output: {
      format: "iife",
      name: "svelteHistoryRouter",
      file: "lib/legacy/index.min.js",
    },
    plugins: [
      ...rollupPlugins,
      babel({
        extensions: [".js", ".mjs", ".ts", ".html", ".svelte"],
        babelHelpers: "runtime",
        exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                ie: "11",
              },
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        ],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          [
            "@babel/plugin-transform-runtime",
            {
              useESModules: true,
            },
          ],
        ],
      }),
      terser(),
    ],
  },
];
