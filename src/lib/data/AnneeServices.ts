import { DomainConstants } from "./DomainConstants";
import { EtudAffectationServices } from "./EtudAffectationServices";
import { IAnneeDoc, initialAnnee } from "./IAnneeDoc";
import type { IDataStore } from "./IDataStore";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import type { IItemPayload } from './IItemPayload';
import { ControleServices } from "./ControleServices ";

//
export class AnneeServices extends SigleNamedItemServices<IAnneeDoc> {
    //
    constructor(
        store?: IDataStore, dbUrl?: string
    ) {
        super(initialAnnee, store,dbUrl);
    }
    //
    protected async fetchUniqueId(
        current: IAnneeDoc
    ): Promise<string | undefined> {
        const rx = await super.fetchUniqueId(current);
        if (rx && rx.trim().length > 0) {
            return rx.trim();
        }
        const startdate = current.startdate;
        const enddate = current.enddate;
        if (startdate.length > 0 && enddate.length > 0) {
            const store = this.datastore;
            const ix = await store.findOneItemIdByFilter({
                doctype: DomainConstants.TYPE_ANNEE,
                startdate,
                enddate,
            });
            if (ix && ix.trim().length > 0) {
                return ix.trim();
            }
        } // sigle
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: IAnneeDoc): boolean {
        if (!super.isStoreable(p)) {
            return false;
        }
        if (p.startdate.trim().length < 10 || p.enddate.trim().length < 10) {
            return false;
        }
        return p.startdate <= p.enddate;
    } // getPersistMap
    protected getPersistMap(current: IAnneeDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        if (current.startdate && current.startdate.length >= 10) {
            data[DomainConstants.FIELD_STARTDATE] = current.startdate;
        }
        if (current.enddate && current.enddate.length >= 10) {
            data[DomainConstants.FIELD_ENDDATE] = current.enddate;
        }
        return data;
    } // SaveItemAsync
    public async removeItemAsync(p: IAnneeDoc): Promise<IItemPayload<IAnneeDoc>> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        {
            const pf = new ControleServices(this.datastore,this.dbUrl);
            const pp = await pf.findAllItemsByFilterAsync({anneeid: id });
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
            const pp = await pf.findAllItemsByFilterAsync({anneeid: id });
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
        }// etudaffectations
        return super.removeItemAsync(p);
    } // removeItemAsync
} // class AnneeServices
//
