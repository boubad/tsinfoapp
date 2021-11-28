<script lang="ts">
  import { onMount } from "svelte";
  import { Row } from "sveltestrap";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { CreateEtudiant, IEtudiantDoc } from "../../../data/IEtudiantDoc";
  import { EtudiantServices } from "../../../data/EtudiantServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import { TITLE_ETUDIANT_BLOBS } from "../../InfoPrompt";

  //
  export let params: any = {};
  let blobs: IAttachedDoc[] = [];
  let etudiant: IEtudiantDoc = CreateEtudiant();
  //
  const performRefresh = async (
    id?: string,
    pMan?: EtudiantServices
  ): Promise<void> => {
    etudiant = CreateEtudiant();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new EtudiantServices();
      }
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        etudiant = { ...cc };
        blobs = cc._attachments ? [...cc._attachments] : [];
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
    const pMan = new EtudiantServices();
    const r = await pMan.saveItemAttachmentAsync(etudiant, name, mime, data);
    if (r.ok && r.item) {
      etudiant = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new EtudiantServices();
    const r = await pMan.removeItemAttachmentAsync(etudiant, name);
    if (r.ok && r.item) {
      etudiant = { ...r.item };
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
    <h2 class="ext-center">{TITLE_ETUDIANT_BLOBS}</h2>
  </Row>
  <Row>
    <PersonHeader
      url={etudiant._url}
      firstname={etudiant.firstname}
      lastname={etudiant.lastname}
    />
  </Row>
  <Row>
    <BlobInfo
      parentid={etudiant._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
