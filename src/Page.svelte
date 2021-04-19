<script>
  import { push } from "./Router.svelte";

  export let title = "";
</script>

HELLO WORLD!

<p>{title}</p>
<a href="#" on:click|preventDefault={() => push("/")}>Home Page</a>
<a href="#" on:click|preventDefault={() => push("/test")}>Next Page</a>

<!-- markup (zero or more items) goes here -->
<style>
  p {
    font-size: 20px;
    font-weight: bold;
  }
</style>
