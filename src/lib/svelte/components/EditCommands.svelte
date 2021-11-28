<script lang="ts">
  //
  import { Button, Col, Row } from "sveltestrap";
  import {
    COMMAND_CANCEL,
    COMMAND_SAVE,
    DELETEITEM_BUTTON_TEXT,
    DELETEITEM_TEXT,
    DELETEITEM_TITLE,
  } from "../InfoPrompt";
  import DeleteItem from "./DeleteItem.svelte";
  //
  export let busy: boolean = false;
  export let canremove: boolean = false;
  export let cansave: boolean = false;
  export let cancancel: boolean = false;
  export let deleteButtonText: string = DELETEITEM_BUTTON_TEXT;
  export let deleteDialogTitle: string = DELETEITEM_TITLE;
  export let deleteDialogText: string = DELETEITEM_TEXT;
  export let onCancel: () => void = () => {};
  export let onSave: () => void = () => {};
  export let onRemove: () => void = () => {};
  //
</script>

{#if !busy}
  <div>
    <Row>
      {#if cancancel}
        <Col>
          <Button color="secondary" on:click={onCancel}>
            {COMMAND_CANCEL}
          </Button>
        </Col>
      {/if}
      {#if cansave}
        <Col>
          <Button color="success" on:click={onSave}>
            {COMMAND_SAVE}
          </Button>
        </Col>
      {/if}
      {#if canremove}
        <Col>
          <DeleteItem
            {busy}
            buttonText={deleteButtonText}
            onDeleteItem={onRemove}
            dialogTitle={deleteDialogTitle}
            dialogText={deleteDialogText}
          />
        </Col>
      {/if}
    </Row>
  </div>
{/if}
