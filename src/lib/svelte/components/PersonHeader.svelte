<script lang="ts">
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
  //
</script>

<div class="align-middle">
  <PhotoComponent {url} text={name} {height} />
  <h3 class=" text-center">{name}</h3>
</div>
