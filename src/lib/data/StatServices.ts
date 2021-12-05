import { BaseServices } from "./BaseServices";
import type { IDataStore } from "./IDataStore";
import type { IMatiereStatItem } from "./IMatiereStatItem";
import { DomainConstants } from "./DomainConstants";
import type { ICumuItem } from "./ICumulItem";
import { initialEtudiant } from "./IEtudiantDoc";
import { EvtType, ConvertEvtTypeToString } from "./EvtType";
import { initialGroupe } from "./IGroupeDoc";
import { DateUtils } from "./DateUtils";
//
export class StatServices extends BaseServices {
  constructor(store?: IDataStore, dbUrl?: string) {
    super(store, dbUrl);
  } // constructor
  public async getMatiereStats(
    anneeid: string,
    semestreid: string,
    matiereid: string
  ): Promise<readonly IMatiereStatItem[]> {
    const pRet: IMatiereStatItem[] = [];
    if (anneeid.length < 1 || semestreid.length < 1 || matiereid.length < 1) {
      return pRet;
    }
    const groupesMap: Map<string, string> = new Map<string, string>();
    const workMap: Map<string, ICumuItem> = new Map<string, ICumuItem>();
    const dataMap: Map<string, IMatiereStatItem> = new Map<
      string,
      IMatiereStatItem
    >();
    const store = this.datastore;
    const grps = await store.findAllDocsBySelectorAsync(
      { doctype: DomainConstants.TYPE_GROUPCONTROLE, matiereid, semestreid },
      [DomainConstants.FIELD_ID, DomainConstants.FIELD_COEFFICIENT]
    );
    const n = grps.length;
    for (let i = 0; i < n; i++) {
      const grp = grps[i];
      const groupecontroleid = grp[DomainConstants.FIELD_ID] as string;
      let coef = grp[DomainConstants.FIELD_COEFFICIENT]
        ? (grp[DomainConstants.FIELD_COEFFICIENT] as number)
        : 1.0;
      if (coef <= 0.0) {
        coef = 1.0;
      }
      const filterControles: Record<string, unknown> = {
        doctype: DomainConstants.TYPE_CONTROLE,
        groupecontroleid,
        anneeid,
      };
      const conts = await store.findAllDocsBySelectorAsync(filterControles, [
        DomainConstants.FIELD_ID,
        DomainConstants.FIELD_COEFFICIENT,
        DomainConstants.FIELD_DATE,
        DomainConstants.FIELD_GROUPEID,
      ]);
      const m = conts.length;
      for (let j = 0; j < m; j++) {
        const doc = conts[j];
        let groupeid = "";
        if (doc[DomainConstants.FIELD_GROUPEID]) {
          groupeid = doc[DomainConstants.FIELD_GROUPEID] as string;
        }
        if (groupeid.length < 1) {
          continue;
        }
        if (!groupesMap.has(groupeid)) {
          const pg = await store.findItemByIdAsync(initialGroupe, groupeid);
          if (!pg) {
            continue;
          }
          groupesMap.set(groupeid, pg.sigle);
        }
        const groupe = groupesMap.get(groupeid);
        const controleid = doc[DomainConstants.FIELD_ID] as string;
        let date = doc[DomainConstants.FIELD_DATE]
          ? (doc[DomainConstants.FIELD_DATE] as string)
          : "";
        if (date.length > 0) {
          date = DateUtils.toDisplay(date);
        }
        const filter: Record<string, unknown> = { controleid };
        const xdocs = await store.findAllDocsBySelectorAsync(filter);
        const l = xdocs.length;
        for (let k = 0; k < l; k++) {
          const xdoc = xdocs[k];
          const stype = xdoc[DomainConstants.FIELD_TYPE] as string;
          if (
            stype !== DomainConstants.TYPE_NOTE &&
            stype !== DomainConstants.TYPE_EVT
          ) {
            continue;
          }
          const etudiantid = xdoc[DomainConstants.FIELD_ETUDIANTID] as string;
          const pEtud = await store.findItemByIdAsync(
            initialEtudiant,
            etudiantid
          );
          if (!pEtud) {
            continue;
          }
          if (!workMap.has(etudiantid)) {
            workMap.set(etudiantid, { count: 0, sumcoefs: 0, sumvalues: 0 });
            dataMap.set(etudiantid, {
              id: etudiantid,
              name: pEtud._fullname as string,
              url: pEtud._url,
              groupe: groupe,
              note: -1.0,
              observations: [],
              evts: [],
            });
          } // create
          if (stype === DomainConstants.TYPE_NOTE) {
            if (xdoc[DomainConstants.FIELD_VALUE]) {
              const note = xdoc[DomainConstants.FIELD_VALUE] as number;
              if (note >= 0.0 && note <= 20.0) {
                const w = workMap.get(etudiantid);
                const ww: ICumuItem = {
                  count: w.count + 1,
                  sumcoefs: w.sumcoefs + coef,
                  sumvalues: w.sumvalues + coef * note,
                };
                workMap.set(etudiantid, ww);
              } // note
            } // value
          } // note
          if (stype === DomainConstants.TYPE_EVT) {
            const etype = xdoc[DomainConstants.FIELD_EVTTYPE] as EvtType;
            const s = date + ": " + ConvertEvtTypeToString(etype);
            const w = dataMap.get(etudiantid);
            const x = [...w.evts, s];
            const ww = { ...w, evts: x };
            dataMap.set(etudiantid, ww);
          } // evt
          if (xdoc[DomainConstants.FIELD_OBSERVATIONS]) {
            const observations: string = (
              xdoc[DomainConstants.FIELD_OBSERVATIONS] as string
            ).trim();
            if (observations.length > 0) {
              const s = date + ": " + observations;
              const w = dataMap.get(etudiantid);
              const x = [...w.observations, s];
              const ww = { ...w, observations: x };
              dataMap.set(etudiantid, ww);
            } // add
          } // observations
        } // k
      } // j
    } // i
    workMap.forEach((val, etudiantid) => {
      const w = dataMap.get(etudiantid);
      const count = val.count;
      if (count > 0 && val.sumcoefs > 0.0) {
        const v =
          Math.floor((val.sumvalues / val.sumcoefs) * 100 + 0.5) / 100.0;
        const ww = { ...w, note: v };
        dataMap.set(etudiantid, ww);
      }
    });
    dataMap.forEach((val) => {
      if (val.evts.length > 1) {
        val.evts.sort((a, b) => {
          if (a < b) {
            return 1;
          } else if (a > b) {
            return -1;
          }
          return 0;
        });
      }
      if (val.observations.length > 1) {
        val.observations.sort((a, b) => {
          if (a < b) {
            return 1;
          } else if (a > b) {
            return -1;
          }
          return 0;
        });
      }
      pRet.push(val);
    });
    if (pRet.length > 1) {
      pRet.sort((a, b) => {
        if (a.note < b.note) {
          return 1;
        } else if (a.note > b.note) {
          return -1;
        }
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } // sort
    return pRet;
  } // getMatiereStats
} // class StatServices
