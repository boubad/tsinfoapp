<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_SEMESTRES_LIST } from "../../../../routes/routesdefs";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { initialSemestre, ISemestreDoc } from "../../../data/ISemestreDoc";
  import { CreateSemestre } from "../../../data/ISemestreDoc";
  import { SemestreServices } from "../../../data/SemestreServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import { PROMPT_NAME, PROMPT_SIGLE } from "../../InfoPrompt";

  //
  export let params: any = {};
  let semestre: ISemestreDoc = CreateSemestre();
  let prev: ISemestreDoc = CreateSemestre();
  let blobs: IAttachedDoc[] = [];
  let isModified: boolean = false;
  let storeable: boolean = false;
  //
  const _checkVars = () => {
    isModified = semestre._modified === true;
    storeable =
      isModified &&
      semestre.sigle.trim().length > 0 &&
      semestre.name.trim().length > 0;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...semestre, _modified: true };
    pp[name] = val;
    semestre = {...pp};
    _checkVars();
  };
  const performCancel = async (): Promise<void> => {
    semestre = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new SemestreServices();
    const r = await pMan.saveItemAsync(semestre);
    if (r.ok && r.item) {
      semestre = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...semestre };
      _checkVars();
    } // ritem
  };
  const performRemove = async (): Promise<void> => {
    const pMan = new SemestreServices();
    const r = await pMan.removeItemAsync(semestre);
    if (r.ok) {
      InfoRouter(ROUTE_SEMESTRES_LIST);
    }
  };
  //
  const performRefresh = async (
    id?: string,
    pMan?: SemestreServices
  ): Promise<void> => {
    semestre = CreateSemestre();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new SemestreServices();
      }
      const store = pMan.datastore;
      const cc = await store.findItemByIdAsync(initialSemestre, id);
      if (cc) {
        semestre = { ...cc };
        blobs = cc._attachments ? [...cc._attachments] : [];
      } // cc
    } // id
    prev = semestre;
    _checkVars();
  }; // performRefresh
  //
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new SemestreServices();
    const r = await pMan.saveItemAttachmentAsync(semestre, name, mime, data);
    if (r.ok && r.item) {
      semestre = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new SemestreServices();
    const r = await pMan.removeItemAttachmentAsync(semestre, name);
    if (r.ok && r.item) {
      semestre = { ...r.item };
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
    <h2 class="text-center">{semestre.sigle + " " + semestre.name}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <InputText
            value={semestre.sigle}
            label={PROMPT_SIGLE}
            name={DomainConstants.FIELD_SIGLE}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={semestre.name}
            label={PROMPT_NAME}
            name={DomainConstants.FIELD_NAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <InputObservations value={semestre.observations} {onValueChanged} />
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      cancancel={isModified}
      canremove={semestre._rev.length > 0}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={performRemove}
      onSave={performSave}
    />
  </Row>
  {#if semestre._id.length > 0 && semestre._rev.length > 0}
    <Row>
      <BlobInfo
        parentid={semestre._id}
        {blobs}
        onSave={onSaveAttachment}
        onRemove={onRemoveAttachment}
      />
    </Row>
  {/if}
</div>
