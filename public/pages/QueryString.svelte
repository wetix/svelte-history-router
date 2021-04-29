<script lang="ts">
  import { currentRoute, push, replace } from "../../src";

  console.log($currentRoute);
</script>

<div
  class="link"
  on:click={() => replace(`/query?mode=replace&ts=${new Date().toISOString()}`)}
>
  Push Query String
</div>
<div
  class="link"
  on:click={() => push(`/query?mode=push&ts=${new Date().toISOString()}`)}
>
  Replace Query String
</div>
<div>Query String : {JSON.stringify($currentRoute)}</div>

<style>
  .link {
    cursor: pointer;
    color: blue;
  }
</style>
