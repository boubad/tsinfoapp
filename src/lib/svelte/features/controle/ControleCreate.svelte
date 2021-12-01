<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_CONTROLES_LIST } from "../../../../routes/routesdefs";
  import { AnneeServices } from "../../../data/AnneeServices";
  import { ControleServices } from "../../../data/ControleServices ";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IControleDoc } from "../../../data/IControleDoc";
  import { CreateControle } from "../../../data/IControleDoc";
  import type { IDataOption } from "../../../data/IDataOption";
  import { initialGroupeControles } from "../../../data/IGroupeControlesDoc";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputDate from "../../components/InputDate.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import ItemChoice from "../../components/ItemChoice.svelte";
  import {
    PROMPT_DATE,
    PROMPT_GROUPECONTROLES,
    PROMPT_PLACE,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  //
  let controle: IControleDoc = CreateControle();
  let prev: IControleDoc = CreateControle();
  let isModified: boolean = false;
  let storeable: boolean = false;
  let startdate: string = "";
  let enddate: string = "";
  let controletitle: string = "";
  let items: IDataOption[] = [];
  let anneeid: string = "";
  let semestreid: string = "";
  let matiereid: string = "";
  let groupeid: string = "";
  //
  const performRefresh = async (
    annee?: string,
    semestre?: string,
    matiere?: string,
    groupe?: string
  ): Promise<void> => {
    if (annee && annee.length > 0) {
      anneeid = annee;
    }
    if (semestre && semestre.length > 0) {
      semestreid = semestre;
    }
    if (matiere && matiere.length > 0) {
      matiereid = matiere;
    }
    if (groupe && groupe.length > 0) {
      groupeid = groupe;
    }
    if (matiereid.length > 0 && semestreid.length > 0) {
      const pMan = new ControleServices();
      const oo = await pMan.getItemOptionsAsync(initialGroupeControles, {
        matiereid,
        semestreid,
      });
      items = [...oo];
    } else {
      items = [];
    }
    if (anneeid.trim().length > 0) {
      const pf = new AnneeServices();
      const aa = await pf.findItemByIdAsync(anneeid);
      if (aa) {
        startdate = aa.startdate;
        enddate = aa.enddate;
      }
    }
    controle = CreateControle();
    controle.anneeid = anneeid;
    controle.groupeid = groupeid;
    prev = { ...controle };
    _checkVars();
  }; // performRefresh
  //
  const getControleTitle = (): string => {
    const s1 = controle._groupeSigle ? controle._groupeSigle : "";
    const s2 = controle._groupeControlesSigle
      ? controle._groupeControlesSigle
      : "";
    return s1 + " - " + s2;
  };
  //
  const _checkVars = () => {
    controletitle = getControleTitle();
    isModified = controle._modified === true;
    storeable =
      isModified &&
      controle.groupecontroleid.trim().length > 0 &&
      controle.anneeid.trim().length > 0 &&
      controle.groupeid.trim().length > 0 &&
      controle.date.trim().length > 0;
  }; // _checkVars
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...controle, _modiied: true };
    pp[name] = val;
    controle = { ...pp };
    _checkVars();
  };
  const performCancel = async () => {
    controle = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new ControleServices();
    const r = await pMan.saveItemAsync(controle);
    if (r.ok && r.item) {
      InfoRouter(ROUTE_CONTROLES_LIST + "/" + anneeid + "/" + groupeid);
    }
  };
  //
  onMount(async () => {
    performRefresh(
      params.annee,
      params.semestre,
      params.matiere,
      params.groupe
    );
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{controletitle}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col xs="3">
          <InputDate
            value={controle.date}
            label={PROMPT_DATE}
            name={DomainConstants.FIELD_DATE}
            min={startdate}
            max={enddate}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="3">
          <ItemChoice
            value={controle.groupecontroleid}
            label={PROMPT_GROUPECONTROLES}
            name={DomainConstants.FIELD_GROUPECONTROLEID}
            {items}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="3">
          <InputText
            value={controle.place}
            label={PROMPT_PLACE}
            name={DomainConstants.FIELD_PLACE}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
        <InputObservations value={controle.observations} {onValueChanged} />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      cancancel={isModified}
      cansave={storeable}
      onCancel={performCancel}
      onSave={performSave}
    />
  </Row>
</div>
