<script lang="ts">
  import { onMount } from "svelte";

  import { Row, TabContent, TabPane } from "sveltestrap";
  import { MENU_BLOBS, MENU_INFOS } from "../../InfoPrompt";
  import GroupeControleBlobs from "./GroupeControleBlobs.svelte";
  import GroupeControleInfo from "./GroupeControleInfo.svelte";
  //
  export let params: any = {};
  //
  let groupecontrolesid: string = "";
  let isNotPersisted: boolean = true;
  //
  const performRefresh = (id?: string): void => {
    isNotPersisted = true;
    groupecontrolesid = "";
    if (id && id.trim().length > 0) {
      groupecontrolesid = id;
      isNotPersisted = false;
    }
  }; // performRefresh
  //
  onMount(async () => {
    performRefresh(params.id);
  });
</script>

<div>
  <Row>
    <TabContent>
      <TabPane tabId="info" tab={MENU_INFOS} active>
        <GroupeControleInfo params={{ id: groupecontrolesid }} />
      </TabPane>
      <TabPane tabId="blobs" tab={MENU_BLOBS} disabled={isNotPersisted}>
        <GroupeControleBlobs params={{ id: groupecontrolesid }} />
      </TabPane>
    </TabContent>
  </Row>
</div>
