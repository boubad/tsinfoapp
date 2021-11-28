import { DomainConstants } from "./DomainConstants";
import { ItemServices } from "./ItemServices";
import type { IControleChildDoc } from "./IControleChildDoc";
import type { IDataStore } from "./IDataStore";
import { ConvertData } from "./ConvertData";
import { initialEtudiant } from "./IEtudiantDoc";
import { initialControle } from './IControleDoc';

//
export class ControleChildServices<
    T extends IControleChildDoc
    > extends ItemServices<T> {
    //
    constructor(
        item: T,
        store?: IDataStore, dbUrl?: string
    ) {
        super(item, store,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<T> {
        const p = ConvertData.ConvertDataItem(this._item, doc)
        const store = this.datastore;
        const etud = await store.findItemByIdAsync(initialEtudiant, p.etudiantid)
        if (etud) {
            p._lastname = etud.lastname;
            p._firstname = etud.firstname;
            p._fullname = etud._fullname;
            p._avatar = etud._avatar;
            p._url = etud._url;
            p._photoData = etud._photoData;
        }
        const cont = await store.findItemByIdAsync(initialControle, p.controleid)
        if (cont) {
            p._uniteSigle = cont._uniteSigle;
            p._uniteid = cont._uniteid;
            p._matiereCoeff = cont._matiereCoeff;
            p._matiereSigle = cont._matiereSigle;
            p._matiereid = cont._matiereid;
            p._semestreSigle = cont._semestreSigle;
            p._semestreid = cont._semestreid;
            p._groupeid = cont.groupeid;
            p._groupeSigle = cont._groupeSigle;
            p._anneeSigle = cont._anneeSigle;
            p._anneeid = cont.anneeid;
            p._controleCoeff = cont._coefficient;
            p._controleName = cont._name;
            p._date = cont.date;
            p._groupecontroleid = cont.groupecontroleid;
            p._groupeControlesSigle = cont._groupeControlesSigle;
        }// cont
        return p
    }// registerDocAsync
    //
    protected async fetchUniqueId(
        current: T
    ): Promise<string | undefined> {
        const sret = await super.fetchUniqueId(current)
        if (sret && sret.length > 0) {
            return sret;
        }
        const controleid = current.controleid;
        const etudiantid = current.etudiantid;
        if (controleid.length > 1 && etudiantid.length > 0) {
            const store = this.datastore;
            const ix = await store.findOneItemIdByFilter({
                doctype: this._item.doctype,
                controleid,
                etudiantid,
            });
            if (ix && ix.length > 0) {
                return ix;
            }
        } // id
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: T): boolean {
        return p.controleid.trim().length > 0 && p.etudiantid.trim().length > 0;
    } // getPersistMap
    protected getPersistMap(current: T): Record<string, unknown> {
        const data = super.getPersistMap(current);
        const controleid = current.controleid;
        const etudiantid = current.etudiantid;
        data[DomainConstants.FIELD_CONTROLEID] = controleid;
        data[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
        return data;
    } // SaveItemAsync
} // class  ControleChildServices
//
