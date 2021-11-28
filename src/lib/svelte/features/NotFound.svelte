<script lang="ts">
  import { location } from "svelte-spa-router";
  import { Row } from "sveltestrap";
</script>

<div>
  <Row>
    <div class="text-center">
      <h1>Not Found</h1>
      <p>This route doesn't exist.</p>
      <p>{$location}</p>
    </div>
  </Row>
</div>
