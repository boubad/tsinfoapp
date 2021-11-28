<script lang="ts">
  import { onMount } from "svelte";
  import { Form, Row } from "sveltestrap";
  import { DateUtils } from "../../../data/DateUtils";
  import type { IAttachedDoc } from "../../../data/IAttachedDoc";
  import { initialNote, INoteDoc } from "../../../data/INoteDoc";
  import { CreateNote } from "../../../data/INoteDoc";
  import { NoteServices } from "../../../data/NoteServices";
  import BlobInfo from "../../components/BlobInfo.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import InputNote from "../../components/InputNote.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import PersonHeader from "../../components/PersonHeader.svelte";
  import { TEXT_REMOVE_NOTE, TITLE_REMOVE_NOTE } from "../../InfoPrompt";

  //
  export let params: any = {};
  //
  let note: INoteDoc = CreateNote();
  let prev: INoteDoc = CreateNote();
  let blobs: IAttachedDoc[] = [];
  let noteTitle: string = "";
  let isNoteModified: boolean = false;
  //
  const _checkVars = (): void => {
    isNoteModified = note._modified === true;
    noteTitle =
      DateUtils.toDisplay(note._date) + " - " + note._controleName
        ? note._controleName
        : "" + " " + note._fullname
        ? note._fullname
        : "";
  }; // _checkVars
  //
  const performRefresh = async (id?: string): Promise<void> => {
    note = CreateNote();
    blobs = [];
    let noteid = id ? id : note._id;
    if (noteid.length > 0) {
      const pMan = new NoteServices();
      const store = pMan.datastore;
      const p = await store.findItemByIdAsync(initialNote, noteid);
      if (p) {
        note = { ...p };
        blobs = p._attachments ? [...p._attachments] : [];
      }
    } // noieid
    prev = { ...note, _modified: false };
    _checkVars();
  }; // performRefresh
  //
  const onChangeValue = (val: unknown, name: string): void => {
    const p = { ...note, _modified: true };
    p[name] = val;
    note = { ...p };
    _checkVars();
  };
  //
  const performCancel = (): void => {
    note = { ...prev };
    _checkVars();
  };
  const performSave = async (): Promise<void> => {
    const pMan = new NoteServices();
    const r = await pMan.saveItemAsync(note);
    if (r.ok && r.item) {
      note = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      prev = { ...note };
      _checkVars();
    }
  };
  const onSaveAttachment = async (
    name: string,
    mime: string,
    data: Blob,
    _owner?: string
  ): Promise<void> => {
    const pMan = new NoteServices();
    const r = await pMan.saveItemAttachmentAsync(note, name, mime, data);
    if (r.ok && r.item) {
      note = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
    }
  };
  const onRemoveAttachment = async (
    name: string,
    _parentid?: string
  ): Promise<void> => {
    const pMan = new NoteServices();
    const r = await pMan.removeItemAttachmentAsync(note, name);
    if (r.ok && r.item) {
      note = { ...r.item };
      blobs = r.item._attachments ? [...r.item._attachments] : [];
      _checkVars();
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
    <h2>{noteTitle}</h2>
  </Row>
  <Row>
    <PersonHeader
      url={note._url}
      firstname={note._firstname}
      lastname={note._lastname}
    />
  </Row>
  <Row>
    <Form>
      <InputNote value={note.value} onValueChanged={onChangeValue} />
      <InputObservations
        value={note.observations}
        onValueChanged={onChangeValue}
      />
    </Form>
  </Row>
  <Row>
    <EditCommands
      deleteDialogTitle={TITLE_REMOVE_NOTE}
      deleteDialogText={TEXT_REMOVE_NOTE}
      cancancel={isNoteModified}
      canremove={false}
      cansave={isNoteModified}
      onCancel={performCancel}
      onRemove={() => {}}
      onSave={performSave}
    />
  </Row>
  <Row>
    <BlobInfo
      parentid={note._id}
      {blobs}
      onSave={onSaveAttachment}
      onRemove={onRemoveAttachment}
    />
  </Row>
</div>
