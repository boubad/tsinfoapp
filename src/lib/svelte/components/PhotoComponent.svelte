<script lang="ts">
  import { Image } from "sveltestrap";
  //
  export let url: string;
  export let text: string = "";
  export let height: number = 48;
  //
  $: hasUrl = url && url.trim().length > 0;
</script>

{#if hasUrl}
  <Image src={url} alt={text} {height} />
{/if}
