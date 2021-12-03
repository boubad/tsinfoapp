<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_ETUDAFFECTATIONS_LIST } from "../../../../routes/routesdefs";
  import { AnneeServices } from "../../../data/AnneeServices";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { EtudAffectationServices } from "../../../data/EtudAffectationServices";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import {
    CreateEtudAffectation,
    IEtudAffectationDoc,
  } from "../../../data/IEtudAffectation";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputDate from "../../components/InputDate.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import { PROMPT_ENDDATE, PROMPT_STARTDATE } from "../../InfoPrompt";
  export let params: any = {};
  let etudaffectation: IEtudAffectationDoc = CreateEtudAffectation();
  let prev: IEtudAffectationDoc = CreateEtudAffectation();
  let blobs: IAttachedDoc[] = [];
  let etudaffectationtitle: string = "";
  let isModified: boolean = false;
  let storeable: boolean = false;
  let anneeid: string = "";
  let groupeid: string = "";
  let startdate: string = "";
  let enddate: string = "";
  //
  const _checkVars = (): void => {
    isModified = etudaffectation._modified === true;
    storeable =
      isModified &&
      etudaffectation.anneeid.length > 0 &&
      etudaffectation.etudiantid.length > 0 &&
      etudaffectation.groupeid.length > 0;
    etudaffectationtitle = "Affectation " + etudaffectation._fullname;
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    const affetudid = id && id.length > 0 ? id : "";
    const pMan = new EtudAffectationServices();
    const p = await pMan.findItemByIdAsync(affetudid);
    if (p) {
      anneeid = p.anneeid;
      groupeid = p.groupeid;
      const pf = new AnneeServices();
      const a = await pf.findItemByIdAsync(anneeid);
      if (a) {
        startdate = a.startdate;
        enddate = a.enddate;
      }
      etudaffectation = { ...p };
      blobs = p._attachments ? [...p._attachments] : [];
    } // p
    prev = { ...etudaffectation };
    _checkVars();
  }; // performRefresh
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...etudaffectation };
    pp[name] = val;
    etudaffectation = { ...pp, _modified: true };
    _checkVars();
  };
  const performCancel = (): void => {
    etudaffectation = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new EtudAffectationServices();
    const r = await pMan.saveItemAsync(etudaffectation);
    if (r.ok && r.item) {
      etudaffectation = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    } // r
  };
  const performRemove = async (): Promise<void> => {
    const pMan = new EtudAffectationServices();
    const r = await pMan.removeItemAsync(etudaffectation);
    if (r.ok) {
      InfoRouter(ROUTE_ETUDAFFECTATIONS_LIST + "/" + anneeid + "/" + groupeid);
    }
  };
  //

  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new EtudAffectationServices();
    const r = await pMan.saveItemAttachmentAsync(
      etudaffectation,
      name,
      mime,
      data
    );
    if (r.ok && r.item) {
      etudaffectation = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new EtudAffectationServices();
    const r = await pMan.removeItemAttachmentAsync(etudaffectation, name);
    if (r.ok && r.item) {
      etudaffectation = { ...r.item };
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
    <h2 class="text-center">
      {etudaffectationtitle}
    </h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col xs="3">
          <InputDate
            value={etudaffectation.startdate}
            label={PROMPT_STARTDATE}
            name={DomainConstants.FIELD_STARTDATE}
            min={startdate}
            max={enddate}
            {onValueChanged}
          />
        </Col>
        <Col xs="3">
          <InputDate
            value={etudaffectation.enddate}
            label={PROMPT_ENDDATE}
            name={DomainConstants.FIELD_ENDDATE}
            min={startdate}
            max={enddate}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
          <InputObservations
            value={etudaffectation.observations}
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
        canremove={etudaffectation._rev.length > 0}
        cansave={storeable}
        onCancel={performCancel}
        onRemove={performRemove}
        onSave={performSave}
      />
    </Col>
  </Row>
  <Row>
    <BlobInfo
      parentid={etudaffectation._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
