<script lang="ts">
  import { onMount } from "svelte";

  import { Row, TabContent, TabPane } from "sveltestrap";
  import {
    MENU_AFFECTATIONS_LIST,
    MENU_BLOBS,
    MENU_EVTS,
    MENU_IDENT,
    MENU_INFOS,
    MENU_NOTES,
  } from "../../InfoPrompt";
  import EtudiantAffectations from "./EtudiantAffectations.svelte";
  import EtudiantBlobs from "./EtudiantBlobs.svelte";
  import EtudiantEvts from "./EtudiantEvts.svelte";
  import EtudiantIdent from "./EtudiantIdent.svelte";
  import EtudiantInfo from "./EtudiantInfo.svelte";
  import EtudiantNotes from "./EtudiantNotes.svelte";
  //
  export let params: any = {};
  //
  let isNotPersisted: boolean = true;
  //
  const performRefresh = (id?: string): void => {
    isNotPersisted = true;
    if (id !== undefined && id !== null && id.trim().length > 0) {
      isNotPersisted = false;
    }
  }; // performRefresh
  //
  onMount(() => {
    performRefresh(params.id);
  });
  //
</script>

<div>
  <Row>
    <TabContent>
      <TabPane tabId="ident" tab={MENU_IDENT} active>
        <EtudiantIdent params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="info" tab={MENU_INFOS} disabled={isNotPersisted}>
        <EtudiantInfo params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="notes" tab={MENU_NOTES} disabled={isNotPersisted}>
        <EtudiantNotes params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="evts" tab={MENU_EVTS} disabled={isNotPersisted}>
        <EtudiantEvts params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="affs" tab={MENU_AFFECTATIONS_LIST}>
        disabled={isNotPersisted}
        <EtudiantAffectations params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={isNotPersisted}>
        <EtudiantBlobs params={{ id: params.id }} />
      </TabPane>
    </TabContent>
  </Row>
</div>
