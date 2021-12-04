<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";
  import { PROMPT_FICHIER } from "../InfoPrompt";
  //
  export let parentid: string = "";
  export let onFileSelected: (
    name: string,
    mime: string,
    data: Blob,
    parentid?: string
  ) => void = (
    _name: string,
    _mime: string,
    _data: Blob,
    _parentid?: string
  ) => {};
  //
  interface IMyEvent extends EventTarget {
    target: { files: any; result: any };
  }
  const handleChange = (e: any) => {
    const event = e as IMyEvent;
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fr = new FileReader();
      fr.onloadend = (ex: any) => {
        onFileSelected(
          file.name,
          file.type,
          new Blob([new Uint8Array(ex.target.result)]),
          parentid
        );
      };
      fr.readAsArrayBuffer(file);
    } // files
  }; // handleChange
  //
  const id = IdUtils.CreateID("fl_");
  //
</script>

<FormGroup>
  <Label class="" for={id}><strong>{PROMPT_FICHIER}</strong></Label>
  <Input
    class={"font-weight-bold"}
    size={255}
    type={"file"}
    name={"file"}
    {id}
    on:change={handleChange}
  />
</FormGroup>
