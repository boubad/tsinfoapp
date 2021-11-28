<script lang="ts">
  //
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_ANNEE_DETAIL } from "../../../../routes/routesdefs";
  import type { IAnneeDoc } from "../../../data/IAnneeDoc";
  import { AnneeServices } from "../../../data/AnneeServices";
  import ListCommands from "../../components/ListCommands.svelte";
  import {
    COMMAND_NEW_ANNEE,
    PROMPT_ENDDATE,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_SIGLE,
    PROMPT_STARTDATE,
    TITLE_ANNEES,
  } from "../../InfoPrompt";
  import { DateUtils } from "../../../data/DateUtils";
  //
  let items: IAnneeDoc[] = [];
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_ANNEE_DETAIL);
  };
  //
  const handleSelectAnnee = (id: string): void => {
    InfoRouter(ROUTE_ANNEE_DETAIL + "/" + id);
  };
  //
  const performRefresh = async (): Promise<void> => {
    const pMan = new AnneeServices();
    const dd = await pMan.findAllItemsByFilterAsync();
    const aa = [...dd];
    if (aa.length > 1) {
      aa.sort((a, b) => {
        if (a.startdate < b.startdate) {
          return 1;
        } else if (a.startdate > b.startdate) {
          return -1;
        }
        if (a.enddate < b.enddate) {
          return -1;
        } else if (a.enddate > b.enddate) {
          return 1;
        }
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
    <h2 class="text-center">{TITLE_ANNEES}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={true}
      canrefresh={true}
      newbuttontext={COMMAND_NEW_ANNEE}
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
            <th>{PROMPT_STARTDATE}</th>
            <th>{PROMPT_ENDDATE}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectAnnee(item._id);
                  }}
                >
                  {item.sigle}
                </NavLink>
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectAnnee(item._id);
                  }}
                >
                  {item.name}
                </NavLink>
              </td>
              <td>
                {item.observations}
              </td>
              <td>
                {DateUtils.toDisplay(item.startdate)}
              </td>
              <td>
                {DateUtils.toDisplay(item.enddate)}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
