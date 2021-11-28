import { DomainConstants } from "./DomainConstants";
import { IMatiereDoc, initialMatiere } from "./IMatiereDoc";
import { GroupeControlesServices } from "./GroupeControlesServices";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import { ConvertData } from './ConvertData';
import { initialUnite } from './IUniteDoc';
import type { IDataStore } from "./IDataStore";
import type { IItemPayload } from './IItemPayload';

//
export class MatiereServices extends SigleNamedItemServices<IMatiereDoc> {
    //
    constructor(
        store?: IDataStore, dbUrl?: string
    ) {
        super(initialMatiere, store,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<IMatiereDoc> {
        const p = ConvertData.ConvertDataItem(this._item, doc)
        const store = this.datastore
        const pUnite = await store.findItemByIdAsync(initialUnite, p.uniteid)
        if (pUnite) {
            p._uniteSigle = pUnite.sigle
        }
        store.register_item(p)
        return p
    }// registerDocAsync
    protected isStoreable(p: IMatiereDoc): boolean {
        return p.uniteid.trim().length > 0 && super.isStoreable(p);
    } // getPersistMap
    protected getPersistMap(current: IMatiereDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        if (current.coefficient > 0) {
            data[DomainConstants.FIELD_COEFFICIENT] = current.coefficient;
        }
        if (current.ecs > 0) {
            data[DomainConstants.FIELD_ECS] = current.ecs;
        }
        if (current.module_name && current.module_name.trim().length > 0) {
            data[DomainConstants.FIELD_MODNAME] = current.module_name.trim();
        }
        return data;
    } // SaveItemAsync
    //
    public async removeItemAsync(p: IMatiereDoc): Promise<IItemPayload<IMatiereDoc>> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        {
            const pf = new GroupeControlesServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_GROUPCONTROLE, matiereid: id });
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
        }// groupecontroles
        return super.removeItemAsync(p);
    } // removeItemAsync
} // class MatiereServices
//
