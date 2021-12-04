<script lang="ts">
  //
  import { onMount } from "svelte";
  import { Button, Col, NavLink, Row, Table } from "sveltestrap";
  import { InfoRouter } from "../../../../routes/InfoRouter";
  import {
    ROUTE_EVT_CREATE,
    ROUTE_EVT_DETAIL,
  } from "../../../../routes/routesdefs";
  import { ControleServices } from "../../../data/ControleServices ";
  import { EvtServices } from "../../../data/EvtServices";
  import { ConvertEvtTypeToString } from "../../../data/EvtType";
  import { CreateControle, IControleDoc } from "../../../data/IControleDoc";
  import type { IEvtDoc } from "../../../data/IEvtDoc";
  import PhotoComponent from "../../components/PhotoComponent.svelte";
  import {
    COMMAND_SELECT,
    MENU_NEW_EVT,
    PROMPT_ACTION,
    PROMPT_EVT,
    PROMPT_NAME,
    PROMPT_OBSERVATIONS,
    PROMPT_PHOTO,
  } from "../../InfoPrompt";
  import { SelectUtils } from "../SelectUtils";
  //
  export let params: any = {};
  //
  let controle: IControleDoc = CreateControle();
  let items: IEvtDoc[] = [];
  let controletitle: string = "";
  //
  const getControleTitle = (): string => {
    const s1 = controle._groupeSigle ? controle._groupeSigle : "";
    const s2 = controle._groupeControlesSigle
      ? controle._groupeControlesSigle
      : "";
    return s1 + " - " + s2;
  };
  //
  const _checkVars = (): void => {
    controletitle = getControleTitle();
  };
  //
  const performRefresh = async (id?: string): Promise<void> => {
    controle = CreateControle();
    items = [];
    if (id && id.trim().length > 0) {
      const pCont = new ControleServices();
      const cc = await pCont.findItemByIdAsync(id);
      if (cc) {
        controle = { ...cc };
        const pMan = new EvtServices();
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
        items = [...aa];
      } // cc
    } // id
    _checkVars();
  }; // performRefresh
  //
  const handleSelectEtudiant = (etudiantid: string): void => {
    SelectUtils.SelectEtudiant(etudiantid);
  };
  //
  const handleCreate = (): void => {
    const spath = ROUTE_EVT_CREATE + "/" + controle._id;
    InfoRouter(spath);
  };
  //
  const handleSelectEvt = (evtid: string) => {
    InfoRouter(ROUTE_EVT_DETAIL + "/" + evtid);
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{controletitle}</h2>
  </Row>
  <Row>
    <Col class="text-center">
      <Button color="secondary" on:click={handleCreate}>
        {MENU_NEW_EVT}
      </Button>
    </Col>
  </Row>
  <Row>
    <Table bordered={true} striped={true}>
      <thead>
        <tr>
          <th>{PROMPT_PHOTO}</th>
          <th>{PROMPT_NAME}</th>
          <th>{PROMPT_EVT}</th>
          <th>{PROMPT_OBSERVATIONS}</th>
          <th>{PROMPT_ACTION}</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr class="align-middle">
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEtudiant(item.etudiantid);
                }}
              >
                <PhotoComponent
                  url={item._url}
                  text={item._fullname ? item._fullname : ""}
                />
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEtudiant(item.etudiantid);
                }}
              >
                <strong>{item._fullname ? item._fullname : ""}</strong>
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEvt(item._id);
                }}
              >
                <strong>{ConvertEvtTypeToString(item.evttype)}</strong>
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEvt(item._id);
                }}
              >
                <strong>{item.observations ? item.observations : ""}</strong>
              </NavLink>
            </td>
            <td>
              <NavLink
                on:click={() => {
                  handleSelectEvt(item._id);
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
