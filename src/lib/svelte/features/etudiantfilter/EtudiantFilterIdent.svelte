<script lang="ts">
  import { onMount } from "svelte";

  import { Col, Form, Row } from "sveltestrap";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { StatusType } from "../../../data/StatusType ";
  import InputDate from "../../components/InputDate.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputText from "../../components/InputText.svelte";
  import SexeChoice from "../../components/SexeChoice.svelte";
  import StatusChoice from "../../components/StatusChoice.svelte";
  import {
    PROMPT_ADDRESS,
    PROMPT_BIRTHDATE,
    PROMPT_EMAIL,
    PROMPT_FIRSTNAME,
    PROMPT_LASTNAME,
    PROMPT_PHONE,
    TITLE_FILTER_ETUDIANT_IDENT,
  } from "../../InfoPrompt";
  import { etudiantfilterstore } from "../../stores/EtudiantStore";
  //
  let sexe: string = "";
  let birthdate: string = "";
  let lastname: string = "";
  let firstname: string = "";
  let email: string = "";
  let phone: string = "";
  let address: string = "";
  let status: StatusType = StatusType.Normal;
  //
  const _checkVars = (filter: Record<string, unknown>): void => {
    sexe = filter.sexe ? (filter.sexe as string) : "";
    birthdate = filter.birthdate ? (filter.birthdate as string) : "";
    lastname = filter.lastname ? (filter.lastname as string) : "";
    firstname = filter.firstname ? (filter.firstname as string) : "";
    email = filter.email ? (filter.email as string) : "";
    phone = filter.phone ? (filter.phone as string) : "";
    address = filter.address ? (filter.address as string) : "";
    status = filter.status ? (filter.status as StatusType) : StatusType.Normal;
  };
  //
  const onValueChanged = (val: unknown, name: string): void => {
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
    <h2>{TITLE_FILTER_ETUDIANT_IDENT}</h2>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <StatusChoice value={status} {onValueChanged} />
        </Col>
        <Col>
          <SexeChoice value={sexe} {onValueChanged} />
        </Col>
        <Col>
          <InputDate
            value={birthdate}
            label={PROMPT_BIRTHDATE}
            name={DomainConstants.FIELD_BIRTHDATE}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={lastname}
            label={PROMPT_LASTNAME}
            name={DomainConstants.FIELD_LASTNAME}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={firstname}
            label={PROMPT_FIRSTNAME}
            name={DomainConstants.FIELD_FIRSTNAME}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={email}
            label={PROMPT_EMAIL}
            name={DomainConstants.FIELD_EMAIL}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={phone}
            label={PROMPT_PHONE}
            name={DomainConstants.FIELD_PHONE}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={address}
            label={PROMPT_ADDRESS}
            name={DomainConstants.FIELD_ADDRESS}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputObservations
            value={DomainConstants.FIELD_OBSERVATIONS}
            {onValueChanged}
          />
        </Col>
      </Row>
    </Form>
  </Row>
</div>
