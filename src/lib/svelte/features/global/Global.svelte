<script lang="ts">
  import { onMount } from "svelte";
  import { Col, Form, Row } from "sveltestrap";
import { CouchDBClient } from "../../../data/CouchDBClient";
  import { DomainConstants } from "../../../data/DomainConstants";
import { fetchClient } from "../../../data/fetchClient";
  import { GlobalServices } from "../../../data/GlobalServices";
  import type { IDataOption } from "../../../data/IDataOption";
  import type { IGlobalPayload } from "../../../data/IGlobalPayload";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import ItemChoice from "../../components/ItemChoice.svelte";
  import {
    PROMPT_ANNEE,
    PROMPT_GROUPE,
    PROMPT_MATIERE,
    PROMPT_SEMESTRE,
    PROMPT_UNITE,
  } from "../../InfoPrompt";
  import {
    currentanneestore,
    currentgroupestore,
    currentmatierestore,
    currentsemestrestore,
    currentunitestore,
  } from "../../stores/globalstores";
  import { InfoWebStorage } from "../../stores/webstore";
  //
  let annees: IDataOption[] = [];
  let semestres: IDataOption[] = [];
  let groupes: IDataOption[] = [];
  let unites: IDataOption[] = [];
  let matieres: IDataOption[] = [];
  //
  $: annee = $currentanneestore;
  $: semestre = $currentsemestrestore;
  $: groupe = $currentgroupestore;
  $: unite = $currentunitestore;
  $: matiere = $currentmatierestore;
  //
  const _reduceGlobal = (p: IGlobalPayload): void => {
    if (p.annees) {
      annees = [...p.annees];
    }
    if (p.semestres) {
      semestres = [...p.semestres];
    }
    if (p.groupes) {
      groupes = [...p.groupes];
    }
    if (p.unites) {
      unites = [...p.unites];
    }
    if (p.matieres) {
      matieres = [...p.matieres];
    }
    annee = "";
    if (p.anneeid) {
      annee = p.anneeid;
      $currentanneestore = annee;
    }
    unite = "";
    if (p.uniteid) {
      unite = p.uniteid;
      $currentunitestore = unite;
    }
    semestre = "";
    if (p.semestreid) {
      semestre = p.semestreid;
      $currentsemestrestore = semestre;
    }
    matiere = "";
    if (p.matiereid) {
      matiere = p.matiereid;
      $currentmatierestore = matiere;
    }
    groupe = "";
    if (p.groupeid) {
      groupe = p.groupeid;
      $currentgroupestore = groupe;
    }
  }; // _reduceGlobal
  //
  const onValueChanged = async (val: unknown, name: string): Promise<void> => {
    const pStore = new InfoWebStorage();
    let p: IGlobalPayload = undefined;
    const id = "" + val;
    switch (name) {
      case DomainConstants.FIELD_ANNEEID:
        {
          annee = id;
          $currentanneestore = id;
          pStore.anneeid = id;
        }
        break;
      case DomainConstants.FIELD_SEMESTREID:
        if (id.trim().length < 1) {
          semestre = "";
          groupes = [];
          groupe = "";
          $currentsemestrestore = semestre;
          $currentgroupestore = groupe;
          pStore.groupeid = groupe;
          pStore.semestreid = semestre;
        } else {
          const pMan = new GlobalServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
          p = await pMan.changeSemestreIdAsync(id, groupe);
          semestre = "";
          if (p.semestreid) {
            semestre = p.semestreid;
          }
          $currentsemestrestore = semestre;
          pStore.semestreid = semestre;
          groupes = [];
          if (p.groupes) {
            groupes = [...p.groupes];
          }
          groupe = "";
          if (p.groupeid) {
            groupe = p.groupeid;
          }
          $currentgroupestore = groupe;
          pStore.groupeid = groupe;
        }
        break;
      case DomainConstants.FIELD_UNITEID:
        if (id.trim().length < 1) {
          unite = "";
          matieres = [];
          matiere = "";
          $currentunitestore = unite;
          $currentmatierestore = matiere;
          pStore.uniteid = unite;
          pStore.matiereid = matiere;
        } else {
          const pMan = new GlobalServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
          p = await pMan.changeUniteIdAsync(id, matiere);
          unite = "";
          if (p.uniteid) {
            unite = p.uniteid;
          }
          $currentunitestore = unite;
          matieres = [];
          if (p.matieres) {
            matieres = [...p.matieres];
          }
          matiere = "";
          if (p.matiereid) {
            matiere = p.matiereid;
          }
          $currentmatierestore = matiere;
          pStore.uniteid = unite;
          pStore.matiereid = matiere;
        }
        break;
      case DomainConstants.FIELD_MATIEREID: {
        matiere = id;
        $currentmatierestore = id;
        pStore.matiereid = id;
        return;
      }
      case DomainConstants.FIELD_GROUPEID:
        {
          groupe = id;
          $currentgroupestore = id;
          pStore.groupeid = id;
        }
        break;
      default:
        break;
    } // name
  }; // onValueChanged
  //
  const performRefresh = async (): Promise<void> => {
    const pStore = new InfoWebStorage();
    annee = pStore.anneeid;
    $currentanneestore = annee;
    semestre = pStore.semestreid;
    $currentsemestrestore = semestre;
    groupe = pStore.groupeid;
    $currentgroupestore = groupe;
    unite = pStore.uniteid;
    $currentunitestore = unite;
    matiere = pStore.matiereid;
    $currentmatierestore = matiere;
    const pMan = new GlobalServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const p = await pMan.refreshAllAsync(
      annee,
      semestre,
      unite,
      matiere,
      groupe
    );
    _reduceGlobal(p);
  }; // performRefresh
  //
  onMount(async () => {
    await performRefresh();
  });
  //
</script>

<Form>
  <Row>
    {#if annees.length > 1}
      <Col>
        <ItemChoice
          value={annee}
          label={PROMPT_ANNEE}
          name={DomainConstants.FIELD_ANNEEID}
          items={annees}
          {onValueChanged}
        />
      </Col>
    {/if}
    {#if semestres.length > 1}
    <Col>
        <ItemChoice
          value={semestre}
          label={PROMPT_SEMESTRE}
          name={DomainConstants.FIELD_SEMESTREID}
          items={semestres}
          {onValueChanged}
        />
      </Col>
    {/if}
    {#if unites.length > 1}
      <Col>
        <ItemChoice
          value={unite}
          label={PROMPT_UNITE}
          name={DomainConstants.FIELD_UNITEID}
          items={unites}
          {onValueChanged}
        />
      </Col>
    {/if}
    {#if unite.length > 0 && matieres.length > 1}
      <Col>
        <ItemChoice
          value={matiere}
          label={PROMPT_MATIERE}
          name={DomainConstants.FIELD_MATIEREID}
          items={matieres}
          {onValueChanged}
        />
      </Col>
    {/if}
    {#if semestre.length > 0 && groupes.length > 1}
      <Col>
        <ItemChoice
          value={groupe}
          label={PROMPT_GROUPE}
          name={DomainConstants.FIELD_GROUPEID}
          items={groupes}
          {onValueChanged}
        />
      </Col>
    {/if}
  </Row>
</Form>
