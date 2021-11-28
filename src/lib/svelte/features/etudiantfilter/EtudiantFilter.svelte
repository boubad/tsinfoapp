<script lang="ts">
  import { Row, TabContent, TabPane } from "sveltestrap";
  import { MENU_IDENT, MENU_INFOS } from "../../InfoPrompt";
  import EtudiantFilterIdent from "./EtudiantFilterIdent.svelte";
  import EtudiantFilterInfo from "./EtudiantFilterInfo.svelte";
</script>

<div>
  <Row>
    <TabContent>
      <TabPane tabId="ident" tab={MENU_IDENT} active>
        <EtudiantFilterIdent />
      </TabPane>
      <TabPane tabId="info" tab={MENU_INFOS}>
        <EtudiantFilterInfo />
      </TabPane>
    </TabContent>
  </Row>
</div>
