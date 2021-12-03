<script lang="ts">
  import { DomainConstants } from "../../data/DomainConstants";
  import { PROMPT_COEFFICIENT } from "../InfoPrompt";

  import InputNumber from "./InputNumber.svelte";

  export let value: number | null = 1.0;
  export let label: string = PROMPT_COEFFICIENT;
  export let name: string = DomainConstants.FIELD_COEFFICIENT;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const valueChanged = (val: unknown, name: string) => {
    let done = false;
    if (val) {
      const sx = "" + val;
      const v = parseFloat(sx);
      if (v > 0.0) {
        onValueChanged(v, name);
        done = true;
      }
    }
    if (!done) {
      onValueChanged(null, name);
    }
  };
</script>

<InputNumber {label} {value} onValueChanged={valueChanged} {name} />
