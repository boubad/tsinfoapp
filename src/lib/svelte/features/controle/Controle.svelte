<script lang="ts">
  import { onMount } from "svelte";

  import { Row, TabContent, TabPane } from "sveltestrap";
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
  let isNotPersisted: boolean = true;
  //
  onMount(() => {
    isNotPersisted = true;
    if (params.id !== undefined && params.id !== null) {
      const s = params.id as string;
      if (s.trim().length > 0) {
        isNotPersisted = false;
      }
    }
  });
</script>

<div>
  <Row>
    <TabContent>
      <TabPane tabId="info" tab={MENU_INFOS} active>
        <ControleInfo params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="notes" tab={MENU_NOTES} disabled={isNotPersisted}>
        <ControleNotes params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="evts" tab={MENU_EVTS} disabled={isNotPersisted}>
        <ControleEvts params={{ id: params.id }} />
      </TabPane>
      <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={isNotPersisted}>
        <ControleBlobs params={{ id: params.id }} />
      </TabPane>
    </TabContent>
  </Row>
</div>
