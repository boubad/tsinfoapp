<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IDataOption } from "../../../data/IDataOption";
  import { CreateGroupe, IGroupeDoc } from "../../../data/IGroupeDoc";
  import { GroupeServices } from "../../../data/GroupeServices";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import ItemChoice from "../../components/ItemChoice.svelte";
  import {
    PROMPT_NAME,
    PROMPT_PARENT_GROUPE,
    PROMPT_SIGLE,
  } from "../../InfoPrompt";
  import GroupeTypeChoice from "./../../components/GroupeTypeChoice.svelte";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_GROUPES_LIST } from "../../../../routes/routesdefs";
  //
  export let params: any = {};
  let groupe: IGroupeDoc = CreateGroupe();
  let prev: IGroupeDoc = CreateGroupe();
  let parents: IDataOption[] = [];
  let isModified: boolean = false;
  let storeable: boolean = false;
  let semestreid: string = "";
  //
  const _checkVars = (): void => {
    isModified = groupe._modified === true;
    storeable =
      isModified &&
      groupe.sigle.length > 0 &&
      groupe.name.length > 0 &&
      groupe.semestreid.length > 0;
    //
  };
  //
  const performRefresh = async (semestre?: string): Promise<void> => {
    groupe = CreateGroupe();
    if (semestre && semestre.length > 0) {
      semestreid = semestre;
      groupe.semestreid = semestre;
    }
    prev = { ...groupe };
    await findParents();
    _checkVars();
  }; // performRefresh
  //
  const findParents = async (): Promise<void> => {
    const pMan = new GroupeServices();
    const aa = await pMan.findParentOptionsAsync(groupe, semestreid);
    parents = [...aa];
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...groupe, _modified: true };
    pp[name] = val;
    groupe = { ...pp };
    _checkVars();
  };
  const onGroupeTypeChanged = async (
    val: any,
    _name: string
  ): Promise<void> => {
    const pp = { ...groupe, _modified: true };
    pp.groupetype = val;
    pp._modified = true;
    groupe = pp;
    await findParents();
  };
  const performCancel = (): void => {
    groupe = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new GroupeServices();
    const r = await pMan.saveItemAsync(groupe);
    if (r.ok && r.item) {
      InfoRouter(ROUTE_GROUPES_LIST + "/" + semestreid);
    } // r
  };
  //
  onMount(async () => {
    await performRefresh(params.semestre);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{groupe.sigle + " " + groupe.name}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col xs="3">
          <GroupeTypeChoice
            value={groupe.groupetype}
            onValueChanged={onGroupeTypeChanged}
          />
        </Col>
        <Col xs="3">
          <ItemChoice
            items={parents}
            label={PROMPT_PARENT_GROUPE}
            name={DomainConstants.FIELD_PARENTID}
            {onValueChanged}
            value={groupe.parentid}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="3">
          <InputText
            value={groupe.sigle}
            label={PROMPT_SIGLE}
            name={DomainConstants.FIELD_SIGLE}
            {onValueChanged}
          />
        </Col>
        <Col xs="3">
          <InputText
            value={groupe.name}
            label={PROMPT_NAME}
            name={DomainConstants.FIELD_NAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
          <InputObservations value={groupe.observations} {onValueChanged} />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <Col class="text">
      <EditCommands
        cancancel={isModified}
        cansave={storeable}
        onCancel={performCancel}
        onSave={performSave}
      />
    </Col>
  </Row>
</div>
