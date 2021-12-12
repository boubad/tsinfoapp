<script lang="ts">
  //
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_UNITE_DETAIL } from "../../../../routes/routesdefs";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import type { IUniteDoc } from "../../../data/IUniteDoc";
  import { UniteServices } from "../../../data/UniteServices";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_UNITE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SIGLE,
    TITLE_UNITES,
  } from "../../InfoPrompt";
  //
  let items: IUniteDoc[] = [];
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_UNITE_DETAIL);
  };
  //
  const handleSelectUnite = (id: string): void => {
    InfoRouter(ROUTE_UNITE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async () => {
    const pMan = new UniteServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
    const dd = await pMan.findAllItemsByFilterAsync();
    const aa = [...dd];
    if (aa.length > 1) {
      aa.sort((a, b) => {
        if (a.sigle < b.sigle) {
          return -1;
        } else if (a.sigle > b.sigle) {
          return 1;
        }
        return 0;
      });
    } // sort
    items = [...aa];
  };
  //
  onMount(async () => {
    await performRefresh();
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_UNITES}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={true}
      canrefresh={true}
      newbuttontext={COMMAND_NEW_UNITE}
      onCreate={handleCreate}
      onRefresh={performRefresh}
    />
  </Row>
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
                  handleSelectUnite(item._id);
                }}
              >
                {item.sigle}
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectUnite(item._id);
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
</div>
