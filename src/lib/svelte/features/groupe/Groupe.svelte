<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_GROUPES_LIST } from "../../../../routes/routesdefs";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import type { IDataOption } from "../../../data/IDataOption";
  import { CreateGroupe, IGroupeDoc } from "../../../data/IGroupeDoc";
  import { GroupeServices } from "../../../data/GroupeServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
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
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  //
  export let params: any = {};
  let groupe: IGroupeDoc = CreateGroupe();
  let prev: IGroupeDoc = CreateGroupe();
  let blobs: IAttachedDoc[] = [];
  let parents: IDataOption[] = [];
  let isModified: boolean = false;
  let storeable: boolean = false;
  let semestreid:string = '';
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
  const findParents = async (): Promise<void> => {
    const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const aa = await pMan.findParentOptionsAsync(groupe, semestreid);
    parents = [...aa];
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...groupe, _modified: true };
    pp[name] = val;
    groupe = {...pp};
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
    const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.saveItemAsync(groupe);
    if (r.ok && r.item) {
      groupe = {...r.item};
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...groupe };
      _checkVars();
    } // r
  };
  const performRemove = async (): Promise<void> => {
    const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.removeItemAsync(groupe);
    if (r.ok) {
      InfoRouter(ROUTE_GROUPES_LIST + "/" + semestreid);
    }
  };
  //
  const performRefresh = async (
    id?: string,
    pMan?: GroupeServices
  ): Promise<void> => {
    groupe = CreateGroupe();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      }
      const p = await pMan.findItemByIdAsync(id);
      if (p) {
        semestreid = p.semestreid;
        groupe = {...p};
        blobs = p._attachments ? [...p._attachments] : [];
      } // cc
    } // id
    prev = {...groupe};
    await findParents();
    _checkVars();
  }; // performRefresh
  //
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.saveItemAttachmentAsync(groupe, name, mime, data);
    if (r.ok && r.item) {
      groupe = {...r.item};
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const r = await pMan.removeItemAttachmentAsync(groupe, name);
    if (r.ok && r.item) {
      groupe = {...r.item};
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
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
        <InputObservations
          value={groupe.observations}
          {onValueChanged}
        />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <Col class="text-center">
    <EditCommands
      cancancel={isModified}
      canremove={groupe._rev.length > 0}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={performRemove}
      onSave={performSave}
    />
    </Col>
  </Row>
  {#if groupe._id.length > 0 && groupe._rev.length > 0}
    <Row>
      <BlobInfo
        parentid={groupe._id}
        {blobs}
        onSave={onSaveAttachment}
        onRemove={onRemoveAttachment}
      />
    </Row>
  {/if}
</div>
