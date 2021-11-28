<script lang="ts">
  import { onMount } from "svelte";
  import { Row } from "sveltestrap";
  import { ControleServices } from "../../../data/ControleServices ";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { CreateControle, IControleDoc } from "../../../data/IControleDoc";
  import BlobInfo from "../../components/BlobInfo.svelte";
  //
  export let params: any = {};
  //
  let controle: IControleDoc = CreateControle();
  let blobs: IAttachedDoc[] = [];
  let controletitle: string = "";
  //
  const performRefresh = async (
    id?: string,
    pMan?: ControleServices
  ): Promise<void> => {
    controle = CreateControle();
    blobs = [];
    if (id && id.trim().length > 0) {
      if (!pMan) {
        pMan = new ControleServices();
      }
      const cc = await pMan.findItemByIdAsync(id);
      if (cc) {
        controle = { ...cc };
        blobs = cc._attachments ? [...cc._attachments] : [];
      } // cc
    } // id
    controletitle = controle._groupeControlesSigle
      ? controle._groupeControlesSigle
      : "";
  };
  //
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new ControleServices();
    const r = await pMan.saveItemAttachmentAsync(controle, name, mime, data);
    if (r.ok && r.item) {
      controle = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new ControleServices();
    const r = await pMan.removeItemAttachmentAsync(controle, name);
    if (r.ok && r.item) {
      controle = { ...r.item };
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
    <h2 class="text-center">{controletitle}</h2>
  </Row>
  <Row>
    <BlobInfo
      parentid={controle._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
