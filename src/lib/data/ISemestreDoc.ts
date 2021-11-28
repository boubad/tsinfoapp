// ISemestreDoc.ts
//
import { DomainConstants } from './DomainConstants';
import type { ISigleNamedDoc } from './ISigleNamedDoc';
//
export interface ISemestreDoc extends ISigleNamedDoc { } // interface ISemestreDoc
//
export function CreateSemestre(): ISemestreDoc {
    return (
        {
            _id: "",
            _rev: "",
            sigle: "",
            name: "",
            doctype: DomainConstants.TYPE_SEMESTRE,
            _linkfield: DomainConstants.FIELD_SEMESTREID,
        }
    );
} // CreateSemestre
//
export const initialSemestre: ISemestreDoc = CreateSemestre();
