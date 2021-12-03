<script lang="ts">
  //
  import { Button, Col, Row } from "sveltestrap";
  import { COMMAND_CREATE, COMMAND_REFRESH } from "../InfoPrompt";
  //
  export let canrefresh: boolean = false;
  export let cancreate: boolean = true;
  export let newbuttontext = COMMAND_CREATE;
  export let onRefresh: () => void = () => {};
  export let onCreate: () => void = () => {};
  //
</script>

<Row class="text-center">
  {#if canrefresh}
    <Col xs="1" class="text-center">
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
  <Col xs="1" />
  {#if cancreate}
    <Col xs="4" class="text-center">
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
