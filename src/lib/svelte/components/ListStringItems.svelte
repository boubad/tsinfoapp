<script lang="ts">
  export let items:string [] = [];
</script>

{#if items.length > 0}
  <ul>
    {#each items as item}
      <li>
        <strong>{item}</strong>
      </li>
    {/each}
  </ul>
{:else}
  <div />
{/if}
