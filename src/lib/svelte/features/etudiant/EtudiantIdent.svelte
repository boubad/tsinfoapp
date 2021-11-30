<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
  import { DomainConstants } from "../../../data/DomainConstants";
  import type { IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import { CreateEtudiant } from "../../../data/IEtudiantDoc";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import DeleteItem from "../../components/DeleteItem.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputDate from "../../components/InputDate.svelte";
  import InputEmail from "../../components/InputEmail.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputPhone from "../../components/InputPhone.svelte";
  import InputText from "../../components/InputText.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import SexeChoice from "../../components/SexeChoice.svelte";
  import {
    COMMAND_REMOVE_ETUDIANT,
    PROMPT_ADDRESS,
    PROMPT_BIRTHDATE,
    PROMPT_EMAIL,
    PROMPT_FIRSTNAME,
    PROMPT_LASTNAME,
    PROMPT_PHONE,
    PROMPT_USERNAME,
    TEXT_REMOVE_ETUDIANT,
    TITLE_ETUDIANT_IDENT,
    TITLE_REMOVE_ETUDIANT,
  } from "../../InfoPrompt";
  import { ROUTE_ETUDIANTS_LIST } from "../../../../routes/routesdefs";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  //
  export let params: any = {};
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  let prev: IEtudiantDoc = CreateEtudiant();
  let isPersisted: boolean = false;
  let isModified: boolean = false;
  let storeable: boolean = false;
  //
  const _checkVars = (): void => {
    isPersisted = etudiant._rev.trim().length > 0;
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
    etudiant = { ...pp };
    _checkVars();
  }; // onVakueChanged
  const onCancelEtudiant = (): void => {
    etudiant = { ...prev };
    _checkVars();
  };
  //
  const onRemoveEtudiant = async (): Promise<void> => {
    const id = etudiant._id;
    const rev = etudiant._rev;
    if (id.length > 0 && rev.length > 0) {
      const pMan = new EtudiantServices();
      const r = await pMan.removeItemAsync(etudiant);
      if (r.ok) {
        InfoRouter(ROUTE_ETUDIANTS_LIST);
      }
    }
  };

  const onSaveEtudiant = async () => {
    const pMan = new EtudiantServices();
    const r = await pMan.saveItemAsync(etudiant);
    if (r.ok && r.item) {
      etudiant = { ...r.item };
      prev = { ...etudiant };
      _checkVars();
    }
  };
  //
  const performRefresh = async (id?: string) => {
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
  //
</script>

<div>
  <Row>
    <Col xs="1" />
    <Col xs="6">
      <h2 class="text-center">{TITLE_ETUDIANT_IDENT}</h2>
    </Col>
    <Col xs="1" />
  </Row>
  <Row>
    <Col xs="1" />
    <Col xs="6">
      <PersonHeader
        url={etudiant._url}
        firstname={etudiant.firstname}
        lastname={etudiant.lastname}
      />
    </Col>
    <Col xs="1" />
  </Row>
  {#if isPersisted}
    <Row>
      <Col xs="1" />
      <Col xs="6">
        <Col class="text-center">
          <DeleteItem
            buttonText={COMMAND_REMOVE_ETUDIANT}
            dialogText={TEXT_REMOVE_ETUDIANT}
            dialogTitle={TITLE_REMOVE_ETUDIANT}
            onDeleteItem={onRemoveEtudiant}
          />
        </Col>
      </Col>
      <Col xs="1" />
    </Row>
  {/if}
  <Row>
    <Form>
      <Row>
        <Col xs="1" />
        <Col xs="2">
          <InputText
            value={etudiant.username}
            label={PROMPT_USERNAME}
            size={23}
            name={DomainConstants.FIELD_USERNAME}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <SexeChoice value={etudiant.sexe} {onValueChanged} />
        </Col>
        <Col xs="2">
          <InputDate
            value={etudiant.birthdate}
            label={PROMPT_BIRTHDATE}
            name={DomainConstants.FIELD_BIRTHDATE}
            {onValueChanged}
          />
        </Col>
        <Col xs="1" />
      </Row>
      <Row>
        <Col xs="1" />
        <Col xs="3">
          <InputText
            value={etudiant.lastname}
            label={PROMPT_LASTNAME}
            size={31}
            name={DomainConstants.FIELD_LASTNAME}
            {onValueChanged}
          />
        </Col>
        <Col xs="3">
          <InputText
            value={etudiant.firstname}
            label={PROMPT_FIRSTNAME}
            size={31}
            name={DomainConstants.FIELD_FIRSTNAME}
            {onValueChanged}
          />
        </Col>
        <Col xs="1" />
      </Row>
      <Row>
        <Col xs="1" />
        <Col xs="2">
          <InputEmail
            value={etudiant.email}
            label={PROMPT_EMAIL}
            name={DomainConstants.FIELD_EMAIL}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <InputPhone
            value={etudiant.phone}
            label={PROMPT_PHONE}
            size={23}
            name={DomainConstants.FIELD_PHONE}
            {onValueChanged}
          />
        </Col>
        <Col xs="2">
          <InputText
            value={etudiant.address}
            label={PROMPT_ADDRESS}
            name={DomainConstants.FIELD_ADDRESS}
            {onValueChanged}
          />
        </Col>
        <Col xs="1" />
      </Row>
      <Row>
        <Col xs="1" />
        <Col xs="6">
          <InputObservations value={etudiant.observations} {onValueChanged} />
        </Col>
        <Col xs="1" />
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
      onRemove={() => {}}
      onSave={async () => {
        onSaveEtudiant();
      }}
    />
  </Row>
</div>
