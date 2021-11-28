import { ConvertData } from "./ConvertData";
import { DomainConstants } from "./DomainConstants";
import { initialAnnee } from "./IAnneeDoc";
import type { IDataStore } from "./IDataStore";
import { IEtudAffectationDoc, initialEtudAffectation } from "./IEtudAffectation";
import { initialGroupe } from "./IGroupeDoc";
import { ItemServices } from "./ItemServices";
import { initialEtudiant } from './IEtudiantDoc';
//
export class EtudAffectationServices extends ItemServices<IEtudAffectationDoc> {
    //
    constructor(
        store?: IDataStore, dbUrl?: string
    ) {
        super(initialEtudAffectation, store,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<IEtudAffectationDoc> {
        const p = ConvertData.ConvertDataItem(this._item, doc)
        const store = this.datastore
        const annee = await store.findItemByIdAsync(initialAnnee, p.anneeid)
        if (annee) {
            p._anneeSigle = annee.sigle;
        }
        const groupe = await store.findItemByIdAsync(initialGroupe, p.groupeid)
        if (groupe) {
            p._groupeSigle = groupe.sigle;
            p._semestreSigle = groupe._semestreSigle;
            p._semestreid = groupe.semestreid;
        }
        const etud = await store.findItemByIdAsync(initialEtudiant, p.etudiantid)
        if (etud) {
            p._lastname = etud.lastname;
            p._firstname = etud.firstname;
            p._fullname = etud._fullname;
            p._avatar = etud._avatar;
            p._url = etud._url;
            p._photoData = etud._photoData;
        }
        store.register_item(p)
        return p
    }// registerDocAsync
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
            const store = this.datastore;
            const ix = await store.findOneItemIdByFilter({
                doctype: DomainConstants.TYPE_ETUDAFFECTATION,
                etudiantid,
                anneeid,
                groupeid,
            });
            if (ix && ix.length > 0) {
                return ix;
            }
        } // matiere && semestre
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: IEtudAffectationDoc): boolean {
        return (
            p.etudiantid.trim().length > 0 &&
            p.anneeid.trim().length > 0 &&
            p.groupeid.trim().length > 0
        );
    } // getPersistMap
    protected getPersistMap(
        current: IEtudAffectationDoc
    ): Record<string, unknown> {
        const data = super.getPersistMap(current);
        const etudiantid = current.etudiantid;
        const anneeid = current.anneeid;
        const groupeid = current.groupeid;
        data[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
        data[DomainConstants.FIELD_ANNEEID] = anneeid;
        data[DomainConstants.FIELD_GROUPEID] = groupeid;
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
