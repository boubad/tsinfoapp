<script lang="ts">
  import { DomainConstants } from "../../data/DomainConstants";
  import { PROMPT_NOTE } from "../InfoPrompt";

  import InputNumber from "./InputNumber.svelte";

  export let value: number | null;
  export let label: string = PROMPT_NOTE;
  export let name: string = DomainConstants.FIELD_VALUE;
  export let busy: boolean = false;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const valueChanged = (val: any, name: string) => {
    let done = false;
    if (val !== undefined && val !== null) {
      const sx = "" + val;
      const v = parseFloat(sx);
      if (v >= 0.0 && v <= 20.0) {
        onValueChanged(v, name);
        done = true;
      }
    }
    if (!done) {
      onValueChanged(null, name);
    }
  };
</script>

<InputNumber {busy} {label} {value} onValueChanged={valueChanged} {name} />
