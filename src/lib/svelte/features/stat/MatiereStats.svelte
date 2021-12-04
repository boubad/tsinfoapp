<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { ROUTE_MATIERE_STAT } from "../../../../routes/routesdefs";
  import type { IMatiereStatItem } from "../../../data/IMatiereStatItem";
  import type { IPaginationData } from "../../../data/IPaginationData";
  import {
    GetInitialPaginationData,
    PaginationDataSetItemsCount,
    PaginationDataSetPage,
  } from "../../../data/PaginationUtils";
  import { StatServices } from "../../../data/StatServices";
  import PageNavigator from "../../components/PageNavigator.svelte";
  import PhotoComponent from "../../components/PhotoComponent.svelte";
  import {
    PROMPT_EVTS,
    PROMPT_GROUPE,
    PROMPT_NAME,
    PROMPT_NOTE,
    PROMPT_OBSERVATIONS,
    PROMPT_PHOTO,
    TITLE_MATIERE_STATS,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  //
  export let params: any = {};
  let items: IMatiereStatItem[] = [];
  let allItems: IMatiereStatItem[] = [];
  let pagesCount: number = 0;
  let pageSize: number = 16;
  let page: number = 1;
  let pages: number[] = [];
  let anneeid: string = "";
  let semestreid: string = "";
  let matiereid: string = "";
  let pagination: IPaginationData = GetInitialPaginationData();
  //
  const updatePage = (): void => {
    let opts: IMatiereStatItem[] = [];
    const itemsCount = pagination.itemsCount;
    if (itemsCount > 0) {
      page = pagination.page;
      if (page < 1) {
        page = 1;
      }
      pagesCount = pagination.pagesCount;
      if (page > pagesCount) {
        page = pagesCount;
      }
      pageSize = pagination.pageSize;
      if (pageSize < 1) {
        pageSize = 8;
      }
      pages = pagination.pages;
      let offset = (page - 1) * pageSize;
      let last = offset + pageSize;
      if (last > itemsCount) {
        last = itemsCount;
      }
      for (let i = offset; i < last; i++) {
        const p = allItems[i];
        if (p !== undefined && p !== null) {
          opts.push(p);
        }
      } // i
    }
    items = [...opts];
  };
  //
  const performRefresh = async (
    annee?: string,
    semestre?: string,
    matiere?: string
  ): Promise<void> => {
    if (annee && annee.length > 0) {
      anneeid = annee;
    }
    if (semestre && semestre.length > 0) {
      semestreid = semestre;
    }
    if (matiere && matiere.length > 0) {
      matiereid = matiere;
    }
    if (semestreid.length < 1 || anneeid.length < 1 || matiereid.length < 1) {
      allItems = [];
    } else {
      const pMan = new StatServices();
      const aa = await pMan.getMatiereStats(anneeid, semestreid, matiereid);
      allItems = [...aa];
    }
    const itemsCount = allItems.length;
    pagination.pageSize = 8;
    const pdata = PaginationDataSetItemsCount(pagination, itemsCount);
    pagination = { ...pdata };
    updatePage();
  };
  //
  const onGotoPage = (n: number): void => {
    const pdata = PaginationDataSetPage(pagination, n);
    pagination = { ...pdata };
    updatePage();
  };
  //
  const onPageSizeChanged = (n: number): void => {
    if (n > 0 && n !== pagination.pageSize) {
      const pdata = { ...pagination, pageSize: n };
      pagination = { ...pdata };
      const itemsCount = allItems.length;
      const ppdata = PaginationDataSetItemsCount(pagination, itemsCount);
      pagination = { ...ppdata };
      updatePage();
    }
  };
  //
  const handleSelectEtudiant = (etudiantid: string): void => {
    SelectUtils.SelectEtudiant(etudiantid);
  };
  //
  onMount(async () => {
    await performRefresh(params.annee, params.semestre, params.matiere);
  });
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_MATIERE_STATS}</h2>
  </Row>
  {#if allItems.length > 0}
    <Row class="align-middle">
      <Col class="text-center">
        <PageNavigator
          {pages}
          {page}
          {pagesCount}
          pagesize={pagination.pageSize}
          itemsCount={pagination.itemsCount}
          {onGotoPage}
          {onPageSizeChanged}
          lpath={ROUTE_MATIERE_STAT +
            "/" +
            anneeid +
            "/" +
            semestreid +
            "/" +
            matiereid}
        />
      </Col>
    </Row>
  {/if}
  {#if items.length > 0}
    <Row>
      <Table bordered={true} striped={true}>
        <thead>
          <tr>
            <th>{PROMPT_PHOTO}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_GROUPE}</th>
            <th>{PROMPT_NOTE}</th>
            <th>{PROMPT_EVTS}</th>
            <th>{PROMPT_OBSERVATIONS}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr class="align-middle">
              <td>
                <PhotoComponent url={item.url} text={item.name} height={112} />
              </td>
              <td>
                <NavLink
                  on:click={() => {
                    handleSelectEtudiant(item.id);
                  }}
                >
                  <strong> {item.name}</strong>
                </NavLink>
              </td>
              <td>
                <strong>{item.groupe}</strong>
              </td>
              <td class="float-right">
                {#if item.note >= 0}
                  <strong> {item.note}</strong>
                {/if}
              </td>
              <td>
                {#if item.evts.length > 0}
                  <ul>
                    {#each item.evts as ev}
                      <li><strong>{ev}</strong></li>
                    {/each}
                  </ul>
                {/if}
              </td>
              <td>
                {#if item.observations.length > 0}
                  <ul>
                    {#each item.observations as o}
                      <li><strong>{o}</strong></li>
                    {/each}
                  </ul>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
