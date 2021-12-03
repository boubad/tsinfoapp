<script lang="ts">
  import { Image } from "sveltestrap";
  //
  export let url: string;
  export let text: string = "";
  export let height: number = 48;
  //
</script>

{#if url && url.trim().length > 0}
  <Image src={url} alt={text} {height} />
{:else}
  <div />
{/if}
