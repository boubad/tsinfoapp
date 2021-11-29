<script lang="ts">
  import { Col, Row } from "sveltestrap";

  //
  import InputCheck from "./InputCheck.svelte";
  import PhotoComponent from "./PhotoComponent.svelte";
  //
  export let label: string = "";
  export let name: string = "";
  export let url: string = "";
  export let subTitle: string = "";
  export let selected: boolean = false;
  export let onSelectionChanged: (val: unknown, name: string) => void = (
    _val: unknown,
    _name: string
  ): void => {};
  //
</script>

<Row>
  <Col>
    <InputCheck
      {label}
      {name}
      value={selected}
      onValueChanged={onSelectionChanged}
    />
  </Col>
  <Col>
    <PhotoComponent {url} text={label} />
  </Col>
  <Col>
    {subTitle}
  </Col>
</Row>
