<script lang="ts">
  import { onMount } from "svelte";
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_ANNEE_DETAIL,
    ROUTE_EVT_DETAIL,
    ROUTE_MATIERE_DETAIL,
    ROUTE_SEMESTRE_DETAIL,
  } from "../../../../routes/routesdefs";
  import { ConvertEvtTypeToString } from "../../../data/EvtType";
  import { CreateEtudiant, IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import type { IEvtDoc } from "../../../data/IEvtDoc";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import {
    PROMPT_ANNEE,
    PROMPT_CONTROLE,
    PROMPT_DATE,
    PROMPT_EVT,
    PROMPT_MATIERE,
    PROMPT_OBSERVATIONS,
    PROMPT_SEMESTRE,
    TITLE_ETUDIANT_EVTS,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  import { EvtServices } from "../../../data/EvtServices";
  import { DateUtils } from "../../../data/DateUtils";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  //
  export let params: any = {};
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  let items: IEvtDoc[] = [];
  //
  const performRefresh = async (id?: string) => {
    etudiant = CreateEtudiant();
    items = [];
    if (id && id.trim().length > 0) {
      const pEtudServices = new EtudiantServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      const p = await pEtudServices.findItemByIdAsync(id);
      if (p) {
        etudiant = { ...p };
        const pMan = new EvtServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
        const cc = await pMan.findAllItemsByFilterAsync({ etudiantid: id });
        if (cc) {
          const aa = [...cc];
          if (aa.length > 1) {
            aa.sort((a, b) => {
              const s1 = a._date ? a._date : "";
              const s2 = b._date ? b._date : "";
              if (s1 < s2) {
                return 1;
              } else if (s1 > s2) {
                return -1;
              } else {
                return 0;
              }
            });
          } // sort
          items = [...aa];
        } // cc
      } // p
    } // id
  }; // performRefresh
  //
  const selectItem = (evtid: string): void => {
    InfoRouter(ROUTE_EVT_DETAIL + "/" + evtid);
  };
  const selectControle = (controleid: string): void => {
    SelectUtils.SelectControle(controleid);
  };
  const handleSelectAnnee = (id: string): void => {
    const spath = ROUTE_ANNEE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  const handleSelectSemestre = (id: string): void => {
    const spath = ROUTE_SEMESTRE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  const handleSelectMatiere = (id: string): void => {
    const spath = ROUTE_MATIERE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
  //
  //
</script>

<div>
  <Row>
    <Col class="text-center">
      <h2 class="text-center">{TITLE_ETUDIANT_EVTS}</h2>
    </Col>
  </Row>
  <Row>
    <Col class="text-center">
      <PersonHeader
        url={etudiant._url}
        firstname={etudiant.firstname}
        lastname={etudiant.lastname}
      />
    </Col>
  </Row>
  {#if items.length > 0}
    <Row>
      <Col class="text-center">
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>{PROMPT_DATE}</th>
              <th>{PROMPT_ANNEE}</th>
              <th>{PROMPT_SEMESTRE}</th>
              <th>{PROMPT_MATIERE}</th>
              <th>{PROMPT_CONTROLE}</th>
              <th>{PROMPT_EVT}</th>
              <th>{PROMPT_OBSERVATIONS}</th>
            </tr>
          </thead>
          <tbody>
            {#each items as evt}
              <tr>
                <td>
                  <NavLink
                    on:click={() => {
                      selectItem(evt._id);
                    }}
                  >
                    <strong>{DateUtils.toDisplay(evt._date)}</strong>
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectAnnee(evt._anneeid);
                    }}
                  >
                    <strong> {evt._anneeSigle ? evt._anneeSigle : ""}</strong>
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectSemestre(evt._semestreid);
                    }}
                  >
                    <strong>
                      {evt._semestreSigle ? evt._semestreSigle : ""}</strong
                    >
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectMatiere(evt._matiereid);
                    }}
                  >
                    <strong>{evt._matiereSigle ? evt._matiereSigle : ""}</strong
                    >
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      selectControle(evt.controleid);
                    }}
                  >
                    <strong>
                      {evt._controleName ? evt._controleName : ""}</strong
                    >
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      selectItem(evt._id);
                    }}
                  >
                    <strong>{ConvertEvtTypeToString(evt.evttype)}</strong>
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      selectItem(evt._id);
                    }}
                  >
                    <strong>{evt.observations ? evt.observations : ""}</strong>
                  </NavLink>
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </Col>
    </Row>
  {/if}
</div>
