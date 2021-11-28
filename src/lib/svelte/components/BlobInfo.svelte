<script lang="ts">
  //
  import { Col, Row, Table } from "sveltestrap";
  import DeleteItem from "./DeleteItem.svelte";
  import InputFile from "./InputFile.svelte";
  import type { IAttachedDoc } from "../../data/IAttachedDoc";
  import {
    COMMAND_REMOVE,
    PROMPT_ACTION,
    PROMPT_MIMETYPE,
    PROMPT_NAME,
    TEXT_BLOBS_DELETE,
    TITLE_BLOBS_DELETE,
  } from "../InfoPrompt";
  //
  export let busy: boolean = false;
  export let parentid: string = "";
  export let blobs: IAttachedDoc[] = [];
  export let onSave: (
    name: string,
    mime: string,
    data: Blob,
    parentid?: string
  ) => void = (
    _name: string,
    _mime: string,
    _data: Blob,
    _parentid?: string
  ): void => {};
  export let onRemove: (name: string, parentid?: string) => void = (
    _name: string,
    _parentid: string
  ): void => {};
  //
</script>

<div>
  <Row>
    <Col>
      <InputFile onFileSelected={onSave} {busy} {parentid} />
    </Col>
  </Row>
  {#if blobs && blobs.length > 0}
    <Row>
      <Col>
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>{PROMPT_NAME}</th>
              <th>{PROMPT_MIMETYPE}</th>
              <th>{PROMPT_ACTION}</th>
            </tr>
          </thead>
          <tbody>
            {#each blobs as bx}
              <tr>
                <th>
                  {#if bx.url && bx.url.length > 0}
                    <a
                      href={bx.url}
                      target={"_blank"}
                      rel={"noopener norefrerrer"}
                    >
                      {bx.name}
                    </a>
                  {:else}{bx.name}{/if}
                </th>
                <td>{bx.content_type}</td>
                <td>
                  <DeleteItem
                    {busy}
                    buttonText={COMMAND_REMOVE}
                    dialogTitle={TITLE_BLOBS_DELETE}
                    dialogText={TEXT_BLOBS_DELETE}
                    onDeleteItem={() => {
                      onRemove(bx.name, parentid);
                    }}
                  />
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </Col>
    </Row>
  {/if}
</div>
