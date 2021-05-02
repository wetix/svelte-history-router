<script>
  import { push } from "../src/Router.svelte";

  export let title = "";
</script>

<p style="border: 1px solid red; padding: 1rem;">{title}</p>
<p><a href="#" on:click|preventDefault={() => push("/")}>Home Page</a></p>
<p><a href="#" on:click|preventDefault={() => push("/query")}>Query Page</a></p>
<p><a href="#" on:click|preventDefault={() => push("/test")}>Test Page</a></p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/profile")}
    >My Profile Page</a
  >
</p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/any")}>Me Any Page</a>
</p>
<p>
  <a
    href="#"
    on:click|preventDefault={() => push("/me/joker/profile?funny=true")}
    >Joker Page</a
  >
</p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/batman/info")}
    >Batman Info Page</a
  >
</p>
<p><a href="#/ok">Hash Link</a></p>

<!-- markup (zero or more items) goes here -->
<style>
  p {
    font-size: 20px;
    font-weight: bold;
  }
</style>
