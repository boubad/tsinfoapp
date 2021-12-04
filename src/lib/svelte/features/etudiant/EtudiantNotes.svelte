<script lang="ts">
  import { onMount } from "svelte";
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_ANNEE_DETAIL,
    ROUTE_MATIERE_DETAIL,
    ROUTE_NOTE_DETAIL,
    ROUTE_SEMESTRE_DETAIL,
  } from "../../../../routes/routesdefs";
  import { CreateEtudiant, IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import type { INoteDoc } from "../../../data/INoteDoc";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import {
    PROMPT_ANNEE,
    PROMPT_CONTROLE,
    PROMPT_DATE,
    PROMPT_MATIERE,
    PROMPT_NOTE,
    PROMPT_OBSERVATIONS,
    PROMPT_SEMESTRE,
    TITLE_ETUDIANT_NOTES,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  import { NoteServices } from "../../../data/NoteServices";
  import { DateUtils } from "../../../data/DateUtils";
  //
  export let params: any = {};
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  //
  let items: INoteDoc[] = [];
  //
  const performRefresh = async (id?: string): Promise<void> => {
    etudiant = CreateEtudiant();
    items = [];
    if (id && id.trim().length > 0) {
      const pEtudServices = new EtudiantServices();
      const p = await pEtudServices.findItemByIdAsync(id);
      if (p) {
        etudiant = { ...p };
        const pMan = new NoteServices();
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
  const selectItem = (noteid: string): void => {
    InfoRouter(ROUTE_NOTE_DETAIL + "/" + noteid);
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
  const handleSelectNote = (id: string): void => {
    const spath = ROUTE_NOTE_DETAIL + "/" + id;
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
    <Col class="text-center">
      <h2 class="text-center">{TITLE_ETUDIANT_NOTES}</h2>
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
              <th>{PROMPT_NOTE}</th>
              <th>{PROMPT_OBSERVATIONS}</th>
            </tr>
          </thead>
          <tbody>
            {#each items as note}
              <tr>
                <td>
                  <NavLink
                    on:click={() => {
                      selectItem(note._id);
                    }}
                  >
                    <strong> {DateUtils.toDisplay(note._date)}</strong>
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectAnnee(note._anneeid);
                    }}
                  >
                    <strong>{note._anneeSigle ? note._anneeSigle : ""}</strong>
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectSemestre(note._semestreid);
                    }}
                  >
                    <strong
                      >{note._semestreSigle ? note._semestreSigle : ""}</strong
                    >
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectMatiere(note._matiereid);
                    }}
                  >
                    <strong>
                      {note._matiereSigle ? note._matiereSigle : ""}</strong
                    >
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      selectControle(note.controleid);
                    }}
                  >
                    <strong
                      >{note._controleName ? note._controleName : ""}</strong
                    >
                  </NavLink>
                </td>
                <td class="float-right">
                  {#if note.value}
                    <NavLink
                      on:click={() => {
                        handleSelectNote(note._id);
                      }}
                    >
                      <strong>{note.value}</strong>
                    </NavLink>
                  {/if}
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectNote(note._id);
                    }}
                  >
                    <strong>{note.observations ? note.observations : ""}</strong
                    >
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
