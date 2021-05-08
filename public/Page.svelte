<script>
  import { push } from "../src";

  export let title = "";
  export let params = {};

  const gotoPage = () => {
    title = "Redirecting to batman page...";
    setTimeout(() => {
      push("/me/batman/info");
    }, 100);
  };
</script>

<p class="content" style="border: 1px solid red; padding: 1rem;">{title}</p>
<p style="border: 1px solid red; padding: 1rem;">{JSON.stringify(params)}</p>
<p><a href="#" on:click|preventDefault={() => push("/")}>Home Page</a></p>
<p><a href="#" on:click|preventDefault={() => push("/query")}>Query Page</a></p>
<p><a href="#" on:click|preventDefault={() => push("/test")}>Test Page</a></p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/profile")}
    >My Profile Page</a
  >
</p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/joker/status")}
    >My Status Page</a
  >
</p>
<p>
  <a href="#" on:click|preventDefault={() => push("/me/profile?name=me&age=12")}
    >My Profile with Query Page</a
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
  <a href="#" on:click|preventDefault={gotoPage}>Batman Info Page</a>
</p>
<p>
  <a
    href="#"
    on:click|preventDefault={() => push("/me/batman-and-joker/collaborate")}
    >Batman and Joker Page</a
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
