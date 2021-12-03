<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import type { IDataOption } from "../../data/IDataOption";
  import { IdUtils } from "../IdUtils";
  //
  export let value: string = "";
  export let label: string = "";
  export let name: string = "";
  export let items: IDataOption[] = [];
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: unknown,
    _name: string
  ): void => {};
  //
  const id = IdUtils.CreateID("ch_");
  //
  const onChanged = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    onValueChanged(val, name);
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold">{label}</Label>
  <Input
    class="font-weight-bold"
    type="select"
    size={1}
    {name}
    {id}
    on:change={onChanged}
    bind:value
  >
    {#each items as item}
      <option value={item.value}>{item.name}</option>
    {/each}
  </Input>
</FormGroup>
