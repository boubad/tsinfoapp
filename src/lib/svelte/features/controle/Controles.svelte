<script lang="ts">
  import { onMount } from "svelte";

  //
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_GROUPECONTROLE_CREATE,
    ROUTE_GROUPECONTROLE_DETAIL,
  } from "../../../../routes/routesdefs";
  import { ControleServices } from "../../../data/ControleServices ";
  import { DateUtils } from "../../../data/DateUtils";
  import type { IControleDoc } from "../../../data/IControleDoc";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_CONTROLE_NEW,
    PROMPT_DATE,
    PROMPT_GROUPE,
    PROMPT_GROUPECONTROLES,
    PROMPT_NAME,
    TITLE_CONTROLES_LIST,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  //
  export let params: any = {};
  let items: IControleDoc[] = [];
  let anneeid: string = "";
  let groupeid: string = "";
  let semestreid: string = "";
  let matiereid: string = "";
  //
  const handleCreate = (): void => {
    InfoRouter(
      ROUTE_GROUPECONTROLE_CREATE +
        "/" +
        anneeid +
        "/" +
        semestreid +
        "/" +
        matiereid +
        "/" +
        groupeid
    );
  };
  //
  const handleSelectControle = (controleid: string): void => {
    SelectUtils.SelectControle(controleid);
  };
  const handleSelectGroupeControle = (groupecontroleid: string): void => {
    InfoRouter(ROUTE_GROUPECONTROLE_DETAIL + "/" + groupecontroleid);
  };
  //
  const performRefresh = async (
    annee?: string,
    groupe?: string,
    semestre?: string,
    matiere?: string
  ): Promise<void> => {
    if (annee && annee.length > 0) {
      anneeid = annee;
    }
    if (groupe && groupe.length > 0) {
      groupeid = groupe;
    }
    if (semestre && semestre.length > 0) {
      semestreid = semestre;
    }
    if (matiere && matiere.length > 0) {
      matiereid = matiere;
    }
    if (groupeid.length < 1 || anneeid.length < 1) {
      items = [];
    } else {
      const pMan = new ControleServices();
      const dd = await pMan.findAllItemsByFilterAsync({ anneeid, groupeid });
      const aa = [...dd];
      if (aa.length > 1) {
        aa.sort((a, b) => {
          if (a.date > b.date) {
            return -1;
          } else if (a.date < b.date) {
            return 1;
          }
          return 0;
        });
      } // sort
      items = [...aa];
    }
  };
  //
  onMount(async () => {
    await performRefresh(
      params.annee,
      params.groupe,
      params.semestre,
      params.matiere
    );
  });
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_CONTROLES_LIST}</h2>
  </Row>
  <Row>
    <Col class="center">
    <ListCommands
      cancreate={anneeid.length > 0 && groupeid.length > 0}
      canrefresh={anneeid.length > 0 && groupeid.length > 0}
      newbuttontext={COMMAND_CONTROLE_NEW}
      onCreate={handleCreate}
      onRefresh={performRefresh}
    />
    </Col>
  </Row>
  {#if items.length > 0}
    <Row>
      <Table bordered={true} striped={true}>
        <thead>
          <tr>
            <th>{PROMPT_DATE}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_GROUPECONTROLES}</th>
            <th>{PROMPT_GROUPE}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectControle(item._id);
                  }}
                >
                  {DateUtils.toDisplay(item.date)}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectControle(item._id);
                  }}
                >
                  {item._name}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectGroupeControle(item.groupecontroleid);
                  }}
                >
                  {item._groupeControlesSigle}
                </NavLink>
              </td>
              <td>
                {item._groupeSigle}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
