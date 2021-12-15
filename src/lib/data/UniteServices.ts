import type { IDataStore } from './IDataStore'
import { initialUnite, IUniteDoc } from './IUniteDoc'
import { MatiereServices } from './MatiereServices'
import { SigleNamedItemServices } from './SigleNamedItemServices'
import type { IItemPayload } from './IItemPayload';
import { DomainConstants } from './DomainConstants';
import type { IDataUrlCreator } from './IDataUrlCreator';

//
export class UniteServices extends SigleNamedItemServices<IUniteDoc> {
    //
    constructor(store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string) {
        super(initialUnite, store, creator, dbUrl)
    }
    public async removeItemAsync(p: IUniteDoc): Promise<IItemPayload<IUniteDoc>> {
        const pf = new MatiereServices(this.datastore, this.dataUrlCreator, this.dbUrl);
        const sel: Record<string, unknown> = {};
        sel[DomainConstants.FIELD_UNITEID] = p._id;
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
        return super.removeItemAsync(p)
    } // removeItemAsync
} // class UniteServices
//
