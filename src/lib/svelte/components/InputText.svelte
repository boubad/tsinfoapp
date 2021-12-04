<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: string = "";
  export let label: string = "";
  export let name: string = "";
  export let size: number = 63;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _value,
    _name
  ) => {};
  //
  const id = IdUtils.CreateID("txt_");
  //
  const onChanged = (e: Event) => {
    const sx = (e.target as HTMLInputElement).value;
    const val = sx.trim();
    onValueChanged(val, name);
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold"
    ><span class="font-weight-bold"><strong>{label}</strong></span></Label
  >
  <Input
    class="font-weight-bold"
    type="text"
    {size}
    {name}
    {id}
    on:change={onChanged}
    bind:value
  />
</FormGroup>
