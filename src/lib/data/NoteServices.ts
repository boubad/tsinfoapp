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
