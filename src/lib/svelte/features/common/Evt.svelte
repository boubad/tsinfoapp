<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { DateUtils } from "../../../data/DateUtils";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { EvtServices } from "../../../data/EvtServices";
  import { EvtType } from "../../../data/EvtType";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import type { IEvtDoc } from "../../../data/IEvtDoc";
  import { CreateEvt } from "../../../data/IEvtDoc";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import EvtTypeChoice from "../../components/EvtTypeChoice.svelte";
  import InputJustife from "../../components/InputJustifie.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import {
    COMMAND_NEW_EVT,
    PROMPT_DURATION,
    TEXT_REMOVE_EVT,
    TITLE_REMOVE_EVT,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let evt: IEvtDoc = CreateEvt();
  let prev: IEvtDoc = CreateEvt();
  let blobs: IAttachedDoc[] = [];
  let evtTitle: string = "";
  let isEvtModified: boolean = false;
  let storeable: boolean = false;
  //
  const _checkVars = () => {
    isEvtModified = evt._modified === true;
    storeable =
      evt.evttype != EvtType.Inconnu &&
      evt.etudiantid.trim().length > 0 &&
      evt.controleid.trim().length > 0 &&
      isEvtModified;
    evtTitle =
      DateUtils.toDisplay(evt._date) +
      " - " +
      (evt._controleName ? evt._controleName : "");
  }; // _checkVars
  //
  const performRefresh = async (id?: string): Promise<void> => {
    blobs = [];
    const evtid = id ? id : evt._id;
    const pMan = new EvtServices();
    evt = CreateEvt();
    if (evtid.length > 0) {
      const p = await pMan.findItemByIdAsync(evtid);
      if (p) {
        evt = { ...p };
        blobs = p._attachments ? [...p._attachments] : [];
      }
    }
    prev = { ...evt };
    _checkVars();
  }; // performRefresh
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const p = { ...evt, _modified: true };
    p[name] = val;
    evt = { ...p };
    _checkVars();
  };
  //
  const performRemove = async (): Promise<void> => {
    const pMan = new EvtServices();
    const r = await pMan.removeItemAsync(evt);
    if (r.ok) {
      blobs = [];
      evt = CreateEvt();
      prev = { ...evt };
      _checkVars();
    }
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
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...evt };
      _checkVars();
    }
  };
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new EvtServices();
    const r = await pMan.saveItemAttachmentAsync(evt, name, mime, data);
    if (r.ok && r.item) {
      evt = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new EvtServices();
    const r = await pMan.removeItemAttachmentAsync(evt, name);
    if (r.ok && r.item) {
      evt = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
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
    <h2 class="text-center">{evtTitle}</h2>
  </Row>
  <Row>
    <Col class="text-center">
    <PersonHeader
      url={evt._url}
      firstname={evt._firstname}
      lastname={evt._lastname}
    />
    </Col>
  </Row>
  <Row>
    <Form>
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
    <Col class="text-center">
    <EditCommands
      deleteDialogTitle={TITLE_REMOVE_EVT}
      deleteDialogText={TEXT_REMOVE_EVT}
      cancancel={isEvtModified}
      canremove={evt._rev.trim().length > 0 && evt._id.length > 0}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={performRemove}
      onSave={performSave}
    />
    </Col>
  </Row>
  <Row>
    <BlobInfo
      parentid={evt._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
