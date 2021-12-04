<script lang="ts">
  import { onMount } from "svelte";
  import { NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import { ROUTE_NOTE_DETAIL } from "../../../../routes/routesdefs";
  import { ControleServices } from "../../../data/ControleServices ";
  import { CreateControle, IControleDoc } from "../../../data/IControleDoc";
  import type { INoteDoc } from "../../../data/INoteDoc";
  import type { IPaginationData } from "../../../data/IPaginationData";
  import { NoteServices } from "../../../data/NoteServices";
  import {
    GetInitialPaginationData,
    PaginationDataSetItemsCount,
    PaginationDataSetPage,
  } from "../../../data/PaginationUtils";
  import PageNavigator from "../../components/PageNavigator.svelte";
  import PhotoComponent from "../../components/PhotoComponent.svelte";
  import {
    COMMAND_SELECT,
    PROMPT_ACTION,
    PROMPT_NAME,
    PROMPT_NOTE,
    PROMPT_OBSERVATIONS,
    PROMPT_PHOTO,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  //
  export let params: any = {};
  //
  let controle: IControleDoc = CreateControle();
  let items: INoteDoc[] = [];
  let allnotes: INoteDoc[] = [];
  let pagination: IPaginationData = GetInitialPaginationData();
  let controletitle: string = "";
  let pagesCount: number = 0;
  let pageSize: number = 16;
  let page: number = 1;
  let pages: number[] = [];
  //
  const _checkVars = (): void => {
    controletitle = controle._groupeControlesSigle
      ? controle._groupeControlesSigle
      : "";
    pagesCount = pagination.pagesCount;
    pageSize = pagination.pageSize;
    page = pagination.page;
    pages = pagination.pages;
  };
  //
  const updatePage = (): void => {
    let opts: INoteDoc[] = [];
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
      let offset = (page - 1) * pageSize;
      let last = offset + pageSize;
      if (last > itemsCount) {
        last = itemsCount;
      }
      for (let i = offset; i < last; i++) {
        const p = allnotes[i];
        if (p !== undefined && p !== null) {
          opts.push(p);
        }
      } // i
    }
    items = opts;
    _checkVars();
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    controle = CreateControle();
    allnotes = [];
    let itemsCount = 0;
    if (id && id.trim().length > 0) {
      const pCont = new ControleServices();
      const cc = await pCont.findItemByIdAsync(id);
      if (cc) {
        controle = { ...cc };
        const pMan = new NoteServices();
        const dd = await pMan.findAllItemsByFilterAsync({
          controleid: controle._id,
        });
        const aa = [...dd];
        if (aa.length > 1) {
          aa.sort((a, b) => {
            const s1 = a._fullname ? a._fullname : "";
            const s2 = b._fullname ? b._fullname : "";
            if (s1 < s2) {
              return -1;
            } else if (s1 > s2) {
              return 1;
            }
            return 0;
          });
        } // sort
        allnotes = [...aa];
      }
    }
    itemsCount = allnotes.length;
    pagination = PaginationDataSetItemsCount(pagination, itemsCount);
    updatePage();
  }; // performRefresh
  //
  const onGotoPage = (n: number): void => {
    pagination = PaginationDataSetPage(pagination, n);
    updatePage();
  };
  //
  const handleSelectEtudiant = (etudiantid: string): void => {
    SelectUtils.SelectEtudiant(etudiantid);
  };
  //
  const handleSelectNote = async (noteid: string) => {
    InfoRouter(ROUTE_NOTE_DETAIL + "/" + noteid);
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
</script>

<div>
  <Row>
    <h2 class="text-center">{controletitle}</h2>
  </Row>
  <Row>
    <PageNavigator {page} {pagesCount} {onGotoPage} {pages} />
  </Row>
  <Row>
    <Table bordered={true} striped={true}>
      <thead>
        <tr>
          <th>{PROMPT_PHOTO}</th>
          <th>{PROMPT_NAME}</th>
          <th>{PROMPT_NOTE}</th>
          <th>{PROMPT_OBSERVATIONS}</th>
          <th>{PROMPT_ACTION}</th>
        </tr>
      </thead>
      <tbody>
        {#each items as note}
          <tr class="align-middle">
            <td>
              <PhotoComponent
                url={note._url}
                text={note._fullname ? note._fullname : ""}
              />
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEtudiant(note.etudiantid);
                }}
              >
                {note._fullname ? note._fullname : ""}
              </NavLink>
            </td>
            <td class="float-right">
              {note.value !== undefined && note.value !== null
                ? "" + note.value
                : ""}
            </td>
            <td>{note.observations ? note.observations : ""}</td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectNote(note._id);
                }}
              >
                {COMMAND_SELECT}
              </NavLink>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </Row>
</div>
