<script lang="ts">
  import { onMount } from "svelte";
  //
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_GROUPECONTROLE_CREATE,
    ROUTE_GROUPECONTROLE_DETAIL,
  } from "../../../../routes/routesdefs";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
  import { GroupeControlesServices } from "../../../data/GroupeControlesServices";
  import type { IGroupeControlesDoc } from "../../../data/IGroupeControlesDoc";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_GROUPEDONTROLE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SIGLE,
    TITLE_GROUPESCONTROLES,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let canCreate: boolean = false;
  //
  let semestreid: string = "";
  let matiereid: string = "";
  let items: IGroupeControlesDoc[] = [];
  //
  const handleCreate = (): void => {
    InfoRouter(
      ROUTE_GROUPECONTROLE_CREATE + "/" + semestreid + "/" + matiereid
    );
  };
  //
  const handleSelectGroupeControle = (id: string): void => {
    InfoRouter(ROUTE_GROUPECONTROLE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async (sem?: string, mat?: string): Promise<void> => {
    canCreate = false;
    items = [];
    if (sem && sem.length > 0) {
      semestreid = sem;
    }
    if (mat && mat.length > 0) {
      matiereid = mat;
    }
    if (semestreid.length > 0 && matiereid.length > 0) {
      const pMan = new GroupeControlesServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      const aa = await pMan.findAllItemsByFilterAsync({
        matiereid,
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
      items = [...dd];
      canCreate = true;
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.semestre, params.matiere);
  });
  //
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_GROUPESCONTROLES}</h2>
  </Row>
  <Row>
    <Col class="text-center">
      <ListCommands
        cancreate={canCreate}
        canrefresh={canCreate}
        newbuttontext={COMMAND_NEW_GROUPEDONTROLE}
        onCreate={handleCreate}
        onRefresh={performRefresh}
      />
    </Col>
  </Row>
  {#if items.length > 0}
    <Row>
      <Table bordered={true} hover={true}>
        <thead>
          <tr>
            <th>{PROMPT_SIGLE}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_OBSERVATIONS}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectGroupeControle(item._id);
                  }}
                >
                  {item.sigle}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectGroupeControle(item._id);
                  }}
                >
                  {item.name}
                </NavLink>
              </td>
              <td>
                {item.observations}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
