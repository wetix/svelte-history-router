<script lang="ts">
  import { fly } from "svelte/transition";

  import { location, push, replace } from "../../src";

  location.subscribe(console.log);
</script>

<div class="box" in:fly>
  <div
    class="link"
    on:click={() =>
      replace(
        `/query?mode=replace&symbol=${encodeURIComponent(
          `!@#$%^&*()++_))__`
        )}&ts=${encodeURIComponent(new Date().toISOString())}`
      )}
  >
    Replace Query String
  </div>
  <div
    class="link"
    on:click={() => push(`/query?mode=push&ts=${new Date().toISOString()}`)}
  >
    Push Query String
  </div>
  <div class="link" on:click={() => replace("/")}>Home</div>
  <div>Query String : {JSON.stringify($location)}</div>
</div>

<style>
  .box {
    word-wrap: break-word;
  }
  .link {
    cursor: pointer;
    color: blue;
  }
</style>
