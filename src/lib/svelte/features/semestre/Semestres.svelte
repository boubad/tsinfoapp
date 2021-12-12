<script lang="ts">
  //
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_SEMESTRE_DETAIL } from "../../../../routes/routesdefs";
import { CouchDBClient } from "../../../data/CouchDBClient";
import { fetchClient } from "../../../data/fetchClient";
import { infoDataUrlCreator } from "../../../data/infoDataUrlCreator";
  import type { ISemestreDoc } from "../../../data/ISemestreDoc";
  import { SemestreServices } from "../../../data/SemestreServices";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_SEMESTRE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SIGLE,
    TITLE_SEMESTRES,
  } from "../../InfoPrompt";

  //
  let items: ISemestreDoc[] = [];
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_SEMESTRE_DETAIL);
  };
  //
  const handleSelectSemestre = (id: string): void => {
    InfoRouter(ROUTE_SEMESTRE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async (): Promise<void> => {
    const pMan = new SemestreServices(new CouchDBClient(fetchClient),infoDataUrlCreator);
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
  //
  onMount(async () => {
    await performRefresh();
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_SEMESTRES}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={true}
      canrefresh={true}
      newbuttontext={COMMAND_NEW_SEMESTRE}
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
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectSemestre(item._id);
                  }}
                >
                  {item.sigle}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectSemestre(item._id);
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
