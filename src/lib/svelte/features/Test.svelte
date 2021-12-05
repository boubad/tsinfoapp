<script lang="ts">
  import { Row } from "sveltestrap";
  import InputInteger from "../components/InputInteger.svelte";
  //
  let nombre = 10;
  //
  const onValueChanged = (val: number, _name: string): void => {
    nombre = val;
  }; // onValueChanged
  //
</script>

<div>
  <Row>
    <h1 class="text-center">Test page</h1>
  </Row>
  <InputInteger size={6} name="ttt" value={nombre} {onValueChanged} />
  <h2 class="text-center">{nombre}</h2>
</div>
