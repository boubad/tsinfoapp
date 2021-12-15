import { DomainConstants } from "./DomainConstants";
import { IControleDoc, initialControle } from "./IControleDoc";
import type { IItemPayload } from "./IItemPayload";
import { ItemServices } from "./ItemServices";
import { NoteServices } from "./NoteServices";
import type { IDataStore } from "./IDataStore";
import type { IDataOption } from "./IDataOption";
import { CreateNote } from "./INoteDoc";
import type { IDataUrlCreator } from "./IDataUrlCreator";
//
export class ControleServices extends ItemServices<IControleDoc> {
  //
  constructor(store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string) {
    super(initialControle, store, creator, dbUrl);
  }
  //
  protected sortItems(src: readonly IControleDoc[]): readonly IControleDoc[] {
    if (src.length > 1) {
      const zz = [...src];
      zz.sort((a, b) => {
        let s1 = (a.date) ? a.date : '';
        let s2 = (b.date) ? b.date : '';
        if (s1 < s2) {
          return 1;
        } else if (s1 > s2) {
          return -1;
        }
        s1 = a._name ? a._name : '';
        s2 = b._name ? b._name : '';
        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        }
        return 0;
      });
      return zz;
    } // sort
    return src;
  }// sorItems
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
      const sel: Record<string, unknown> = {};
      sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_CONTROLE;
      sel[DomainConstants.FIELD_ANNEEID] = anneeid;
      sel[DomainConstants.FIELD_GROUPECONTROLEID] = groupecontroleid;
      sel[DomainConstants.FIELD_GROUPEID] = groupeid;
      const ix = await this.datastore.findOneItemIdByFilter(sel);
      if (ix && ix.length > 0) {
        return ix;
      }
    } // id
    return undefined;
  } // fetchUniqueId
  //
  protected isStoreable(p: IControleDoc): boolean {
    return (
      super.isStoreable(p) &&
      p.anneeid.trim().length > 0 &&
      p.groupecontroleid.trim().length > 0 &&
      p.groupeid.trim().length > 0 &&
      p.date.trim().length >= 10
    );
  } // getPersistMap
  protected getPersistMap(current: IControleDoc): Record<string, unknown> {
    const data = super.getPersistMap(current);
    data[DomainConstants.FIELD_GROUPECONTROLEID] = current.groupecontroleid;
    data[DomainConstants.FIELD_ANNEEID] = current.anneeid;
    data[DomainConstants.FIELD_GROUPEID] = current.groupeid;
    data[DomainConstants.FIELD_DATE] = current.date;
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
  public async getControleEtudiantsIdsAsync(
    controleid: string
  ): Promise<readonly string[]> {
    const vret: string[] = [];
    const store = this.datastore;
    const pControle = await this.findItemByIdAsync(controleid);
    if (!pControle) {
      return vret;
    }
    const anneeid = pControle.anneeid;
    const groupeid = pControle.groupeid;
    const sel: Record<string, unknown> = {};
    sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_ETUDAFFECTATION;
    sel[DomainConstants.FIELD_ANNEEID] = anneeid;
    sel[DomainConstants.FIELD_GROUPEID] = groupeid;
    const aa = await store.findAllDocsBySelectorAsync(sel, [DomainConstants.FIELD_ETUDIANTID]);
    const n = aa.length;
    for (let i = 0; i < n; i++) {
      const p = aa[i];
      if (p[DomainConstants.FIELD_ETUDIANTID]) {
        const etudiantid = p[DomainConstants.FIELD_ETUDIANTID] as string;
        vret.push(etudiantid);
      } // etudiantid
    } // i
    return vret;
  } // getControleEtudiantsOptionsAsync
  public async getControleEtudiantsOptionsAsync(
    controleid: string
  ): Promise<readonly IDataOption[]> {
    const ids = await this.getControleEtudiantsIdsAsync(controleid);
    return this.getEtudiantsOptionsByIdsAsync(ids);
  } // getControleEtudiantsOptionsAsync
  public async checkControleNotesAsync(controleid: string): Promise<boolean> {
    const pControle = await this.findItemByIdAsync(controleid);
    if (!pControle) {
      return false;
    }
    const ids = await this.getControleEtudiantsIdsAsync(controleid);
    const n = ids.length;
    if (n > 0) {
      const pf = new NoteServices(this.datastore);
      const store = this.datastore;
      for (let i = 0; i < n; i++) {
        const etudiantid = ids[i];
        const sel: Record<string, unknown> = {};
        sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_NOTE;
        sel[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
        sel[DomainConstants.FIELD_CONTROLEID] = controleid;
        const doc = await store.findDocBySelectorAsync(sel);
        if (!doc) {
          const p = CreateNote(controleid, etudiantid);
          const r = await pf.saveItemAsync(p);
          if (!r.ok) {
            return false;
          }
        } // insert
      } // i
    }// n

    return true;
  } //  checkControleNotesAsync
} // class ControleServices
//
