<script lang="ts">
  import { Col, Row } from "sveltestrap";
  import PhotoComponent from "./PhotoComponent.svelte";
  //
  export let url: string;
  export let lastname: string;
  export let firstname: string;
  export let height: number = 136;
  //
  $: part1 = lastname ? lastname.toUpperCase() : "";
  $: part2 = firstname ? firstname : "";
  $: name = part1 + " " + part2;
  $: hasUrl = url ? url.trim().length > 0 : false;
  //
</script>

<div>
  <Row class="align-middle">
    {#if hasUrl}
      <Col class="text-center">
        <PhotoComponent {url} text={name} {height} />
      </Col>
    {/if}
    <Col>
      <h3 class=" text-center">{name}</h3>
    </Col>
  </Row>
</div>
