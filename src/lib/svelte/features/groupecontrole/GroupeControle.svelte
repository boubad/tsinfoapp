<script lang="ts">
  import { TabContent, TabPane } from "sveltestrap";
  import { MENU_BLOBS, MENU_INFOS } from "../../InfoPrompt";
  import GroupeControleBlobs from "./GroupeControleBlobs.svelte";
  import GroupeControleInfo from "./GroupeControleInfo.svelte";
  //
  export let params: any = {};
  //
  $: isPersisted = params.id && params.id.length > 0;
  //
</script>

<TabContent>
  <TabPane tabId="info" tab={MENU_INFOS} active>
    <GroupeControleInfo {params} />
  </TabPane>
  <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={!isPersisted}>
    <GroupeControleBlobs {params} />
  </TabPane>
</TabContent>
