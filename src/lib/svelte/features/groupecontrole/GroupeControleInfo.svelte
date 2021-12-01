<script lang="ts">
  //
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_GROUPECONTROLES_LIST } from "../../../../routes/routesdefs";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IGroupeControlesDoc } from "../../../data/IGroupeControlesDoc";
  import { CreateGroupeControles } from "../../../data/IGroupeControlesDoc";
  import { GroupeControlesServices } from "../../../data/GroupeControlesServices";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import {
    PROMPT_COEFFICIENT,
    PROMPT_DURATION,
    PROMPT_NAME,
    PROMPT_SIGLE,
  } from "../../InfoPrompt";
  import InputHasNotes from "../../components/InputHasNotes.svelte";
  import InputCoefficient from "../../components/InputCoefficient.svelte";
  import { onMount } from "svelte";
  //
  export let params: any = {};
  let groupecontroles: IGroupeControlesDoc = CreateGroupeControles();
  let prev: IGroupeControlesDoc = CreateGroupeControles();
  let isModified: boolean = false;
  let storeable: boolean = false;
  let controleTitle: string = "";
  //
  const _checkVars = () => {
    isModified = groupecontroles._modified === true;
    storeable =
      isModified &&
      groupecontroles.semestreid.trim().length > 0 &&
      groupecontroles.matiereid.trim().length > 0 &&
      groupecontroles.sigle.trim().length > 0 &&
      groupecontroles.name.trim().length > 0;
    controleTitle = groupecontroles.name;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...groupecontroles, _modified: true };
    pp[name] = val;
    groupecontroles = { ...pp };
    _checkVars();
  };
  const performCancel = (): void => {
    groupecontroles = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new GroupeControlesServices();
    const r = await pMan.saveItemAsync(groupecontroles);
    if (r.ok && r.item) {
      groupecontroles = { ...r.item };
    }
  };
  const performRemove = async (): Promise<void> => {
    const pMan = new GroupeControlesServices();
    const r = await pMan.removeItemAsync(groupecontroles);
    if (r.ok) {
      InfoRouter(ROUTE_GROUPECONTROLES_LIST);
    }
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    if (id && id.trim().length > 0) {
      const pMan = new GroupeControlesServices();
      const p = await pMan.findItemByIdAsync(id);
      if (p) {
        groupecontroles = { ...p };
      }
    } // ig
    prev = { ...groupecontroles };
    _checkVars();
  }; // performRefresh
  //
  onMount(async () => {
    performRefresh(params.id);
  });
  //
</script>
<div>
  <Row>
    <h2 class="text-center">{controleTitle}</h2>
  </Row>
  <Row>
    <Col>
      <Form>
        <Row>
          <Col xs="3">
            <InputText
              value={groupecontroles.sigle}
              label={PROMPT_SIGLE}
              name={DomainConstants.FIELD_SIGLE}
              {onValueChanged}
            />
          </Col>
          <Col xs="3">
            <InputText
              value={groupecontroles.name}
              label={PROMPT_NAME}
              name={DomainConstants.FIELD_NAME}
              {onValueChanged}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="2">
            <InputText
              value={groupecontroles.duration}
              label={PROMPT_DURATION}
              name={DomainConstants.FIELD_DURATION}
              {onValueChanged}
            />
          </Col>
          <Col xs="2">
            <InputCoefficient
              value={groupecontroles.coefficient}
              label={PROMPT_COEFFICIENT}
              name={DomainConstants.FIELD_COEFFICIENT}
              {onValueChanged}
            />
          </Col>
          <Col xs="2">
            <InputHasNotes value={groupecontroles.hasnotes} {onValueChanged} />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <InputObservations
              value={groupecontroles.observations}
              {onValueChanged}
            />
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
  <Row>
    <Col class="text-center">
      <EditCommands
        cancancel={isModified}
        canremove={groupecontroles._rev.length > 0}
        cansave={storeable}
        onCancel={performCancel}
        onRemove={performRemove}
        onSave={performSave}
      />
    </Col>
  </Row>
</div>
