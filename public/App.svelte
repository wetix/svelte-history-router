<script lang="ts">
  import { wrapComponent } from "@wetix/utils";
  import Router from "../src/Router.svelte";
  import Page from "./Page.svelte";

  export let name: string;

  const routes = {
    "/": wrapComponent(Page, { title: "Home" }),
    "/test": wrapComponent(Page, { title: "Test Page" }),
    "/me/profile": wrapComponent(Page, { title: "My Profile" }),
    "/me/:var1/:var2": Page,
    "/me/:name": Page,
    "/me/*": Page,
    "/about-us": Page,
  };
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
  <Router {routes}>testing</Router>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
