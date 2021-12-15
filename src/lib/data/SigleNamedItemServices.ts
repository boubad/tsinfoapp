import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import { DomainConstants } from "./DomainConstants";
import { ItemServices } from "./ItemServices";
import type { IDataStore } from "./IDataStore";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class SigleNamedItemServices<
  T extends ISigleNamedDoc
  > extends ItemServices<T> {
  //
  constructor(
    item: T,
    store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
  ) {
    super(item, store, creator, dbUrl);
  }
  //
  public async findItemsAsync(
    filter?: Record<string, unknown>,
    offset?: number,
    count?: number
  ): Promise<readonly T[]> {
    const xx: readonly T[] = await super.findItemsAsync(filter, offset, count)
    const vret = [...xx];
    if (vret.length > 1) {
      vret.sort((a, b) => {
        if (a.name > b.name) {
          return -1
        } else if (a.name < b.name) {
          return 1
        }
        return 0
      })
    } // sort
    return vret
  } // findItemsAsync
  //
  protected sortItems(src: readonly T[]): readonly T[] {
    if (src.length > 1) {
      const zz = [...src];
      zz.sort((a, b) => {
        if (a.sigle < b.sigle) {
          return -1;
        } else if (a.sigle > b.sigle) {
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
    const store = this.datastore;
    const stype = current.doctype;
    const sigle = current.sigle;
    if (sigle.trim().length > 0) {
      const sel: Record<string, unknown> = {};
      sel[DomainConstants.FIELD_SIGLE] = sigle.trim();
      sel[DomainConstants.FIELD_TYPE] = stype;
      const ix = await store.findOneItemIdByFilter(sel);
      if (ix && ix.length > 0) {
        return ix;
      }
    } // sigle
    const name = current.name;
    if (name.trim().length > 0) {
      const sel: Record<string, unknown> = {};
      sel[DomainConstants.FIELD_NAME] = name.trim();
      sel[DomainConstants.FIELD_TYPE] = stype;
      const ix = await store.findOneItemIdByFilter(sel);
      if (ix && ix.length > 0) {
        return ix;
      }
    } // name
    return undefined;
  } // fetchUniqueId
  //
  protected isStoreable(p: T): boolean {
    return p.sigle.trim().length > 0 && p.name.trim().length > 0 && super.isStoreable(p);
  } // getPersistMap
  protected getPersistMap(current: T): Record<string, unknown> {
    const data: Record<string, unknown> = super.getPersistMap(current)
    const sigle = current.sigle;
    const name = current.name;
    if (sigle.trim().length > 0) {
      data[DomainConstants.FIELD_SIGLE] = sigle.trim();
    }
    if (name.trim().length > 0) {
      data[DomainConstants.FIELD_NAME] = name.trim();
    }
    return data;
  } // SaveItemAsync
} // class SigleNamedItemServices<T>
//
