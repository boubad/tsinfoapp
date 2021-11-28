import { DomainConstants } from "./DomainConstants";
import { GroupeType } from "./GroupeType";
import type { IDataOption } from "./IDataOption";
import { IGroupeDoc, initialGroupe } from "./IGroupeDoc";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import { EtudAffectationServices } from "./EtudAffectationServices";
import { ConvertData } from "./ConvertData";
import { initialSemestre } from "./ISemestreDoc";
import type { IDataStore } from "./IDataStore";
import type { IItemPayload } from './IItemPayload';
import { ControleServices } from "./ControleServices ";

//
export class GroupeServices extends SigleNamedItemServices<IGroupeDoc> {
    //
    constructor(
        store?: IDataStore, dbUrl?: string
    ) {
        super(initialGroupe, store,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<IGroupeDoc> {
        const p = ConvertData.ConvertDataItem(this._item, doc)
        const store = this.datastore
        const pSemestre = await store.findItemByIdAsync(initialSemestre, p.semestreid)
        if (pSemestre) {
            p._semestreSigle = pSemestre.sigle
        }
        store.register_item(p)
        return p
    }// registerDocAsync
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
            const mm = await store.findAllDocsBySelectorAsync({
                doctype: DomainConstants.TYPE_GROUPE,
                semestreid,
            });
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
        const filter: Record<string, unknown> = {
            doctype: DomainConstants.TYPE_GROUPE,
            parentid: groupeid,
        };
        const dd = await this.datastore.findAllDocsBySelectorAsync(filter, [
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
            const pf = new ControleServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_CONTROLE, groupeid: id });
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
        {
            const pf = new EtudAffectationServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_ETUDAFFECTATION, groupeid: id });
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
