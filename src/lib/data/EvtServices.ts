import { DomainConstants } from "./DomainConstants";
import { EvtType } from './EvtType';
import { IEvtDoc, initialEvt } from "./IEvtDoc";
import { ControleChildServices } from "./ControleChildServices";
import type { IDataStore } from "./IDataStore";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class EvtServices extends ControleChildServices<IEvtDoc> {
    //
    constructor(
        store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string
    ) {
        super(initialEvt, store, creator, dbUrl);
    }
    protected async fetchUniqueId(
        current: IEvtDoc
    ): Promise<string | undefined> {
        const store = this.datastore;
        const id = current._id.trim();
        if (id.length > 0) {
            const rev = await store.findDocRevisionAsync(id);
            if (rev && rev.length > 0) {
                return id;
            }
        }
        const controleid = current.controleid;
        const etudiantid = current.etudiantid;
        const etype = current.evttype;
        if (controleid.length > 1 && etudiantid.length > 0 && etype !== EvtType.Inconnu) {
            const sel: Record<string, unknown> = {};
            sel[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_EVT;
            sel[DomainConstants.FIELD_CONTROLEID] = controleid;
            sel[DomainConstants.FIELD_ETUDIANTID] = etudiantid;
            sel[DomainConstants.FIELD_EVTTYPE] = etype;
            const ix = await store.findOneItemIdByFilter(sel);
            if (ix && ix.length > 0) {
                return ix;
            }
        } // id
        return undefined;
    } // fetchUniqueId
    protected getPersistMap(current: IEvtDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        if (current.evttype !== EvtType.Inconnu
        ) {
            data[DomainConstants.FIELD_EVTTYPE] = current.evttype;
        }
        if (
            current.duration &&
            current.duration.trim().length > 0
        ) {
            data[DomainConstants.FIELD_DURATION] = current.duration.trim();
        }
        if (current.justifie !== undefined) {
            data[DomainConstants.FIELD_JUSTIFIE] = current.justifie;
        }
        return data;
    } // SaveItemAsync
} // class NotesServices
//
