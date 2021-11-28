<script lang="ts">
  //
  import { Button, Col, Row } from "sveltestrap";
  import { COMMAND_CREATE, COMMAND_REFRESH } from "../InfoPrompt";
  //
  export let busy: boolean = false;
  export let canrefresh: boolean = false;
  export let cancreate: boolean = true;
  export let newbuttontext = COMMAND_CREATE;
  export let onRefresh: () => void = () => {};
  export let onCreate: () => void = () => {};
  //
</script>

{#if !busy}
  <div>
    <Row class="text-center">
      {#if canrefresh}
        <Col class="text-center">
          <Button
            color="primary"
            on:click={() => {
              onRefresh();
            }}
          >
            {COMMAND_REFRESH}
          </Button>
        </Col>
      {/if}
      {#if cancreate}
        <Col class="text-center">
          <Button
            color="secondary"
            on:click={() => {
              onCreate();
            }}
          >
            {newbuttontext}
          </Button>
        </Col>
      {/if}
    </Row>
  </div>
{/if}
