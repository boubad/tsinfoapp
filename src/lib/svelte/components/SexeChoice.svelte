<script lang="ts">
  import { VALUE_FEMININ, VALUE_MASCULIN } from "../../data/DataConstants";

  import { DomainConstants } from "../../data/DomainConstants";
  import type { IDataOption } from "../../data/IDataOption";
  import {
    OPTION_SEXE_FEMININ,
    OPTION_SEXE_INCONNU,
    OPTION_SEXE_MASCULIN,
    PROMPT_SEXE,
  } from "../InfoPrompt";
  //
  import ItemChoice from "./ItemChoice.svelte";
  //
  export let value: string = "";
  export let label: string = PROMPT_SEXE;
  export let name: string = DomainConstants.FIELD_SEXE;
  export let busy: boolean = false;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { value: "", name: OPTION_SEXE_INCONNU },
    { value: VALUE_MASCULIN, name: OPTION_SEXE_MASCULIN },
    { value: VALUE_FEMININ, name: OPTION_SEXE_FEMININ },
  ];
</script>

<ItemChoice {busy} {items} {label} {name} {onValueChanged} {value} />
