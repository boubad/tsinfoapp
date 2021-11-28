<script lang="ts">
  //
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_ETUDAFFECTATIONS_CREATE, ROUTE_ETUDAFFECTATION_DETAIL } from "../../../../routes/routesdefs";
  import { DateUtils } from "../../../data/DateUtils";
  import { EtudAffectationServices } from "../../../data/EtudAffectationServices";
  import type { IEtudAffectationDoc } from "../../../data/IEtudAffectation";
  import ListCommands from "../../components/ListCommands.svelte";
  import PhotoComponent from "../../components/PhotoComponent.svelte";
  import {
    PROMPT_ENDDATE,
    PROMPT_NAME,
    PROMPT_PHOTO,
    PROMPT_STARTDATE,
    TITLE_ETUDAFFECTATIONS_LIST,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  //
  export let params: any = {};
  let items: IEtudAffectationDoc[] = [];
  let anneeid: string = "";
  let groupeid: string = "";
  //
  const performRefresh = async (
    annee?: string,
    groupe?: string
  ): Promise<void> => {
    if (annee && annee.length > 0) {
      anneeid = annee;
    }
    if (groupe && groupe.length > 0) {
      groupeid = groupe;
    }
    if (groupeid.length < 1 || anneeid.length < 1) {
      items = [];
    } else {
      const pMan = new EtudAffectationServices();
      const dd = await pMan.findAllItemsByFilterAsync({ anneeid, groupeid });
      const aa = [...dd];
      if (aa.length > 1) {
        aa.sort((a, b) => {
          const s1 = a._fullname ? a._fullname : "";
          const s2 = b._fullname ? b._fullname : "";
          if (s1 < s2) {
            return -1;
          } else if (s1 > s2) {
            return 1;
          } else {
            return 0;
          }
        });
      } // sort
      items = [...aa];
    }
  };
  //
  const handleSelectEtudiant = (etudiantid: string): void => {
    SelectUtils.SelectEtudiant(etudiantid);
  };
  const handleSelectEtudAffectation = (id: string): void => {
    const spath = ROUTE_ETUDAFFECTATION_DETAIL + "/" + id;
    InfoRouter(spath);
  };
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_ETUDAFFECTATIONS_CREATE + "/" + anneeid + "/" + groupeid);
  };
  //
  onMount(async () => {
    await performRefresh(params.annee, params.groupe);
  });
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_ETUDAFFECTATIONS_LIST}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={anneeid.length > 0 && groupeid.length > 0}
      canrefresh={anneeid.length > 0 && groupeid.length > 0}
      newbuttontext={'Créer des affectations'}
      onCreate={handleCreate}
      onRefresh={performRefresh}
    />
  </Row>
  {#if items.length > 0}
    <Row>
      <Table bordered={true} striped={true}>
        <thead>
          <tr>
            <th>{PROMPT_PHOTO}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_STARTDATE}</th>
            <th>{PROMPT_ENDDATE}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                {#if item._url}
                  <PhotoComponent
                    url={item._url}
                    text={item._fullname ? item._fullname : ""}
                    height={56}
                  />
                {/if}
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectEtudiant(item.etudiantid);
                  }}
                >
                  {item._fullname ? item._fullname : ""}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectEtudAffectation(item._id);
                  }}
                >
                  {DateUtils.toDisplay(item.startdate)}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectEtudAffectation(item._id);
                  }}
                >
                  {DateUtils.toDisplay(item.enddate)}
                </NavLink>
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
