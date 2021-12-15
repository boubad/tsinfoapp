import { DomainConstants } from "./DomainConstants";
import type { IDataStore } from "./IDataStore";
import { ItemServices } from "./ItemServices";
import { IEtudAffectationDoc, initialEtudAffectation } from "./IEtudAffectationDoc";
import type { IDataUrlCreator } from "./IDataUrlCreator";
//
export class EtudAffectationServices extends ItemServices<IEtudAffectationDoc> {
  //
  constructor(
    store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
  ) {
    super(initialEtudAffectation, store, creator, dbUrl);
  }
  //
  //
  protected sortItems(src: readonly IEtudAffectationDoc[]): readonly IEtudAffectationDoc[] {
    if (src.length > 1) {
      const zz = [...src];
      zz.sort((a, b) => {
        let s1 = a._lastname ? a._lastname : '';
        let s2 = b._lastname ? b._lastname : '';
        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        }
        s1 = a._firstname ? a._firstname : '';
        s2 = b._firstname ? b._firstname : '';
        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        }
        return 0;
      });
      return zz;
    } // sort
    return src;
  }// sorItems
  //

  protected async fetchUniqueId(
    current: IEtudAffectationDoc
  ): Promise<string | undefined> {
    const sret = await super.fetchUniqueId(current)
    if (sret && sret.length > 0) {
      return sret;
    }
    const etudiantid = current.etudiantid;
    const anneeid = current.anneeid;
    const groupeid = current.groupeid;
    if (
      etudiantid.length > 0 &&
      anneeid.length > 0 &&
      groupeid.length > 0
    ) {
      const sel: Record<string, unknown> = {};
      sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_ETUDAFFECTATION;
      sel[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
      sel[DomainConstants.FIELD_ANNEEID] = anneeid;
      sel[DomainConstants.FIELD_GROUPEID] = groupeid;
      const ix = await this.datastore.findOneItemIdByFilter(sel);
      if (ix && ix.length > 0) {
        return ix;
      }
    } // matiere && semestre
    return undefined;
  } // fetchUniqueId
  //
  protected isStoreable(p: IEtudAffectationDoc): boolean {
    return (
      super.isStoreable(p) &&
      p.etudiantid.trim().length > 0 &&
      p.anneeid.trim().length > 0 &&
      p.groupeid.trim().length > 0
    );
  } // getPersistMap
  protected getPersistMap(
    current: IEtudAffectationDoc
  ): Record<string, unknown> {
    const data = super.getPersistMap(current);
    data[DomainConstants.FIELD_ETUDIANTID] = current.etudiantid;
    data[DomainConstants.FIELD_ANNEEID] = current.anneeid;
    data[DomainConstants.FIELD_GROUPEID] = current.groupeid;
    if (current.startdate && current.startdate.length >= 10) {
      data[DomainConstants.FIELD_STARTDATE] = current.startdate;
    }
    if (current.enddate && current.enddate.length >= 10) {
      data[DomainConstants.FIELD_ENDDATE] = current.enddate;
    }
    return data;
  } // SaveItemAsync
} // class EtudAffectationServices
//
