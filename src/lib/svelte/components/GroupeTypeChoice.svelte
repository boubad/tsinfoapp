<script lang="ts">
  import {
    GroupeType,
    GroupeType2String,
    GetGroupeTypeOptions,
    String2GroupeType,
  } from "../../data/GroupeType";
  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import ItemChoice from "./ItemChoice.svelte";
  import { PROMPT_GROUPETYPE } from "../InfoPrompt";

  //
  export let value: GroupeType = GroupeType.Unknown;
  export let label: string = PROMPT_GROUPETYPE;
  export let name: string = DomainConstants.FIELD_GROUPETYPE;
  export let busy: boolean = false;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = GroupeType2String(value);
  //
  const items: IDataOption[] = GetGroupeTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    const sx = val ? ("" + val).trim() : "";
    const v = String2GroupeType(sx);
    onValueChanged(v, name);
  };
  //
</script>

<ItemChoice
  {busy}
  {items}
  {label}
  {name}
  onValueChanged={valueChanged}
  value={sval}
/>
