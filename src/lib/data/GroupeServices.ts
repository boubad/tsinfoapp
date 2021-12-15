import { DomainConstants } from "./DomainConstants";
import { GroupeType } from "./GroupeType";
import type { IDataOption } from "./IDataOption";
import { IGroupeDoc, initialGroupe } from "./IGroupeDoc";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import type { IDataStore } from "./IDataStore";
import type { IItemPayload } from './IItemPayload';
import { ControleServices } from "./ControleServices ";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class GroupeServices extends SigleNamedItemServices<IGroupeDoc> {
    //
    constructor(
        store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
    ) {
        super(initialGroupe, store, creator, dbUrl);
    }
    //
    protected isStoreable(p: IGroupeDoc): boolean {
        return (
            p.groupetype !== GroupeType.Unknown &&
            p.semestreid.length > 0 &&
            super.isStoreable(p)
        );
    } // getPersistMap
    protected getPersistMap(current: IGroupeDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        data[DomainConstants.FIELD_SEMESTREID] = current.semestreid;
        if (
            current.groupetype !== GroupeType.Unknown
        ) {
            data[DomainConstants.FIELD_GROUPETYPE] = current.groupetype;
        }
        if (
            current.parentid.trim().length > 0
        ) {
            data[DomainConstants.FIELD_PARENTID] = current.parentid.trim();
        }
        return data;
    } // SaveItemAsync
    public async findParentOptionsAsync(
        current: IGroupeDoc,
        semestreid?: string
    ): Promise<readonly IDataOption[]> {
        let vret: IDataOption[] = [];
        if (
            semestreid === undefined ||
            semestreid.length < 1
        ) {
            semestreid = current.semestreid;
            if (semestreid.length < 1) {
                return vret;
            }
        }
        let etype = current.groupetype;
        if (etype === GroupeType.Unknown) {
            etype = GroupeType.Tp;
        }
        if (etype !== GroupeType.Promotion) {
            const store = this.datastore;
            const sel: Record<string, unknown> = {};
            sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_GROUPE;
            sel[DomainConstants.FIELD_SEMESTREID] = semestreid;
            const mm = await store.findAllDocsBySelectorAsync(sel);
            const n = mm.length;
            for (let i = 0; i < n; i++) {
                const m = mm[i];
                const value = m._id ? "" + m._id : "";
                const name = m.name ? "" + m.name : "";
                if (value.length > 0 && name.length > 0) {
                    let xtype = m.groupetype ? m.groupetype : GroupeType.Tp;
                    if (xtype === GroupeType.Unknown) {
                        xtype = GroupeType.Tp;
                    }
                    if (etype === xtype || xtype === GroupeType.Tp) {
                        continue;
                    }
                    if (etype === GroupeType.Tp && xtype === GroupeType.Td) {
                        vret.push({ value, name });
                    } else if (
                        etype === GroupeType.Td &&
                        xtype === GroupeType.Promotion
                    ) {
                        vret.push({ value, name });
                    }
                } // val
            } // i
            if (vret.length > 1) {
                vret.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    } else if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
            } // vret
            const xx: IDataOption[] = [{ value: "", name: " " }];
            const m = vret.length;
            for (let i = 0; i < m; i++) {
                xx.push(vret[i]);
            } // i
            vret = xx;
        } // no promotion
        return vret;
    }
    //
    public async findGroupeChildrenAsync(groupeid: string): Promise<IGroupeDoc[]> {
        const pRet: IGroupeDoc[] = [];
        const p = await this.datastore.findItemByIdAsync<IGroupeDoc>(initialGroupe, groupeid);
        if (!p) {
            return pRet;
        }
        const sel: Record<string, unknown> = {};
        sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_GROUPE;
        sel[DomainConstants.FIELD_PARENTID] = groupeid;
        const dd = await this.datastore.findAllDocsBySelectorAsync(sel, [
            DomainConstants.FIELD_ID,
        ]);
        if (dd && dd.length > 0) {
            const n = dd.length;
            for (let i = 0; i < n; i++) {
                const d = dd[i];
                if (d._id) {
                    const sid = "" + d._id;
                    const x = await this.datastore.findItemByIdAsync(initialGroupe, sid);
                    if (x) {
                        pRet.push(x);
                    }
                }
            } // i
        } // dd
        if (pRet.length > 1) {
            pRet.sort((a, b) => {
                if (a.sigle < b.sigle) {
                    return -1;
                } else if (a.sigle > b.sigle) {
                    return 1;
                }
                return 0;
            });
        } // sort
        return pRet;
    } // getGroupeChildrenAsync
    //
    public async removeItemAsync(p: IGroupeDoc): Promise<IItemPayload<IGroupeDoc>> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        // remove all children
        const gg = await this.findGroupeChildrenAsync(id);
        if (gg.length > 0) {
            for (let i = 0; i < gg.length; i++) {
                const x = gg[i];
                await this.removeItemAsync(x);
            } // i
        }
        {
            const pf = new ControleServices(this.datastore, this.dataUrlCreator,this.dbUrl)
            const sel: Record<string, unknown> = {};
            sel[DomainConstants.FIELD_GROUPEID] = id;
            const pp = await pf.findAllItemsByFilterAsync(sel);
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const x = pp[i];
                const rsp = await pf.removeItemAsync(x);
                if (!rsp.ok) {
                    return {
                        ok: false,
                        error: rsp.error
                    }
                }
            }// i
        }// controles
        return super.removeItemAsync(p);
    } // removeItemAsync
    //
} // class GroupeServices
//
