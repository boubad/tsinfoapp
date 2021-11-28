<script lang="ts">
  //
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import {
ROUTE_ETUDAFFECTATIONS_CREATE,
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
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_PHOTO,
  } from "../../InfoPrompt";
  import {
    etudiantfilterstore,
    etudiantpaginationstore,
  } from "../../stores/EtudiantStore";
  import { SelectUtils } from "../SelectUtils";
  import { DomainConstants } from "../../../data/DomainConstants";
  import InputCheck from "../../components/InputCheck.svelte";
  import { AnneeServices } from "../../../data/AnneeServices";
  import { EtudAffectationServices } from "../../../data/EtudAffectationServices";
  import { CreateEtudAffectation } from "../../../data/IEtudAffectation";

  //
  export let params: any = {};
  let items: IDataOption[] = [];
  let allItems: IDataOption[] = [];
  let pagesCount: number = 0;
  let pageSize: number = 16;
  let page: number = 1;
  let pages: number[] = [];
  let canCreate: boolean = false;
  let ids: string[] = [];
  let anneeid: string = "";
  let groupeid: string = "";
  let startdate: string = "";
  let enddate: string = "";
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
  const getCurrentIds = async (
    annee: string,
  ): Promise<string[]> => {
      const vret:string[] = [];
    const pMan = new EtudAffectationServices();
    const dd = await pMan.datastore.findAllDocsBySelectorAsync(
      {
        doctype: DomainConstants.TYPE_ETUDAFFECTATION,
        anneeid: annee,
      },
      [DomainConstants.FIELD_ETUDIANTID]
    );
    const n = dd.length;
    for (let i = 0; i < n; i++){
        const p = dd[i];
        if (p.etudiantid){
            vret.push(p.etudiantid as string);
        }
    }// i
    return vret;
  }; // getCurrentIds
  //
  const performRefresh = async (
    annee?: string,
    groupe?: string
  ): Promise<void> => {
    if (annee && annee.length > 0) {
      anneeid = annee;
      const pf = new AnneeServices();
      const a = await pf.findItemByIdAsync(anneeid);
      if (a) {
        startdate = a.startdate;
        enddate = a.enddate;
      }
    }
    if (groupe && groupe.length > 0) {
      groupeid = groupe;
    }
    ids = [];
    const pMan = new EtudiantServices();
    pagination = $etudiantpaginationstore;
    const filter = $etudiantfilterstore;
    const aa = await pMan.getPersonsOptionsByFilterAsync({
      ...filter,
      doctype: DomainConstants.TYPE_ETUDIANT,
    });
     const vv = await getCurrentIds(anneeid);
     const bb: IDataOption[] = [];
     const n = aa.length;
     const m = vv.length;
     for (let i = 0; i < n; i++){
        const p = aa[i];
        const sid = p.value;
        let found = false;
        for (let j = 0; j < m; j++){
          const s = vv[j];
           if (sid === s){
             found = true;
             break;
           }
        }// j
        if (!found){
            bb.push(p);
        }
     }// i
    allItems = [...bb];
    const itemsCount = allItems.length;
    const pdata = PaginationDataSetItemsCount(pagination, itemsCount);
    pagination = { ...pdata };
    etudiantpaginationstore.set(pagination);
    updatePage();
    canCreate = ids.length > 0 && anneeid.length > 0 && groupeid.length > 0;
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
  const handleCreate = async (): Promise<void> => {
    const n = ids.length;
    const pMan = new EtudAffectationServices();
    for (let i = 0; i < n; i++) {
      const p = CreateEtudAffectation(anneeid, groupeid, ids[i]);
      p.startdate = startdate;
      p.enddate = enddate;
      const r = await pMan.saveItemAsync(p);
      if (!r.ok) {
        break;
      }
    } // i
    await performRefresh(anneeid, groupeid);
  }; // handleCreate
  //
  const onSelectionChanged = (val: boolean, name: string): void => {
    const n = items.length;
    for (let i = 0; i < n; i++) {
      const p = items[i];
      const id = p.value;
      if (id === name) {
        p.selected = val;
        if (val) {
          const dd = [...ids];
          dd.push(name);
          ids = [...dd];
        } else {
          const dd: string[] = [];
          const m = ids.length;
          for (let j = 0; j < m; j++) {
            const x = ids[j];
            if (x !== id) {
              dd.push(x);
            }
          } // j
          ids = [...dd];
        }
        break;
      }
    } // i
    canCreate = ids.length > 0 && anneeid.length > 0 && groupeid.length > 0;
  }; // onSelectionChanged
  //
  onMount(async () => {
    await performRefresh(params.annee, params.groupe);
  });
</script>

<div>
  <Row>
    <h2 class="text-center">{"Création affectations étudiants"}</h2>
  </Row>
  <Row>
    <ListCommands
      cancreate={canCreate}
      canrefresh={true}
      newbuttontext={"Enregistrer"}
      onCreate={handleCreate}
      onRefresh={performRefresh}
    />
  </Row>
  {#if items.length > 0}
    <Row>
      <PageNavigator
        {pages}
        {page}
        {pagesCount}
        {onGotoPage}
        lpath={ROUTE_ETUDAFFECTATIONS_CREATE + "/" + anneeid + "/" + groupeid }
      />
    </Row>

    <Row>
      <Table bordered={true} striped={true}>
        <thead>
          <tr>
            <th>{"Sélection"}</th>
            <th>{PROMPT_PHOTO}</th>
            <th>{PROMPT_NAME}</th>
            <th>{PROMPT_OBSERVATIONS}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.value)}
            <tr>
              <td>
                <InputCheck
                  name={item.value}
                  value={item.selected ? item.selected : false}
                  onValueChanged={onSelectionChanged}
                />
              </td>
              <td>
                {#if item.url}
                  <PhotoComponent url={item.url} text={item.name} height={56} />
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
    </Row>
  {/if}
</div>
