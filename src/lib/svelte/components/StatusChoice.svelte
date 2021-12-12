<script lang="ts">
  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import ItemChoice from "./ItemChoice.svelte";
  import { PROMPT_STATUS } from "../InfoPrompt";
  import {
    GetStatusTypeOptions,
    StatusType,
    StatusType2String,
    String2StatusType,
  } from "../../data/StatusType";

  //
  export let value: StatusType = StatusType.Unknown;
  export let label: string = PROMPT_STATUS;
  export let name: string = DomainConstants.FIELD_STATUS;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = StatusType2String(value);
  //
  const items: IDataOption[] = GetStatusTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = val ? ("" + val).trim() : "";
      const v = String2StatusType(sx);
      onValueChanged(v, name);
    }
  };
  //
</script>

<ItemChoice {items} {label} {name} onValueChanged={valueChanged} value={sval} />
