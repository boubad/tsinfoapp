<script lang="ts">
  import InputText from "./InputText.svelte";

  export let value: number | null;
  export let label: string;
  export let name: string;
  export let size: number = 6;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = value ? "" + value : "";
  //
  const valueChanged = (val: any, name: string) => {
    let done = false;
    const sx = val ? ("" + val).trim() : "";
    if (sx.length > 0) {
      const v = parseFloat(sx);
      if (v !== null && !isNaN(v)) {
        onValueChanged(v, name);
        done = true;
      }
    }
    if (!done) {
      onValueChanged(null, name);
    }
  };
</script>

<InputText {label} {size} value={sval} onValueChanged={valueChanged} {name} />
