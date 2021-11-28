import type { IDataStore } from './IDataStore'
import { initialUnite, IUniteDoc } from './IUniteDoc'
import { MatiereServices } from './MatiereServices'
import { SigleNamedItemServices } from './SigleNamedItemServices'
import type { IItemPayload } from './IItemPayload';
import { DomainConstants } from './DomainConstants';

//
export class UniteServices extends SigleNamedItemServices<IUniteDoc> {
    //
    constructor( store?: IDataStore, dbUrl?: string) {
        super(initialUnite, store,dbUrl)
    }

    public async removeItemAsync(p: IUniteDoc): Promise<IItemPayload<IUniteDoc>> {
        const id = p._id
        const rev = p._rev
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        {
            const pf = new MatiereServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_MATIERE, uniteid: id });
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
        return super.removeItemAsync(p)
    } // removeItemAsync
} // class UniteServices
//
