import { initialSemestre, ISemestreDoc } from "./ISemestreDoc";
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import { GroupeServices } from "./GroupeServices";
import type { IDataStore } from "./IDataStore";
import type { IItemPayload } from "./IItemPayload";
import { DomainConstants } from "./DomainConstants";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class SemestreServices extends SigleNamedItemServices<ISemestreDoc> {
  //
  constructor(store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string) {
    super(initialSemestre, store, creator, dbUrl);
  }

  public async removeItemAsync(
    p: ISemestreDoc
  ): Promise<IItemPayload<ISemestreDoc>> {

    const pf = new GroupeServices(this.datastore, this.dataUrlCreator, this.dbUrl);
    const sel: Record<string, unknown> = {};
    sel[DomainConstants.FIELD_SEMESTREID] = p._id;
    const pp = await pf.findAllItemsByFilterAsync(sel);
    const n = pp.length;
    for (let i = 0; i < n; i++) {
      const x = pp[i];
      const rsp = await pf.removeItemAsync(x);
      if (!rsp.ok) {
        return {
          ok: false,
          error: rsp.error,
        };
      }
    } // i
    return super.removeItemAsync(p);
  } // removeItemAsync
} // class SemestreServices
//
