<script lang="ts">
  import { onMount } from "svelte";

  import { Col, Form, Row } from "sveltestrap";
  import { DomainConstants } from "../../../data/DomainConstants";
  import InputText from "../../components/InputText.svelte";
  import {
    PROMPT_DEPARTEMENT,
    PROMPT_DOSSIER,
    PROMPT_ETABLISSEMENT,
    PROMPT_ETUDESSUPERIEURES,
    PROMPT_MENTIONBAC,
    PROMPT_OPTIONBAC,
    PROMPT_REDOUBLANT,
    PROMPT_SERIEBAC,
    PROMPT_TYPEFORMATION,
    PROMPT_VILLE,
    TITLE_FILTER_ETUDIANT_INFOS,
  } from "../../InfoPrompt";
  import { etudiantfilterstore } from "../../stores/EtudiantStore";

  //
  let departement: string = "";
  let ville: string = "";
  let etablissement: string = "";
  let seriebac: string = "";
  let optionbac: string = "";
  let mentionbac: string = "";
  let sup: string = "";
  let redoublant: string = "";
  let typeformation: string = "";
  let dossier: string = "";
  //
  const _checkVars = (filter: Record<string,unknown>) => {
    departement = filter.departement ? filter.departement  as string: "";
    ville = filter.ville ? filter.ville  as string : "";
    etablissement = filter.etablissement ? filter.etablissement  as string : "";
    seriebac = filter.seriebac ? filter.seriebac  as string : "";
    optionbac = filter.optionbac ? filter.optionbac   as string: "";
    mentionbac = filter.mentionbac ? filter.mentionbac  as string : "";
    sup = filter.sup ? filter.sup  as string : "";
    redoublant = filter.redoublant ? filter.redoublant  as string : "";
    typeformation = filter.typeformation ? filter.typeformation  as string : "";
    dossier = filter.dossier ? filter.dossier  as string : "";
  };
  //
  const onValueChanged = (val: unknown, name: string) => {
    const filter = $etudiantfilterstore;
    const pp: Record<string, unknown> = {};
    for (const key in filter) {
      if (key !== name) {
        const v = filter[key];
        if (v) {
          const sv = "" + v;
          if (sv.trim().length > 0) {
            pp[key] = sv;
          }
        } // v
      }
    } // key
    if (val) {
      const s = "" + val;
      if (s.trim().length > 0) {
        pp[name] = val;
      }
    } // val
    etudiantfilterstore.set(pp);
    _checkVars(pp);
  };
  //
  onMount(() => {
    const filter = $etudiantfilterstore;
    _checkVars(filter);
  });
  //
</script>

<div>
  <Row>
    <h2>{TITLE_FILTER_ETUDIANT_INFOS}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <InputText
            value={departement}
            label={PROMPT_DEPARTEMENT}
            name={DomainConstants.FIELD_DEPARTEMENT}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={ville}
            label={PROMPT_VILLE}
            name={DomainConstants.FIELD_VILLE}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etablissement}
            label={PROMPT_ETABLISSEMENT}
            name={DomainConstants.FIELD_ETABLISSEMENT}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={seriebac}
            label={PROMPT_SERIEBAC}
            name={DomainConstants.FIELD_SERIEBAC}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={optionbac}
            label={PROMPT_OPTIONBAC}
            name={DomainConstants.FIELD_OPTIONBAC}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={mentionbac}
            label={PROMPT_MENTIONBAC}
            name={DomainConstants.FIELD_MENTIONBAC}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={sup}
            label={PROMPT_ETUDESSUPERIEURES}
            name={DomainConstants.FIELD_ETUDESSUPERIEURES}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={redoublant}
            label={PROMPT_REDOUBLANT}
            name={DomainConstants.FIELD_REDOUBLANT}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={typeformation}
            label={PROMPT_TYPEFORMATION}
            name={DomainConstants.FIELD_TYPEFORMATION}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={dossier}
            label={PROMPT_DOSSIER}
            name={DomainConstants.FIELD_DOSSIER}
            {onValueChanged}
          />
        </Col>
      </Row>
    </Form>
  </Row>
</div>
