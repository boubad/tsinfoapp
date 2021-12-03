<script lang="ts">
  //
  import { Input } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: boolean = false;
  export let label: string = "";
  export let name: string = "";
  export let onValueChanged: (val: unknown, name: string) => void = (
    _value,
    _name
  ) => {};
  //
  const id = IdUtils.CreateID("ipch_");
  //
  const onChanged = (e: Event) => {
    const t = e.target as HTMLInputElement;
    const bval = t.checked;
    onValueChanged(bval, name);
  };
  //
</script>

<Input
  class="font-weight-bold"
  type="checkbox"
  checked={value}
  {label}
  {name}
  {id}
  on:change={onChanged}
/>
