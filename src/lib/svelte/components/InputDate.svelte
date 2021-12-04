<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: string = new Date().toISOString().slice(0, 10);
  export let label: string = "";
  export let name: string = "";
  export let min: string = "1980-01-01";
  export let max: string = "2030-12-31";
  export let size: number = 23;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("date_");
  //
  const onChanged = (e: Event) => {
    const sx = (e.target as HTMLInputElement).value;
    const val = sx.trim();
    onValueChanged(val, name);
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold "><strong>{label}</strong></Label>
  <Input
    class="font-weight-bold"
    type="date"
    {size}
    {name}
    {id}
    {min}
    {max}
    on:change={onChanged}
    bind:value
  />
</FormGroup>
