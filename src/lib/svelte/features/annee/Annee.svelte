<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_ANNEES_LIST } from "../../../../routes/routesdefs";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { CreateAnnee, IAnneeDoc } from "../../../data/IAnneeDoc";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { AnneeServices } from "../../../data/AnneeServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputDate from "../../components/InputDate.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import {
    PROMPT_ENDDATE,
    PROMPT_NAME,
    PROMPT_SIGLE,
    PROMPT_STARTDATE,
  } from "../../InfoPrompt";
  import StatusChoice from "../../components/StatusChoice.svelte";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  //
  export let params: any = {};
  let annee: IAnneeDoc = CreateAnnee();
  let prev: IAnneeDoc = CreateAnnee();
  let blobs: IAttachedDoc[] = [];
  let isModified: boolean = false;
  let storeable: boolean = false;
  let pagetitle: string = "";
  //
  const _getpagetitle = (): string => {
    if (annee._id.length > 0 && annee._rev.length > 0) {
      return annee.name;
    }
    return "Nouvelle année: " + annee.name;
  };
  //
  const _checkVars = (): void => {
    pagetitle = _getpagetitle();
    isModified = annee._modified === true;
    storeable =
      isModified &&
      annee.sigle.length > 0 &&
      annee.name.length > 0 &&
      annee.startdate.length >= 10 &&
      annee.enddate.length >= 10 &&
      annee.enddate >= annee.startdate;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...annee, _modified: true };
    pp[name] = val;
    annee = { ...pp };
    _checkVars();
  };
  const _performCancel = (): void => {
    annee = { ...prev };
    _checkVars();
  };
  const _performSave = async (): Promise<void> => {
    const pMan = new AnneeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.saveItemAsync(annee);
    if (r.ok && r.item) {
      annee = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...annee };
      _checkVars();
    } // r
  };
  const _performRemove = async (): Promise<void> => {
    const pMan = new AnneeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.removeItemAsync(annee);
    if (r.ok) {
      InfoRouter(ROUTE_ANNEES_LIST);
    }
  };
  //
  const _performRefresh = async (
    id?: string,
    pMan?: AnneeServices
  ): Promise<void> => {
    annee = CreateAnnee();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new AnneeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      }
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        annee = { ...cc };
        blobs = cc._attachments ? [...cc._attachments] : [];
      } // cc
    } // id
    prev = { ...annee };
    _checkVars();
  }; // performRefresh
  //
  const _onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new AnneeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.saveItemAttachmentAsync(annee, name, mime, data);
    if (r.ok && r.item) {
      annee = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const _onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new AnneeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.removeItemAttachmentAsync(annee, name);
    if (r.ok && r.item) {
      annee = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  //
  onMount(async () => {
    await _performRefresh(params.id);
  });
  //
</script>

<div>
  <Row>
    <Col />
    <div>
      <Row>
        <h2 class="text-center">{pagetitle}</h2>
      </Row>
      <Row>
        <Form>
          <Row>
            <Col xs="3">
              <InputDate
                value={annee.startdate}
                label={PROMPT_STARTDATE}
                name={DomainConstants.FIELD_STARTDATE}
                {onValueChanged}
              />
            </Col>
            <Col xs="3">
              <InputDate
                value={annee.enddate}
                label={PROMPT_ENDDATE}
                name={DomainConstants.FIELD_ENDDATE}
                {onValueChanged}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="3">
              <InputText
                value={annee.sigle}
                label={PROMPT_SIGLE}
                name={DomainConstants.FIELD_SIGLE}
                {onValueChanged}
              />
            </Col>
            <Col xs="3">
              <InputText
                value={annee.name}
                label={PROMPT_NAME}
                name={DomainConstants.FIELD_NAME}
                {onValueChanged}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="4">
              <InputObservations value={annee.observations} {onValueChanged} />
            </Col>
            <Col xs="2">
              <StatusChoice value={annee.status} {onValueChanged} />
            </Col>
          </Row>
        </Form>
      </Row>
      <Row>
        <Col class="text-center">
          <EditCommands
            cancancel={isModified}
            canremove={annee._rev.length > 0}
            cansave={storeable}
            onCancel={_performCancel}
            onRemove={_performRemove}
            onSave={_performSave}
          />
        </Col>
      </Row>
      {#if annee._id.length > 0 && annee._rev.length > 0}
        <Row>
          <BlobInfo
            parentid={annee._id}
            {blobs}
            onSave={_onSaveAttachment}
            onRemove={_onRemoveAttachment}
          />
        </Row>
      {/if}
    </div>
    <Col />
  </Row>
</div>
