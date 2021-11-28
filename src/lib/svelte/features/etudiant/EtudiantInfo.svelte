<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import { CreateEtudiant } from "../../../data/IEtudiantDoc";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputText from "../../components/InputText.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
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
    TITLE_ETUDIANT_INFO,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  let prev: IEtudiantDoc = CreateEtudiant();
  let isModified: boolean = false;
  let storeable: boolean = false;
  //
  const _checkVars = (): void => {
    isModified = etudiant._modified === true;
    storeable =
      etudiant.lastname.trim().length > 0 &&
      etudiant.firstname.trim().length &&
      isModified;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
    const pp = { ...etudiant, _modified: true };
    pp[name] = val;
    pp._modified = true;
    etudiant = { ...pp };
    _checkVars();
  }; // onVakueChanged
  //
  const onCancelEtudiant = (): void => {
    etudiant = { ...prev };
    _checkVars();
  };
  const onSaveEtudiant = async (): Promise<void> => {
    const pMan = new EtudiantServices();
    const r = await pMan.saveItemAsync(etudiant);
    if (r.ok && r.item) {
      etudiant = { ...r.item };
      prev = { ...etudiant };
      _checkVars();
    }
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    etudiant = CreateEtudiant();
    if (id && id.trim().length > 0) {
      const pMan = new EtudiantServices();
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        etudiant = { ...cc };
      }
    } // id
    prev = { ...etudiant };
    _checkVars();
  }; // performRefresh
  //
  onMount(async () => {
    performRefresh(params.id);
  });
  //
</script>
<div>
  <Row>
    <h2 class="text-center">{TITLE_ETUDIANT_INFO}</h2>
  </Row>
  <Row>
    <PersonHeader
      url={etudiant._url}
      firstname={etudiant.firstname}
      lastname={etudiant.lastname}
    />
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <InputText
            value={etudiant.departement}
            label={PROMPT_DEPARTEMENT}
            name={DomainConstants.FIELD_DEPARTEMENT}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.ville}
            label={PROMPT_VILLE}
            name={DomainConstants.FIELD_VILLE}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.etablissement}
            label={PROMPT_ETABLISSEMENT}
            name={DomainConstants.FIELD_ETABLISSEMENT}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={etudiant.seriebac}
            label={PROMPT_SERIEBAC}
            name={DomainConstants.FIELD_SERIEBAC}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.optionbac}
            label={PROMPT_OPTIONBAC}
            name={DomainConstants.FIELD_OPTIONBAC}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.mentionbac}
            label={PROMPT_MENTIONBAC}
            name={DomainConstants.FIELD_MENTIONBAC}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={etudiant.sup}
            label={PROMPT_ETUDESSUPERIEURES}
            name={DomainConstants.FIELD_ETUDESSUPERIEURES}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.redoublant}
            label={PROMPT_REDOUBLANT}
            name={DomainConstants.FIELD_REDOUBLANT}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={etudiant.typeformation}
            label={PROMPT_TYPEFORMATION}
            name={DomainConstants.FIELD_TYPEFORMATION}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={etudiant.ident}
            label={PROMPT_DOSSIER}
            name={DomainConstants.FIELD_DOSSIER}
            {onValueChanged}
          />
        </Col>
      </Row>
    </Form>
  </Row>
  <Row>
    <EditCommands
      cancancel={isModified}
      canremove={false}
      cansave={storeable}
      onCancel={() => {
        onCancelEtudiant();
      }}
      onSave={async () => {
        onSaveEtudiant();
      }}
      onRemove={() => {}}
    />
  </Row>
</div>
