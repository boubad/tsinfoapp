import { DomainConstants } from "./DomainConstants";
import type { IDataStore } from "./IDataStore";
import { IGroupeControlesDoc, initialGroupeControles } from './IGroupeControlesDoc';
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import type { IItemPayload } from './IItemPayload';
import { ControleServices } from "./ControleServices ";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class GroupeControlesServices extends SigleNamedItemServices<IGroupeControlesDoc> {
    //
    constructor(
        store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
    ) {
        super(initialGroupeControles, store, creator, dbUrl);
    }
    //
    protected async fetchUniqueId(
        current: IGroupeControlesDoc
    ): Promise<string | undefined> {
        const store = this.datastore;
        if (current._id.trim().length > 0) {
            const rev = await store.findDocRevisionAsync(current._id);
            if (rev && rev.length > 0) {
                return current._id;
            }
        }
        const matiereid = current.matiereid;
        const semestreid = current.semestreid;
        if (matiereid.length > 0 && semestreid.length > 0) {
            const sigle = current.sigle;
            if (sigle.length > 0) {
                const sel: Record<string, unknown> = {};
                sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_GROUPCONTROLE;
                sel[DomainConstants.FIELD_MATIEREID] = matiereid;
                sel[DomainConstants.FIELD_SEMESTREID] = semestreid;
                sel[DomainConstants.FIELD_SIGLE] = sigle;
                const ix = await store.findOneItemIdByFilter(sel);
                if (ix && ix.length > 0) {
                    return ix;
                }
            } // sigle
            const name = current.name;
            if (name.length > 0) {
                const sel: Record<string, unknown> = {};
                sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_GROUPCONTROLE;
                sel[DomainConstants.FIELD_MATIEREID] = matiereid;
                sel[DomainConstants.FIELD_SEMESTREID] = semestreid;
                sel[DomainConstants.FIELD_NAME] = name;
                const ix = await store.findOneItemIdByFilter(sel);
                if (ix && ix.length > 0) {
                    return ix;
                }
            } // sigle
        } // matiere && semestre
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: IGroupeControlesDoc): boolean {
        return (p.semestreid.trim().length > 0 && p.matiereid.trim().length > 0 && super.isStoreable(p));
    } // getPersistMap
    protected getPersistMap(
        current: IGroupeControlesDoc
    ): Record<string, unknown> {
        const data = super.getPersistMap(current);
        data[DomainConstants.FIELD_MATIEREID] = current.matiereid;
        data[DomainConstants.FIELD_SEMESTREID] = current.semestreid;
        return data;
    } // SaveItemAsync
    public async removeItemAsync(p: IGroupeControlesDoc): Promise<IItemPayload<IGroupeControlesDoc>> {
        const pf = new ControleServices(this.datastore, this.dataUrlCreator,this.dbUrl)
        const sel: Record<string, unknown> = {};
        sel[DomainConstants.FIELD_GROUPECONTROLEID] = p._id;
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
        return super.removeItemAsync(p);
    } // removeItemAsync
} // class ControleServices
//
