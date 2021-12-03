<script lang="ts">
  import {
    ControleType,
    ControleType2String,
    GetControleTypeOptions,
    String2ControleType,
  } from "../../data/ControleType";
  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import { PROMPT_CONTROLETYPE } from "../InfoPrompt";
  import ItemChoice from "./ItemChoice.svelte";

  //
  export let value: ControleType = ControleType.Unknown;
  export let label: string = PROMPT_CONTROLETYPE;
  export let name: string = DomainConstants.FIELD_CONTROLETYPE;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = ControleType2String(value);
  //
  const items: IDataOption[] = GetControleTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = val ? ("" + val).trim() : "";
      const v = String2ControleType(sx);
      onValueChanged(v, name);
    }
  };
  //
</script>

<ItemChoice {items} {label} {name} onValueChanged={valueChanged} value={sval} />
