<script lang="ts">
  import { TabContent, TabPane } from "sveltestrap";
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
  $: isPersisted = params.id && params.id.length > 0;
  //
</script>

<TabContent>
  <TabPane tabId="ident" tab={MENU_IDENT} active>
    <EtudiantIdent {params} />
  </TabPane>
  <TabPane tabId="info" tab={MENU_INFOS} disabled={!isPersisted}>
    <EtudiantInfo {params} />
  </TabPane>
  <TabPane tabId="notes" tab={MENU_NOTES} disabled={!isPersisted}>
    <EtudiantNotes {params} />
  </TabPane>
  <TabPane tabId="evts" tab={MENU_EVTS} disabled={!isPersisted}>
    <EtudiantEvts {params} />
  </TabPane>
  <TabPane tabId="affs" tab={MENU_AFFECTATIONS_LIST}  disabled={!isPersisted}>
    <EtudiantAffectations {params} />
  </TabPane>
  <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={!isPersisted}>
    <EtudiantBlobs {params} />
  </TabPane>
</TabContent>
