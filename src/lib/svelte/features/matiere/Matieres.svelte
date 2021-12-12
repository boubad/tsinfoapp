<script lang="ts">
  import { onMount } from "svelte";
  //
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_MATIERE_CREATE, ROUTE_MATIERE_DETAIL } from "../../../../routes/routesdefs";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
  import type { IMatiereDoc } from "../../../data/IMatiereDoc";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import { MatiereServices } from "../../../data/MatiereServices";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_MATIERE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SIGLE,
    PROMPT_UNITE,
    TITLE_MATIERES,
  } from "../../InfoPrompt";
  //
  export let params: any = {};
  let items: IMatiereDoc[] = [];
  let uniteid: string = "";
  //
  const handleCreate = () => {
    InfoRouter(ROUTE_MATIERE_CREATE + "/" + uniteid);
  };
  //
  const handleSelectMatiere = (id: string): void => {
    InfoRouter(ROUTE_MATIERE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    if (id && id.length > 0) {
      uniteid = id;
    }
    if (uniteid.length < 1) {
      items = [];
    } else {
      const pMan = new MatiereServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
      const aa = await pMan.findAllItemsByFilterAsync({ uniteid });
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
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.unite);
  });
  //
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_MATIERES}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={uniteid.length > 0}
      canrefresh={true}
      newbuttontext={COMMAND_NEW_MATIERE}
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
            <th>{PROMPT_UNITE}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectMatiere(item._id);
                  }}
                >
                  {item.sigle}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectMatiere(item._id);
                  }}
                >
                  {item.name}
                </NavLink>
              </td>
              <td>
                {item.observations}
              </td>
              <td>
                {item._uniteSigle ? item._uniteSigle : ""}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
