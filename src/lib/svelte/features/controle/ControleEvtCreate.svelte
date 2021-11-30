<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { ControleServices } from "../../../data/ControleServices ";
  import { DateUtils } from "../../../data/DateUtils";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { EvtServices } from "../../../data/EvtServices";
  import { EvtType } from "../../../data/EvtType";
  import type { IDataOption } from "../../../data/IDataOption";
  import type { IEvtDoc } from "../../../data/IEvtDoc";
  import { CreateEvt } from "../../../data/IEvtDoc";
  import EditCommands from "../../components/EditCommands.svelte";
  import EvtTypeChoice from "../../components/EvtTypeChoice.svelte";
  import InputJustife from "../../components/InputJustifie.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import ItemChoice from "../../components/ItemChoice.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import {
    COMMAND_NEW_EVT,
    PROMPT_DURATION,
    PROMPT_ETUDIANT,
    TEXT_REMOVE_EVT,
    TITLE_REMOVE_EVT,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let evt: IEvtDoc = CreateEvt();
  let prev: IEvtDoc = CreateEvt();
  let etudiants: IDataOption[] = [];
  let evtTitle: string = "";
  let isEvtModified: boolean = false;
  let storeable: boolean = false;
  let controleid: string = "";
  //
  const _checkVars = () => {
    isEvtModified = evt._modified === true;
    storeable =
      evt.evttype != EvtType.Inconnu &&
      evt.etudiantid.trim().length > 0 &&
      evt.controleid.trim().length > 0 &&
      isEvtModified;
    if (evt._rev.length < 1 || evt._id.length < 1) {
      evtTitle =
        DateUtils.toDisplay(evt._date) +
        " - " +
        (evt._controleName ? evt._controleName : "") +
        " " +
        COMMAND_NEW_EVT;
    } else {
      evtTitle =
        DateUtils.toDisplay(evt._date) +
        " - " +
        (evt._controleName ? evt._controleName : "") +
        " " +
        evt._fullname
          ? evt._fullname
          : "";
    }
  }; // _checkVars
  //
  const performRefresh = async (cont?: string): Promise<void> => {
    etudiants = [];
    controleid = "";
    if (cont && cont.trim().length > 0) {
      controleid = cont;
    }
    if (controleid.length > 0) {
      const pContServices = new ControleServices();
      const xx = await pContServices.getControleEtudiantsOptionsAsync(
        controleid
      );
      etudiants = [...xx];
      evt = CreateEvt();
      evt.controleid = controleid;
    } // controleid
    prev = { ...evt };
    _checkVars();
    //
  }; // performRefresh
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const p = { ...evt, _modified: true };
    p[name] = val;
    evt = { ...p };
    _checkVars();
  };
  //
  const performCancel = (): void => {
    evt = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new EvtServices();
    const r = await pMan.saveItemAsync(evt);
    if (r.ok && r.item) {
      evt = { ...r.item };
      prev = { ...evt };
      _checkVars();
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
</script>

<div>
  <Row>
    <h2>{evtTitle}</h2>
  </Row>
  <Row>
    <PersonHeader
      url={evt._url}
      firstname={evt._firstname}
      lastname={evt._lastname}
    />
  </Row>
  <Row>
    <Form>
      <Row>
        <Col xs="3">
          <ItemChoice
            value={evt._id}
            label={PROMPT_ETUDIANT}
            name={DomainConstants.FIELD_ETUDIANTID}
            items={etudiants}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="2">
          <EvtTypeChoice value={evt.evttype} {onValueChanged} />
        </Col>
        <Col xs="2">
          <InputText
            value={evt.duration}
            label={PROMPT_DURATION}
            name={DomainConstants.FIELD_DURATION}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <InputJustife value={evt.justifie} {onValueChanged} />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
          <InputObservations value={evt.observations} {onValueChanged} />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      deleteDialogTitle={TITLE_REMOVE_EVT}
      deleteDialogText={TEXT_REMOVE_EVT}
      cancancel={isEvtModified}
      canremove={false}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={() => {}}
      onSave={performSave}
    />
  </Row>
</div>
