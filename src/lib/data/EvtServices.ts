import { DomainConstants } from "./DomainConstants";
import { EvtType, ConvertEvtTypeToString } from './EvtType';
import { IEvtDoc, initialEvt } from "./IEvtDoc";
import { ControleChildServices } from "./ControleChildServices";
import type { IDataStore } from "./IDataStore";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class EvtServices extends ControleChildServices<IEvtDoc> {
    //
    constructor(
        store: IDataStore, creator?:IDataUrlCreator, dbUrl?: string
    ) {
        super(initialEvt, store,creator,dbUrl);
    }
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<IEvtDoc> {
        const p = await super.registerDocAsync(doc)
        p._name = ConvertEvtTypeToString(p.evttype);
        this.datastore.register_item(p)
        return p
    }// registerDocAsync
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
