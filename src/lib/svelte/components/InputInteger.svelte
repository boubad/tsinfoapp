<script lang="ts">
  import { Input } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  export let value: number;
  export let name: string;
  export let size: number = 6;
  export let min: number = 1;
  export let max: number = 99;
  export let onValueChanged: (val: number, name: string) => void = (
    _val: number,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("ipn_");
  //
  const _onChanged = (e: Event) => {
    const sx = "" + (e.target as HTMLInputElement).value;
    const val = sx.trim();
    if (val.length > 0) {
      const v = parseInt(val);
      if (v !== null && !isNaN(v)) {
        onValueChanged(v, name);
      }
    } // val
  };
  //
</script>

<Input
  class="font-weight-bold"
  type="number"
  {min}
  {max}
  {value}
  {size}
  {name}
  {id}
  on:change={_onChanged}
/>
