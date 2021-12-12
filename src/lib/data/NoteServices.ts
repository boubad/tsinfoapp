import { ControleChildServices } from "./ControleChildServices";
import { DomainConstants } from "./DomainConstants";
import type { IDataStore } from "./IDataStore";
import type { IDataUrlCreator } from "./IDataUrlCreator";
import { INoteDoc, initialNote } from "./INoteDoc";

//
export class NoteServices extends ControleChildServices<INoteDoc> {
    //
    constructor(
        store: IDataStore, creator?:IDataUrlCreator, dbUrl?: string
    ) {
        super(initialNote, store,creator,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<INoteDoc> {
        const p = await super.registerDocAsync(doc)
        this.datastore.register_item(p)
        return p
    }// registerDocAsync
    protected getPersistMap(current: INoteDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        if (
            current.value !== undefined
        ) {
            data[DomainConstants.FIELD_VALUE] = current.value;
        }
        return data;
    } // SaveItemAsync
} // class NoteServices
//
