<script>
  import { push } from "./Router.svelte";
</script>

HELLO WORLD!

<a href="#" on:click|preventDefault={() => push("/")}>Home Page</a>
<a href="#" on:click|preventDefault={() => push("/test")}>Next Page</a>

<!-- markup (zero or more items) goes here -->
<style>
  /* your styles go here */
</style>
