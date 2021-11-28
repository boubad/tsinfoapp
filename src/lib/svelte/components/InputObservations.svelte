<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { DomainConstants } from "../../data/DomainConstants";
  import { IdUtils } from "../IdUtils";
  import { PROMPT_OBSERVATIONS } from "../InfoPrompt";

  //
  export let value: string = "";
  export let label: string = PROMPT_OBSERVATIONS;
  export let name: string = DomainConstants.FIELD_OBSERVATIONS;
  export let busy: boolean = false;
  export let onValueChanged: (val: unknown, name: string) => void = (
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("obs_");
  //
  const onChanged = (e: Event) => {
    const sx = (e.target as HTMLInputElement).value;
    const val = sx.trim();
    onValueChanged(val, name);
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold ">{label}</Label>
  <Input
    class="font-weight-bold"
    type="textarea"
    size={512}
    readonly={busy}
    {name}
    {id}
    disabled={busy}
    on:change={onChanged}
    bind:value
  />
</FormGroup>
