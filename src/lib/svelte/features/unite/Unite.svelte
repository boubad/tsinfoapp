<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_UNITES_LIST } from "../../../../routes/routesdefs";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { CreateUnite, IUniteDoc } from "../../../data/IUniteDoc";
  import { UniteServices } from "../../../data/UniteServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import { PROMPT_NAME, PROMPT_SIGLE } from "../../InfoPrompt";
  //
  export let params: any = {};
  let unite: IUniteDoc = CreateUnite();
  let prev: IUniteDoc = CreateUnite();
  let blobs: IAttachedDoc[] = [];
  let isModified: boolean = false;
  let storeable: boolean = false;
  //
  const _checkVars = (): void => {
    isModified = unite._modified === true;
    storeable = isModified && unite.sigle.length > 0 && unite.name.length > 0;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...unite };
    pp[name] = val;
    unite = { ...pp, _modified: true };
    _checkVars();
  };
  const performCancel = (): void => {
    unite = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new UniteServices();
    const r = await pMan.saveItemAsync(unite);
    if (r.ok && r.item) {
      unite = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...unite };
      _checkVars();
    } // r
  };
  const performRemove = async () => {
    const pMan = new UniteServices();
    const r = await pMan.removeItemAsync(unite);
    if (r.ok) {
      InfoRouter(ROUTE_UNITES_LIST);
    }
  };
  //
  const performRefresh = async (
    id?: string,
    pMan?: UniteServices
  ): Promise<void> => {
    unite = CreateUnite();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new UniteServices();
      }
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        unite = { ...cc };
        blobs = cc._attachments ? [...cc._attachments] : [];
      } // cc
    } // id
    prev = { ...unite };
    _checkVars();
  }; // performRefresh
  //
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new UniteServices();
    const r = await pMan.saveItemAttachmentAsync(unite, name, mime, data);
    if (r.ok && r.item) {
      unite = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new UniteServices();
    const r = await pMan.removeItemAttachmentAsync(unite, name);
    if (r.ok && r.item) {
      unite = { ...r.item };
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
    <h2 class="text-center">{unite.sigle + " " + unite.name}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <InputText
            value={unite.sigle}
            label={PROMPT_SIGLE}
            name={DomainConstants.FIELD_SIGLE}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={unite.name}
            label={PROMPT_NAME}
            name={DomainConstants.FIELD_NAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputObservations
            value={unite.observations}
            {onValueChanged}
          />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      cancancel={isModified}
      canremove={unite._rev.length > 0}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={performRemove}
      onSave={performSave}
    />
  </Row>
  {#if unite._id.length > 0 && unite._rev.length}
    <Row>
      <BlobInfo
        parentid={unite._id}
        {blobs}
        onSave={onSaveAttachment}
        onRemove={onRemoveAttachment}
      />
    </Row>
  {/if}
</div>
