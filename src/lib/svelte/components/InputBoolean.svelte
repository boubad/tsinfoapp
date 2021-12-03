<script lang="ts">
  import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";

  import type { IDataOption } from "../../data/IDataOption";

  //
  import ItemChoice from "./ItemChoice.svelte";
  //
  export let value: boolean;
  export let label: string;
  export let name: string;
  export let items: IDataOption[];
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval =
    value !== undefined && value != null && value === true
      ? VALUE_YES
      : VALUE_NO;

  //
  const valueChanged = (val: any, name: string) => {
    const sx = val ? ("" + val).trim().toUpperCase() : "";
    const v = sx === VALUE_YES ? true : false;
    onValueChanged(v, name);
  };
  //
</script>

<ItemChoice {items} {label} {name} onValueChanged={valueChanged} value={sval} />
