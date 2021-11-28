<script lang="ts">
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_ANNEE_DETAIL,
    ROUTE_ETUDAFFECTATION_DETAIL,
    ROUTE_GROUPE_DETAIL,
    ROUTE_SEMESTRE_DETAIL,
  } from "../../../../routes/routesdefs";
  import { DateUtils } from "../../../data/DateUtils";
  import { EtudAffectationServices } from "../../../data/EtudAffectationServices";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import type { IEtudAffectationDoc } from "../../../data/IEtudAffectation";
  import { CreateEtudiant, IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import {
    PROMPT_ANNEE,
    PROMPT_ENDDATE,
    PROMPT_GROUPE,
    PROMPT_OBSERVATIONS,
    PROMPT_SEMESTRE,
    PROMPT_STARTDATE,
    TITLE_ETUDIANT_AFFECTATIONS,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  let items: IEtudAffectationDoc[] = [];
  //
  const performRefresh = async (id?: string) => {
    etudiant = CreateEtudiant();
    items = [];
    if (id && id.trim().length > 0) {
      const pEtudServices = new EtudiantServices();
      const p = await pEtudServices.findItemByIdAsync(id);
      if (p) {
        etudiant = { ...p };
        const pMan = new EtudAffectationServices();
        const cc = await pMan.findAllItemsByFilterAsync({ etudiantid: id });
        if (cc) {
          const aa = [...cc];
          if (aa.length > 1) {
            aa.sort((a, b) => {
              const s1 = a.startdate ? a.startdate : "";
              const s2 = b.startdate ? b.startdate : "";
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
  const handleSelectAnnee = (id: string): void => {
    const spath = ROUTE_ANNEE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  const handleSelectSemestre = (id: string): void => {
    const spath = ROUTE_SEMESTRE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  const handleSelectGroupe = (id: string): void => {
    const spath = ROUTE_GROUPE_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  //
  const handleSelectEtudAffectation = (id: string): void => {
    const spath = ROUTE_ETUDAFFECTATION_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_ETUDIANT_AFFECTATIONS}</h2>
  </Row>
  <Row>
    <PersonHeader
      url={etudiant._url}
      firstname={etudiant.firstname}
      lastname={etudiant.lastname}
    />
  </Row>
  <Row>
    <Table bordered={true} striped={true}>
      <thead>
        <tr>
          <th>{PROMPT_ANNEE}</th>
          <th>{PROMPT_SEMESTRE}</th>
          <th>{PROMPT_GROUPE}</th>
          <th>{PROMPT_STARTDATE}</th>
          <th>{PROMPT_ENDDATE}</th>
          <th>{PROMPT_OBSERVATIONS}</th>
        </tr>
      </thead>
      <tbody>
        {#each items as aff}
          <tr>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectAnnee(aff.anneeid);
                }}
              >
                {aff._anneeSigle ? aff._anneeSigle : ""}
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectSemestre(aff._semestreid);
                }}
              >
                {aff._semestreSigle ? aff._semestreSigle : ""}
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectGroupe(aff.groupeid);
                }}
              >
                {aff._groupeSigle ? aff._groupeSigle : ""}
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEtudAffectation(aff._id);
                }}
              >
                {DateUtils.toDisplay(aff.startdate)}
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEtudAffectation(aff._id);
                }}
              >
                {DateUtils.toDisplay(aff.enddate)}
              </NavLink>
            </td>
            <td>{aff.observations}</td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </Row>
</div>
