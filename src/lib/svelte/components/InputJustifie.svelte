<script lang="ts">
  import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";

  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import {
    OPTION_JUSTIFIE_INCONNU,
    OPTION_JUSTIFIE_NO,
    OPTION_JUSTIFIE_YES,
    PROMPT_JUSTIFIE,
  } from "../InfoPrompt";
  //
  import InputBoolean from "./InputBoolean.svelte";
  //
  export let value: boolean;
  export let label: string = PROMPT_JUSTIFIE;
  export let name: string = DomainConstants.FIELD_JUSTIFIE;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { value: "", name: OPTION_JUSTIFIE_INCONNU },
    { value: VALUE_YES, name: OPTION_JUSTIFIE_YES },
    { value: VALUE_NO, name: OPTION_JUSTIFIE_NO },
  ];
  //
</script>

<InputBoolean {items} {label} {name} {onValueChanged} {value} />
