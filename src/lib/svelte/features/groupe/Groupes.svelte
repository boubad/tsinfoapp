<script lang="ts">
  import { onMount } from "svelte";

  //
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_GROUPE_DETAIL } from "../../../../routes/routesdefs";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
  import { GroupeServices } from "../../../data/GroupeServices";
  import type { IGroupeDoc } from "../../../data/IGroupeDoc";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_GROUPE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SEMESTRE,
    PROMPT_SIGLE,
    TITLE_GROUPES,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let items: IGroupeDoc[] = [];
  let semestreid: string = "";
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_GROUPE_DETAIL);
  };
  //
  const handleSelectGroupe = (id: string): void => {
    InfoRouter(ROUTE_GROUPE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    if (id && id.length > 0) {
      semestreid = id;
    }
    if (semestreid.length > 0) {
      const pMan = new GroupeServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      const aa = await pMan.findAllItemsByFilterAsync({
        semestreid,
      });
      const dd = [...aa];
      if (dd.length > 1) {
        dd.sort((a, b) => {
          if (a.sigle < b.sigle) {
            return -1;
          } else if (a.sigle > b.sigle) {
            return 1;
          } else {
            return 0;
          }
        });
      } // sort
      items = [...aa];
    } else {
      items = [];
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.semestre);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_GROUPES}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={semestreid.length > 0}
      canrefresh={true}
      newbuttontext={COMMAND_NEW_GROUPE}
      onCreate={handleCreate}
      onRefresh={performRefresh}
    />
  </Row>
  {#if items.length > 0}
    <Row>
      <Table bordered={true} hover={true}>
        <thead>
          <tr>
            <th>{PROMPT_SIGLE}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_OBSERVATIONS}</th>
            <th>{PROMPT_SEMESTRE}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectGroupe(item._id);
                  }}
                >
                  {item.sigle}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectGroupe(item._id);
                  }}
                >
                  {item.name}
                </NavLink>
              </td>
              <td>
                {item.observations}
              </td>
              <td>
                {item._semestreSigle ? item._semestreSigle : ""}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
