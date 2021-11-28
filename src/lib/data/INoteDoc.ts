import { DomainConstants } from './DomainConstants';
import type { IControleChildDoc } from './IControleChildDoc';

export interface INoteDoc extends IControleChildDoc {
    value?: number | undefined;
}
export function CreateNote(controleid?: string, etudiantid?: string): INoteDoc {
    return (
        {
            _id: "",
            _rev: "",
            controleid: controleid ? controleid : "",
            etudiantid: etudiantid ? etudiantid : "",
            doctype: DomainConstants.TYPE_NOTE,
        }
    );
} // GetInitialNote
//
export const initialNote: INoteDoc = CreateNote();
