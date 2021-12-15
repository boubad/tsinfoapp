import { DomainConstants } from "./DomainConstants";
import { IMatiereDoc, initialMatiere } from "./IMatiereDoc";
import { GroupeControlesServices } from "./GroupeControlesServices";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import type { IDataStore } from "./IDataStore";
import type { IItemPayload } from './IItemPayload';
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class MatiereServices extends SigleNamedItemServices<IMatiereDoc> {
    //
    constructor(
        store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
    ) {
        super(initialMatiere, store, creator, dbUrl);
    }
    //
    protected isStoreable(p: IMatiereDoc): boolean {
        return p.uniteid.trim().length > 0 && super.isStoreable(p);
    } // getPersistMap
    protected getPersistMap(current: IMatiereDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        data[DomainConstants.FIELD_UNITEID] = current.uniteid;
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
        const pf = new GroupeControlesServices(this.datastore,this.dataUrlCreator,this.dbUrl);
        const sel: Record<string, unknown> = {};
        sel[DomainConstants.FIELD_MATIEREID] = p._id;
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
} // class MatiereServices
//
