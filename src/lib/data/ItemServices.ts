import { DomainConstants } from "./DomainConstants";
import type { IBaseDoc } from "./IBaseDoc";
import { BaseServices } from "./BaseServices";
import { ConvertData } from './ConvertData';
import type { IDataStore } from "./IDataStore";
import { StatusType } from "./StatusType ";
import type { IItemPayload } from "./IItemPayload";
import type { ICouchDBUpdateResponse } from "./ICouchDBUpdateResponse";
//
const MAX_INT_VALUE = Number.MAX_SAFE_INTEGER;
//
export class ItemServices<T extends IBaseDoc> extends BaseServices {
    protected _item: T;
    constructor(
        item: T,
        store?: IDataStore, dbUrl?: string
    ) {
        super(store, dbUrl);
        this._item = item;
    } // constructor
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<T> {
        return ConvertData.ConvertDataItem(this._item, doc);
    }// registerDocAsyn
    //
    protected async fetchUniqueId(current: T): Promise<string | undefined> {
        const id = current._id.trim();
        if (id.length > 0) {
            const rev = await this.datastore.findDocRevisionAsync(id);
            if (rev && rev.length > 0) {
                return id;
            }
        }
        return undefined;
    } // fetchUniqueId
    protected isStoreable(p: T): boolean {
        return p.doctype.trim().length > 0;
    } // getPersistMap
    protected getPersistMap(current: T): Record<string, unknown> {
        const data: Record<string, unknown> = {};
        data[DomainConstants.FIELD_TYPE] = this._item.doctype;
        if (current._id.trim().length > 0) {
            data[DomainConstants.FIELD_ID] = current._id.trim();
        }
        if (current.observations && current.observations.trim().length > 0) {
            data[DomainConstants.FIELD_OBSERVATIONS] = current.observations.trim();
        }
        if (current.reptype && current.reptype.trim().length > 0) {
            data[DomainConstants.FIELD_REPTYPE] = current.reptype.trim();
        }
        if (current.ownerid && current.ownerid.trim().length > 0) {
            data[DomainConstants.FIELD_OWNERID] = current.ownerid.trim();
        }
        if (
            current.status !== StatusType.Unknown
        ) {
            data[DomainConstants.FIELD_STATUS] = current.status;
        }
        return data;
    } // getPersistMap
    protected getItemsFilter(): Record<string, unknown> {
        return {
            doctype: this._item.doctype,
        };
    }
    public async createNewItem(): Promise<IItemPayload<T>> {
        return {
            ok: true,
            item: { ...this._item }
        };
    } // createNewItem
    public async findItemByIdAsync(id: string): Promise<T | undefined> {
        return this.datastore.findItemByIdAsync(this._item, id);
    }// findItemByIdAsync
    public async cancelEdit(current: T, prev: T): Promise<IItemPayload<T>> {
        return {
            ok: true,
            item: { ...prev },
            prev: current,
        };
    } // cancelEdit
    //
    public changeFieldValue(
        item: T,
        fieldname: string,
        fieldvalue: unknown
    ): IItemPayload<T> {
        const pRet: IItemPayload<T> = { ok: true };
        const current = { ...item };
        current[fieldname] = fieldvalue;
        current._modified = true;
        pRet.item = current;
        return pRet;
    } // changeFieldValue
    public async selectItemAsync(id: string): Promise<IItemPayload<T>> {
        const store = this.datastore;
        const p = await store.findItemByIdAsync<T>(this._item, id);
        if (!p) {
            return { ok: false };
        }
        return {
            ok: true,
            item: p
        };
    } // selectItemAsync
    public async saveItemAsync(item: T): Promise<IItemPayload<T>> {
        if (!this.isStoreable(item)) {
            return {
                ok: false,
                error: "Item not storeable error"
            };
        }
        const store = this.datastore;
        const data = this.getPersistMap(item);
        const sx = await this.fetchUniqueId(item);
        if (sx && sx.length > 0) {
            data[DomainConstants.FIELD_ID] = sx;
        }
        const rr = await store.maintainsDocAsync(data);
        const rsp = rr as ICouchDBUpdateResponse;
        if (!rsp.ok) {
            let error = (rsp.error) ? rsp.error : '';
            if (rsp.reason) {
                error = error + "\n" + rsp.reason;
            }
            return {
                ok: false,
                error: error
            }
        }
        const id = rsp.id as string;
        const p = await this.selectItemAsync(id);
        if (p && p.item) {
            return { ...p, info: 'item saved OK!', ok: true };
        }
        return {
            ok: false,
            error: 'Cannot save item'
        };
    } // saveItemAsync
    public async removeItemAsync(p: T): Promise<IItemPayload<T>> {
        const id = p._id.trim();
        const rev = p._rev.trim()
        if (id.length < 1 || rev.length < 1) {
            return {
                ok: false,
                error: 'Item is not persisted'
            };
        }
        const store = this.datastore;
        const rr = await store.removeDocAsync(id);
        const rsp = rr as ICouchDBUpdateResponse;
        if (!rsp.ok) {
            let error = (rsp.error) ? rsp.error : '';
            if (rsp.reason) {
                error = error + "\n" + rsp.reason;
            }
            return {
                ok: false,
                error: error
            }
        }
        return {
            ok: true,
            info: "Item remove OK!"
        };
    } // removeItemAsync
    public async saveItemAttachmentAsync(
        item: T,
        attName: string,
        mimeType: string,
        data: Blob | ArrayBuffer
    ): Promise<IItemPayload<T>> {
        const id = item._id;
        const rr = await this.saveAttachmentAsync(id, attName, mimeType, data);
        const rsp = rr as ICouchDBUpdateResponse;
        if (!rsp.ok) {
            let error = (rsp.error) ? rsp.error : '';
            if (rsp.reason) {
                error = error + "\n" + rsp.reason;
            }
            return {
                ok: false,
                error: error
            }
        }
        const p = await this.selectItemAsync(id);
        if (p && p.item) {
            return { ...p, info: 'item attachment saved OK!', ok: true };
        }
        return {
            ok: false,
            error: 'Cannot save item attachment'
        };
    } // saveAttachmentAsync
    public async removeItemAttachmentAsync(
        item: T,
        attName: string
    ): Promise<IItemPayload<T>> {
        const id = item._id;
        const rr = await this.removeAttachmentAsync(id, attName);
        const rsp = rr as ICouchDBUpdateResponse;
        if (!rsp.ok) {
            let error = (rsp.error) ? rsp.error : '';
            if (rsp.reason) {
                error = error + "\n" + rsp.reason;
            }
            return {
                ok: false,
                error: error
            }
        }
        const p = await this.selectItemAsync(id);
        if (p && p.item) {
            return { ...p, info: 'item attachment remove OK!', ok: true };
        }
        return {
            ok: false,
            error: 'Cannot remove item attachment'
        };
    } // removeAttachmentAsync
    public async refreshItemsAsync(
        filter?: Record<string, unknown>,
        offset?: number,
        count?: number
    ): Promise<IItemPayload<T>> {
        const store = this.datastore;
        const sel = (filter) ? { ...filter, doctype: this._item.doctype } : { doctype: this._item.doctype };
        const dd = await store.findDocsBySelectorAsync(sel, offset, count, ["_id"]);
        const nx = dd.length;
        const rx: T[] = [];
        for (let i = 0; i < nx; i++) {
            const p = dd[i];
            if (p._id) {
                const id = p._id as string;
                const pz = await store.findItemByIdAsync(this._item, id);
                if (pz) {
                    rx.push(pz);
                }
            }// p_id
        } // i
        return {
            ok: true,
            items: rx
        };
    } // refreshItemsAsync
    public async findItemsAsync(
        filter?: Record<string, unknown>,
        offset?: number,
        count?: number
    ): Promise<readonly T[]> {
        let vret: T[] = []
        const rsp = await this.refreshItemsAsync(filter, offset, count)
        if (rsp.items) {
            vret = rsp.items
        }
        return vret
    } // findItemsAsync
    public async findAllItemsByFilterAsync(
        filter?: Record<string, unknown>,
    ): Promise<readonly T[]> {
        return this.findItemsAsync(filter, 0, MAX_INT_VALUE);
    } // findItemsAsync
} // class ItemSerices
