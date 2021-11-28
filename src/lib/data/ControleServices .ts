import { DomainConstants } from "./DomainConstants";
import { IControleDoc, initialControle } from "./IControleDoc";
import type { IItemPayload } from "./IItemPayload";
import { ItemServices } from "./ItemServices";
import { NoteServices } from "./NoteServices";
import { EvtServices } from "./EvtServices";
import type { IDataStore } from "./IDataStore";
import { ConvertData } from "./ConvertData";
import { initialAnnee } from "./IAnneeDoc";
import { initialGroupe } from "./IGroupeDoc";
import { initialGroupeControles } from "./IGroupeControlesDoc";
import type { IDataOption } from "./IDataOption";
import { CreateNote } from "./INoteDoc";
//
export class ControleServices extends ItemServices<IControleDoc> {
  //
  constructor(store?: IDataStore, dbUrl?: string) {
    super(initialControle, store, dbUrl);
  }
  //
  protected async registerDocAsync(
    doc: Record<string, unknown>
  ): Promise<IControleDoc> {
    const p = ConvertData.ConvertDataItem(this._item, doc);
    const store = this.datastore;
    const annee = await store.findItemByIdAsync(initialAnnee, p.anneeid);
    if (annee) {
      p._anneeSigle = annee.sigle;
    }
    const groupe = await store.findItemByIdAsync(initialGroupe, p.groupeid);
    if (groupe) {
      p._groupeSigle = groupe.sigle;
    }
    const grcont = await store.findItemByIdAsync(
      initialGroupeControles,
      p.groupecontroleid
    );
    if (grcont) {
      p._name = grcont.name;
      p._groupeControlesSigle = grcont.sigle;
      p._controletype = grcont.controletype;
      p._coefficient = grcont.coefficient;
      p._duration = grcont.duration;
      p._hasnotes = grcont.hasnotes;
      p._semestreid = grcont.semestreid;
      p._semestreSigle = grcont._semestreSigle;
      p._matiereSigle = grcont._matiereSigle;
      p._matiereCoeff = grcont._matiereCoeff;
      p._uniteSigle = grcont._uniteSigle;
      p._uniteid = grcont._uniteSigle;
    }
    store.register_item(p);
    return p;
  } // registerDocAsync
  //
  protected async fetchUniqueId(
    current: IControleDoc
  ): Promise<string | undefined> {
    const sret = await super.fetchUniqueId(current);
    if (sret && sret.length > 0) {
      return sret;
    }
    const anneeid = current.anneeid;
    const groupeid = current.groupeid;
    const groupecontroleid = current.groupecontroleid;
    if (
      anneeid.length > 1 &&
      groupeid.length > 0 &&
      groupecontroleid.length > 0
    ) {
      const store = this.datastore;
      const ix = await store.findOneItemIdByFilter({
        doctype: DomainConstants.TYPE_CONTROLE,
        anneeid,
        groupecontroleid,
        groupeid,
      });
      if (ix && ix.length > 0) {
        return ix;
      }
    } // id
    return undefined;
  } // fetchUniqueId
  //
  protected isStoreable(p: IControleDoc): boolean {
    return (
      p.anneeid.trim().length > 0 &&
      p.groupecontroleid.trim().length > 0 &&
      p.groupeid.trim().length > 0 &&
      p.date.trim().length >= 10
    );
  } // getPersistMap
  protected getPersistMap(current: IControleDoc): Record<string, unknown> {
    const data = super.getPersistMap(current);
    const groupecontroleid = current.groupecontroleid;
    const anneeid = current.anneeid;
    const groupeid = current.groupeid;
    const date = current.date;
    data[DomainConstants.FIELD_GROUPECONTROLEID] = groupecontroleid;
    data[DomainConstants.FIELD_ANNEEID] = anneeid;
    data[DomainConstants.FIELD_GROUPEID] = groupeid;
    data[DomainConstants.FIELD_DATE] = date;
    const place = current.place ? current.place.trim() : "";
    if (place.length > 0) {
      data[DomainConstants.FIELD_PLACE] = place;
    }
    return data;
  } // getPersistMap
  public async saveItemAsync(
    item: IControleDoc
  ): Promise<IItemPayload<IControleDoc>> {
    const r = await super.saveItemAsync(item);
    if (!r.ok) {
      return r;
    }
    if (!r.item) {
      return {
        ok: false,
        error: "Item missing error",
      };
    }
    const pCont = r.item;
    if (pCont._hasnotes === true) {
      const b = await this.checkControleNotesAsync(pCont._id);
      if (!b) {
        return { ...r, ok: false, error: "check notes error" };
      }
    }
    return r;
  } // saveItemAsync
  public async removeItemAsync(
    p: IControleDoc
  ): Promise<IItemPayload<IControleDoc>> {
    const id = p._id;
    const rev = p._rev;
    if (id.trim().length < 1 || rev.trim().length < 1) {
      return {
        ok: false,
        error: "Item not persisted",
      };
    }
    {
      const pf = new NoteServices(this.datastore);
      const pp = await pf.findAllItemsByFilterAsync({ controleid: id });
      const n = pp.length;
      for (let i = 0; i < n; i++) {
        const x = pp[i];
        const rsp = await pf.removeItemAsync(x);
        if (!rsp.ok) {
          return {
            ok: false,
            error: rsp.error,
          };
        }
      } // i
    } // notes
    {
      const pf = new EvtServices(this.datastore);
      const pp = await pf.findAllItemsByFilterAsync({ controleid: id });
      const n = pp.length;
      for (let i = 0; i < n; i++) {
        const x = pp[i];
        const rsp = await pf.removeItemAsync(x);
        if (!rsp.ok) {
          return {
            ok: false,
            error: rsp.error,
          };
        }
      } // i
    } // evts
    return super.removeItemAsync(p);
  } // removeItemAsync
  public async getControleEtudiantsIdsAsync(
    controleid: string
  ): Promise<readonly string[]> {
    const vret: string[] = [];
    const store = this.datastore;
    const pControle = await store.findItemByIdAsync(
      initialControle,
      controleid
    );
    if (!pControle) {
      return vret;
    }
    const anneeid = pControle.anneeid;
    const groupeid = pControle.groupeid;
    const filter = {
      doctype: DomainConstants.TYPE_ETUDAFFECTATION,
      anneeid: anneeid,
      groupeid: groupeid,
    };
    const aa = await store.findAllDocsBySelectorAsync(filter, ["etudiantid"]);
    const n = aa.length;
    for (let i = 0; i < n; i++) {
      const p = aa[i];
      if (p.etudiantid) {
        const etudiantid = p.etudiantid as string;
        vret.push(etudiantid);
      } // etudiantid
    } // i
    return vret;
  } //getControleEtudiantsOptionsAsync
  public async getControleEtudiantsOptionsAsync(
    controleid: string
  ): Promise<readonly IDataOption[]> {
    const ids = await this.getControleEtudiantsIdsAsync(controleid);
    return this.getEtudiantsOptionsByIdsAsync(ids);
  } //getControleEtudiantsOptionsAsync
  public async checkControleNotesAsync(controleid: string): Promise<boolean> {
    const pControle = await this.findItemByIdAsync(controleid);
    if (!pControle) {
      return false;
    }
    const store = this.datastore;
    const ids = await this.getControleEtudiantsIdsAsync(controleid);
    const n = ids.length;
    const pf = new NoteServices();
    for (let i = 0; i < n; i++) {
      const etudiantid = ids[i];
      const doc = await store.findDocBySelectorAsync({
        doctype: DomainConstants.TYPE_NOTE,
        etudiantid,
        controleid,
      });
      if (!doc) {
        const p = CreateNote(controleid, etudiantid);
        const r = await pf.saveItemAsync(p);
        if (r.ok) {
          return false;
        }
      } // inser
    } // i
    return true;
  } //  checkControleNotesAsync
} // class ControleServices
//
