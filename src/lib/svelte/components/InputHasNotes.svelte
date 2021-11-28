<script lang="ts">
  //
  import InputBoolean from "./InputBoolean.svelte";
  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";
  import {
    OPTION_HASNOTES_INCONNU,
    OPTION_HASNOTES_NO,
    OPTION_HASNOTES_YES,
    PROMPT_HASNOTES,
  } from "../InfoPrompt";
  //
  export let value: boolean = false;
  export let label: string = PROMPT_HASNOTES;
  export let name: string = DomainConstants.FIELD_HASNOTES;
  export let busy: boolean = false;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { value: "", name: OPTION_HASNOTES_INCONNU },
    { value: VALUE_YES, name: OPTION_HASNOTES_YES },
    { value: VALUE_NO, name: OPTION_HASNOTES_NO },
  ];
  //
</script>

<InputBoolean {busy} {items} {label} {name} {onValueChanged} {value} />
