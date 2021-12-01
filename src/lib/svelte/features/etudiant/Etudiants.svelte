<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_ETUDIANTS_LIST,
    ROUTE_ETUDIANT_DETAIL,
  } from "../../../../routes/routesdefs";
  import type { IDataOption } from "../../../data/IDataOption";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import {
    PaginationDataSetItemsCount,
    PaginationDataSetPage,
  } from "../../../data/PaginationUtils";
  import ListCommands from "../../components/ListCommands.svelte";
  import PageNavigator from "../../components/PageNavigator.svelte";
  import PhotoComponent from "../../components/PhotoComponent.svelte";
  import {
    COMMAND_ETUDIANT_NEW,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_PHOTO,
    TITLE_ETUDIANTS_LIST,
  } from "../../InfoPrompt";
  import {
    etudiantfilterstore,
    etudiantpaginationstore,
  } from "../../stores/EtudiantStore";
  import { SelectUtils } from "../SelectUtils";
  import { DomainConstants } from "../../../data/DomainConstants";

  //
  let items: IDataOption[] = [];
  let allItems: IDataOption[] = [];
  let pagesCount: number = 0;
  let pageSize: number = 16;
  let page: number = 1;
  let pages: number[] = [];
  //
  $: pagination = $etudiantpaginationstore;
  //
  const updatePage = (): void => {
    let opts: IDataOption[] = [];
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
        pageSize = 16;
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
  //
  const performRefresh = async (): Promise<void> => {
    const pMan = new EtudiantServices();
    pagination = $etudiantpaginationstore;
    const filter = $etudiantfilterstore;
    const aa = await pMan.getPersonsOptionsByFilterAsync({
      ...filter,
      doctype: DomainConstants.TYPE_ETUDIANT,
    });
    allItems = [...aa];
    const itemsCount = allItems.length;
    const pdata = PaginationDataSetItemsCount(pagination, itemsCount);
    pagination = { ...pdata };
    etudiantpaginationstore.set(pagination);
    updatePage();
  };
  //
  const onGotoPage = (n: number): void => {
    const pdata = PaginationDataSetPage(pagination, n);
    pagination = { ...pdata };
    etudiantpaginationstore.set(pagination);
    updatePage();
  };
  //
  const handleSelectEtudiant = (etudiantid: string): void => {
    SelectUtils.SelectEtudiant(etudiantid);
  };
  //
  const handleCreate = (): void => {
    InfoRouter(ROUTE_ETUDIANT_DETAIL);
  };
  //
  onMount(async () => {
    await performRefresh();
  });
</script>

<div>
  <Row>
    <Col class="text-center">
      <h2 class="text-center">{TITLE_ETUDIANTS_LIST}</h2>
    </Col>
  </Row>
  <Row>
    <Col class="text-center">
      <ListCommands
        cancreate={true}
        canrefresh={true}
        newbuttontext={COMMAND_ETUDIANT_NEW}
        onCreate={handleCreate}
        onRefresh={performRefresh}
      />
    </Col>
  </Row>
  {#if items.length > 0}
    <Row>
      <Col class="text-center">
        <PageNavigator
          {pages}
          {page}
          {pagesCount}
          {onGotoPage}
          lpath={ROUTE_ETUDIANTS_LIST}
        />
      </Col>
    </Row>

    <Row>
      <Col class="text-center">
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>{PROMPT_PHOTO}</th>
              <th>{PROMPT_NAME}</th>
              <th>{PROMPT_OBSERVATIONS}</th>
            </tr>
          </thead>
          <tbody>
            {#each items as item (item.value)}
              <tr>
                <td>
                  {#if item.url}
                    <PhotoComponent
                      url={item.url}
                      text={item.name}
                      height={56}
                    />
                  {/if}
                </td>
                <td>
                  <NavLink
                    on:click={() => {
                      handleSelectEtudiant(item.value);
                    }}
                  >
                    {item.name}
                  </NavLink>
                </td>
                <td>
                  {item.subTitle ? item.subTitle : ""}
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </Col>
    </Row>
  {/if}
</div>
