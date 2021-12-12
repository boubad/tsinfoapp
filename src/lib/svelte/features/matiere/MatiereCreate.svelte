<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
import { CouchDBClient } from "../../../data/CouchDBClient";
  import { DomainConstants } from "../../../data/DomainConstants";
import { fetchClient } from "../../../data/fetchClient";
  import { CreateMatiere, IMatiereDoc } from "../../../data/IMatiereDoc";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import { MatiereServices } from "../../../data/MatiereServices";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputCoefficient from "../../components/InputCoefficient.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import {
    PROMPT_COEFFICIENT,
    PROMPT_ECS,
    PROMPT_MODULE_NAME,
    PROMPT_NAME,
    PROMPT_SIGLE,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let matiere: IMatiereDoc = CreateMatiere();
  let prev: IMatiereDoc = CreateMatiere();
  let isModified: boolean = false;
  let storeable: boolean = false;
  let uniteid: string = "";
  //
  const _checkVars = (): void => {
    isModified = matiere._modified === true;
    storeable =
      isModified &&
      matiere.sigle.length > 0 &&
      matiere.name.length > 0 &&
      matiere.uniteid.length > 0;
  };
  //
  const onValueChanged = (val: any, name: string): void => {
    const pp = { ...matiere, _modified: true };
    pp[name] = val;
    matiere = { ...pp };
    _checkVars();
  };
  const performCancel = (): void => {
    matiere = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new MatiereServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.saveItemAsync(matiere);
    if (r.ok && r.item) {
      matiere = { ...r.item };
      _checkVars();
    } // r
  };
  //
  const performRefresh = async (unite?: string): Promise<void> => {
    if (unite && unite.length > 0) {
      uniteid = unite;
    }
    matiere = CreateMatiere();
    matiere.uniteid = uniteid;
    prev = { ...matiere };
    _checkVars();
  }; // performRefresh
  //
  onMount(async () => {
    await performRefresh(params.unite);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{matiere.sigle + " " + matiere.name}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col xs="3">
          <InputText
            value={matiere.sigle}
            label={PROMPT_SIGLE}
            name={DomainConstants.FIELD_SIGLE}
            {onValueChanged}
          />
        </Col>
        <Col xs="3">
          <InputText
            value={matiere.name}
            label={PROMPT_NAME}
            name={DomainConstants.FIELD_NAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="2">
          <InputCoefficient
            value={matiere.coefficient}
            label={PROMPT_COEFFICIENT}
            name={DomainConstants.FIELD_COEFFICIENT}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <InputCoefficient
            value={matiere.ecs}
            label={PROMPT_ECS}
            name={DomainConstants.FIELD_ECS}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <InputText
            value={matiere.module_name}
            label={PROMPT_MODULE_NAME}
            name={DomainConstants.FIELD_MODNAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
          <InputObservations value={matiere.observations} {onValueChanged} />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <Col class="text-center">
      <EditCommands
        cancancel={isModified}
        cansave={storeable}
        onCancel={performCancel}
        onSave={performSave}
      />
    </Col>
  </Row>
</div>
