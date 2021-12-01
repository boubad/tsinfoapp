<script lang="ts">
  import { TabContent, TabPane } from "sveltestrap";
  import {
    MENU_BLOBS,
    MENU_EVTS,
    MENU_INFOS,
    MENU_NOTES,
  } from "../../InfoPrompt";
  import ControleBlobs from "./ControleBlobs.svelte";
  import ControleEvts from "./ControleEvts.svelte";
  import ControleInfo from "./ControleInfo.svelte";
  import ControleNotes from "./ControleNotes.svelte";
  //
  export let params: any = {};
  //
  $: isPersisted = params.id && params.id.length > 0;
  //
</script>

<TabContent>
  <TabPane tabId="info" tab={MENU_INFOS} active>
    <ControleInfo {params} />
  </TabPane>
  <TabPane tabId="notes" tab={MENU_NOTES} disabled={!isPersisted}>
    <ControleNotes {params} />
  </TabPane>
  <TabPane tabId="evts" tab={MENU_EVTS} disabled={!isPersisted}>
    <ControleEvts {params} />
  </TabPane>
  <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={!isPersisted}>
    <ControleBlobs {params} />
  </TabPane>
</TabContent>
