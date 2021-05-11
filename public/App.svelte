<script lang="ts">
  import { wrapComponent } from "@wetix/utils";
  import { Router, link, params, url } from "../src";
  import Page from "./Page.svelte";
  import AboutUsPage from "./pages/AboutUs.svelte";
  import BatmanPage from "./pages/Batman.svelte";
  import QueryPage from "./pages/QueryString.svelte";

  export let name: string;

  const routes = {
    "/": wrapComponent(Page, { title: "Home Page" }),

    "/test/*": wrapComponent(Page, { title: "Test Page Any" }),
    "/test": wrapComponent(Page, { title: "Test Page" }),
    "/test/:param1/:param2": wrapComponent(Page, {
      title: "Test Page With Params",
    }),

    "/me/*": wrapComponent(Page, { title: "My Any Profile Page" }),
    "/me/profile": wrapComponent(Page, { title: "My Profile Page" }),
    "/me/:id/profile": wrapComponent(Page, {
      title: "My Profile Page With Params",
    }),
    "/me/:id/info": BatmanPage,
    "/me/:name/status": wrapComponent(Page, { title: "Status page" }),

    "/query": QueryPage,
    "/nested": wrapComponent(Page, { title: "NESTED page" }),
    "/about-us": AboutUsPage,
    // "/*": wrapComponent(Page, { title: "Not Found" }),
  };

  const onRouteChange = (e: CustomEvent) => {
    console.log(e.detail);
  };

  $: console.log("debug =>", $url.searchParams.toString());

  const onLoaded = (e: CustomEvent) => {
    console.log(e.detail);
  };

  params.subscribe((v) => {
    console.log("Params =>", v);
  });

  let value = "";
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
  <input bind:value />
  <a href={value} use:link>
    <p>Route to {value}</p>
  </a>

  <section use:link>
    <div style="padding: 10px;">
      <a href={`${location.origin}/me/profile`}>
        <p>Route with local route</p>
      </a>
    </div>
    <a href="https://google.com">
      <p>Google</p>
    </a>
    <div style="cursor: pointer;">No effect click</div>
  </section>
  <Router {routes} on:routeLoaded={onLoaded}>testing</Router>
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
