import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import { DomainConstants } from "./DomainConstants";
import { ItemServices } from "./ItemServices";
import type { IDataStore } from "./IDataStore";

//
export class SigleNamedItemServices<
    T extends ISigleNamedDoc
    > extends ItemServices<T> {
    //
    constructor(
        item: T,
        store?: IDataStore, dbUrl?: string
    ) {
        super(item, store,dbUrl);
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
        if (sigle.length > 0) {
            const ix = await store.findOneItemIdByFilter({
                doctype: stype,
                sigle,
            });
            if (ix && ix.length > 0) {
                return ix;
            }
        } // sigle
        const name = current.name;
        if (name.length > 0) {
            const ix = await store.findOneItemIdByFilter({
                doctype: stype,
                name,
            });
            if (ix && ix.length > 0) {
                return ix;
            }
        } // name
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: T): boolean {
        return p.sigle.trim().length > 0 && p.name.trim().length > 0;
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
} // class UniteServices
//
