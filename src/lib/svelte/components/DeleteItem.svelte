<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import {
    COMMAND_CANCEL,
    DELETEITEM_BUTTON_DELETE,
    DELETEITEM_BUTTON_TEXT,
    DELETEITEM_TEXT,
    DELETEITEM_TITLE,
  } from "../InfoPrompt";
  //
  export let busy: boolean = false;
  export let buttonText: string = DELETEITEM_BUTTON_TEXT;
  export let dialogTitle: string = DELETEITEM_TITLE;
  export let dialogText: string = DELETEITEM_TEXT;
  export let onDeleteItem: (_e?: any) => void = (_e?: any) => {};
  //
  let open = false;
  const toggle = () => (open = !open);
  //
  const performDelete = (_e: any) => {
    open = !open;
    onDeleteItem();
  };
  //
</script>

{#if !busy}
  <div>
    <Button color="danger" on:click={toggle}>{buttonText}</Button>
    <Modal isOpen={open} {toggle}>
      <ModalHeader class="" {toggle}>{dialogTitle}</ModalHeader>
      <ModalBody class="">{dialogText}</ModalBody>
      <ModalFooter>
        <Button color="secondary" on:click={toggle}>{COMMAND_CANCEL}</Button>
        <Button color="danger" on:click={performDelete}>
          {DELETEITEM_BUTTON_DELETE}
        </Button>
      </ModalFooter>
    </Modal>
  </div>
{/if}
