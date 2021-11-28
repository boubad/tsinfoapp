<script lang="ts">
  import Router from "svelte-spa-router";
  import InfoNav from "./InfoNav.svelte";
  import Global from "./lib/svelte/features/global/Global.svelte";
  import { routes } from "./routes/routes";
</script>

<div>
  <InfoNav />
  <Global />
  <!-- Show the router -->
  <Router {routes} />
</div>
