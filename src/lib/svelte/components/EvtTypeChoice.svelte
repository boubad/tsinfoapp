<script lang="ts">
  import { DomainConstants } from "../../data/DomainConstants";

  import {
    EvtType,
    EvtType2String,
    GetEvtTypeOptions,
    String2EvtType,
  } from "../../data/EvtType";
  import type { IDataOption } from "../../data/IDataOption";
  import { PROMPT_EVTTYPE } from "../InfoPrompt";

  import ItemChoice from "./ItemChoice.svelte";

  //
  export let value: EvtType = EvtType.Inconnu;
  export let label: string = PROMPT_EVTTYPE;
  export let name: string = DomainConstants.FIELD_EVTTYPE;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = EvtType2String(value);
  //
  const items: IDataOption[] = GetEvtTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    const sx = val ? ("" + val).trim() : "";
    const v = String2EvtType(sx);
    onValueChanged(v, name);
  };
</script>

<ItemChoice {items} {label} {name} onValueChanged={valueChanged} value={sval} />
