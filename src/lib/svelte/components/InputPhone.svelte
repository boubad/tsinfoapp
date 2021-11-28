<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: string = "";
  export let label: string = "";
  export let name: string = "";
  export let busy: boolean = false;
  export let size:number = 31;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("phone_");
  //
  const onChanged = (e: Event) => {
    const sx = (e.target as HTMLInputElement).value;
    const val = sx.trim();
    onValueChanged(val, name);
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold ">{label}</Label>
  <Input
    class="font-weight-bold"
    type="tel"
    {size}
    readonly={busy}
    {name}
    {id}
    disabled={busy}
    on:change={onChanged}
    bind:value
  />
</FormGroup>
