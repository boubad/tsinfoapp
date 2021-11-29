<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Row, Table } from "sveltestrap";
  import { ROUTE_ETUDAFFECTATIONS_CREATE } from "../../../../routes/routesdefs";
  import type { IDataOption } from "../../../data/IDataOption";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import {
    GetInitialPaginationData,
    PaginationDataSetItemsCount,
    PaginationDataSetPage,
  } from "../../../data/PaginationUtils";
  import ListCommands from "../../components/ListCommands.svelte";
  import PageNavigator from "../../components/PageNavigator.svelte";
  import { etudiantfilterstore } from "../../stores/EtudiantStore";
  import { DomainConstants } from "../../../data/DomainConstants";
  import { AnneeServices } from "../../../data/AnneeServices";
  import { EtudAffectationServices } from "../../../data/EtudAffectationServices";
  import { CreateEtudAffectation } from "../../../data/IEtudAffectation";
  import type { IPaginationData } from "../../../data/IPaginationData";
  import ItemOption from "../../components/ItemOption.svelte";

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
  let pagination: IPaginationData = GetInitialPaginationData();
  //
  const performRefresh = async (
    annee?: string,
    groupe?: string
  ): Promise<void> => {
    ids = [];
    items = [];
    allItems = [];
    startdate = "";
    enddate = "";
    anneeid = "";
    groupeid = "";
    if (annee && annee.length > 0) {
      anneeid = annee;
      const pf = new AnneeServices();
      const a = await pf.findItemByIdAsync(anneeid);
      if (a) {
        startdate = a.startdate;
        enddate = a.enddate;
      }
    } // anneeid
    if (groupe && groupe.length > 0) {
      groupeid = groupe;
    } // groupeid
    if (anneeid.length > 0 && groupeid.length > 0) {
      const pMan = new EtudiantServices();
      const filter = $etudiantfilterstore;
      const aa = await pMan.getPersonsOptionsByFilterAsync({
        ...filter,
        doctype: DomainConstants.TYPE_ETUDIANT,
      });
      const vv = await getCurrentIds(anneeid);
      const bb: IDataOption[] = [];
      const n = aa.length;
      const m = vv.length;
      for (let i = 0; i < n; i++) {
        const p = aa[i];
        const sid = p.value;
        let found = false;
        for (let j = 0; j < m; j++) {
          const s = vv[j];
          if (sid === s) {
            found = true;
            break;
          }
        } // j
        if (!found) {
          bb.push(p);
        }
      } // i
      allItems = [...bb];
      const itemsCount = allItems.length;
      const pdata = PaginationDataSetItemsCount(pagination, itemsCount);
      pagination = { ...pdata };
      updatePage();
    } // anneeid && groupeid
    canCreate = ids.length > 0 && anneeid.length > 0 && groupeid.length > 0;
  };
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
  const getCurrentIds = async (annee: string): Promise<string[]> => {
    const vret: string[] = [];
    const pMan = new EtudAffectationServices();
    const dd = await pMan.datastore.findAllDocsBySelectorAsync(
      {
        doctype: DomainConstants.TYPE_ETUDAFFECTATION,
        anneeid: annee,
      },
      [DomainConstants.FIELD_ETUDIANTID]
    );
    const n = dd.length;
    for (let i = 0; i < n; i++) {
      const p = dd[i];
      if (p.etudiantid) {
        vret.push(p.etudiantid as string);
      }
    } // i
    return vret;
  }; // getCurrentIds
  //
  const onGotoPage = (n: number): void => {
    const pdata = PaginationDataSetPage(pagination, n);
    pagination = { ...pdata };
    updatePage();
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
  {#if items.length > 0}
    <Row>
      <ListCommands
        cancreate={canCreate}
        canrefresh={true}
        newbuttontext={"Enregistrer"}
        onCreate={handleCreate}
        onRefresh={performRefresh}
      />
    </Row>
    <Row>
      <PageNavigator
        {pages}
        {page}
        {pagesCount}
        {onGotoPage}
        lpath={ROUTE_ETUDAFFECTATIONS_CREATE + "/" + anneeid + "/" + groupeid}
      />
    </Row>
    <Row>
      <Table bordered={true} striped={true}>
        <thead>
          <tr>
            <th>{"Etudiants"}</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.value)}
            <tr>
              <td>
                <ItemOption
                  name={item.value}
                  url={item.url}
                  label={item.name}
                  subTitle={item.subTitle}
                  {onSelectionChanged}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Row>
  {/if}
</div>
