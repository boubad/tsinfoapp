<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_CONTROLES_LIST } from "../../../../routes/routesdefs";
  import { ControleServices } from "../../../data/ControleServices ";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { initialAnnee } from "../../../data/IAnneeDoc";
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
  const performRefresh = async (id?: string): Promise<void> => {
    controle = CreateControle();
    anneeid = "";
    groupeid = "";
    matiereid = "";
    semestreid = "";
    items = [];
    if (id && id.length > 0) {
      const pMan = new ControleServices();
      const c = await pMan.findItemByIdAsync(id);
      if (c) {
        controle = { ...c };
        anneeid = c.anneeid;
        groupeid = c.groupeid;
        const store = pMan.datastore;
        const a = await store.findItemByIdAsync(initialAnnee, anneeid);
        if (a) {
          startdate = a.startdate;
          enddate = a.enddate;
        } // a
        const g = await store.findItemByIdAsync(
          initialGroupeControles,
          c.groupecontroleid
        );
        if (g) {
          semestreid = g.semestreid;
          matiereid = g.matiereid;
          const oo = await pMan.getItemOptionsAsync(initialGroupeControles, {
            matiereid,
            semestreid,
          });
          items = [...oo];
        } // g
      } // c
    } // id
    prev = {...controle};
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
      controle = { ...r.item };
      prev = { ...controle };
      _checkVars();
    }
  };
  const performRemove = async (): Promise<void> => {
    const pMan = new ControleServices();
    const b = await pMan.removeItemAsync(controle);
    if (b.ok) {
      InfoRouter(ROUTE_CONTROLES_LIST + "/" + anneeid + "/" + groupeid);
    }
    _checkVars();
  };
  //

  //
  onMount(async () => {
    performRefresh(params.id);
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
        <Col>
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
        <Col>
          <ItemChoice
            value={controle.groupecontroleid}
            label={PROMPT_GROUPECONTROLES}
            name={DomainConstants.FIELD_GROUPECONTROLEID}
            busy={true}
            {items}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={controle.place}
            label={PROMPT_PLACE}
            name={DomainConstants.FIELD_PLACE}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <InputObservations value={controle.observations} {onValueChanged} />
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      cancancel={isModified}
      canremove={controle._rev.length > 0}
      cansave={storeable}
      onCancel={performCancel}
      onRemove={performRemove}
      onSave={performSave}
    />
  </Row>
</div>
