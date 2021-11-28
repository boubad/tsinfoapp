<script lang="ts">
  import { onMount } from "svelte";
  import { Row } from "sveltestrap";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import type { IGroupeControlesDoc } from "../../../data/IGroupeControlesDoc";
  import { CreateGroupeControles } from "../../../data/IGroupeControlesDoc";
  import { GroupeControlesServices } from "../../../data/GroupeControlesServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import { TITLE_ETUDIANT_BLOBS } from "../../InfoPrompt";
  //

  export let params: any = {};
  //
  let groupecontroles: IGroupeControlesDoc = CreateGroupeControles();
  //
  let blobs: IAttachedDoc[] = [];
  //
  const performRefresh = async (
    id?: string,
    pMan?: GroupeControlesServices
  ): Promise<void> => {
    groupecontroles = CreateGroupeControles();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new GroupeControlesServices();
      }
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        groupecontroles = { ...cc };
        blobs = cc._attachments
          ? [...cc._attachments]
          : [];
      } // cc
    } // id
  };
  //
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new GroupeControlesServices();
    const r = await pMan.saveItemAttachmentAsync(
      groupecontroles,
      name,
      mime,
      data
    );
    if (r.ok && r.item) {
      groupecontroles = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new GroupeControlesServices();
    const r = await pMan.removeItemAttachmentAsync(groupecontroles, name);
    if (r.ok && r.item) {
      groupecontroles = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
    }
  };
  //
  onMount(async () => {
    await performRefresh(params.id);
  });
  //
</script>

<div>
  <Row>
    <h2 class="text-center">{TITLE_ETUDIANT_BLOBS}</h2>
  </Row>
  <Row>
    <BlobInfo
      parentid={groupecontroles._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
