import { DomainConstants } from "./DomainConstants";
import { ItemServices } from "./ItemServices";
import type { IControleChildDoc } from "./IControleChildDoc";
import type { IDataStore } from "./IDataStore";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class ControleChildServices<
  T extends IControleChildDoc
  > extends ItemServices<T> {
  //
  constructor(
    item: T,
    store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
  ) {
    super(item, store, creator, dbUrl);
  }
  //
  protected sortItems(src: readonly T[]): readonly T[] {
    if (src.length > 1) {
      const zz = [...src];
      zz.sort((a, b) => {
        let s1 = (a._date) ? a._date : '';
        let s2 = (b._date) ? b._date : '';
        if (s1 < s2) {
          return 1;
        } else if (s1 > s2) {
          return -1;
        }
        s1 = a._lastname ? a._lastname : '';
        s2 = b._lastname ? b._lastname : '';
        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        }
        s1 = a._firstname ? a._firstname : '';
        s2 = b._firstname ? b._firstname : '';
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
    current: T
  ): Promise<string | undefined> {
    const sret = await super.fetchUniqueId(current)
    if (sret && sret.length > 0) {
      return sret;
    }
    const controleid = current.controleid;
    const etudiantid = current.etudiantid;
    if (controleid.length > 1 && etudiantid.length > 0) {
      const sel: Record<string, unknown> = {};
      sel[DomainConstants.FIELD_TYPE] = this.item.doctype;
      sel[DomainConstants.FIELD_CONTROLEID] = controleid;
      sel[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
      const ix = await this.datastore.findOneItemIdByFilter(sel);
      if (ix && ix.length > 0) {
        return ix;
      }
    } // id
    return undefined;
  } // fetchUniqueId
  //
  protected isStoreable(p: T): boolean {
    return super.isStoreable(p) && p.controleid.trim().length > 0 && p.etudiantid.trim().length > 0;
  } // getPersistMap
  protected getPersistMap(current: T): Record<string, unknown> {
    const data = super.getPersistMap(current);
    data[DomainConstants.FIELD_CONTROLEID] = current.controleid;
    data[DomainConstants.FIELD_ETUDIANTID] = current.etudiantid;
    return data;
  } // SaveItemAsync
} // class  ControleChildServices
//
