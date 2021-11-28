// IMatiereDoc.ts
//
import { DomainConstants } from './DomainConstants';
import type { ISigleNamedDoc } from './ISigleNamedDoc';
//
export interface IMatiereDoc extends ISigleNamedDoc {
    uniteid: string;
    module_name: string;
    coefficient: number;
    ecs: number;
    //
    _uniteSigle?: string;
    //
} // interface IMatiereDoc
//
export function CreateMatiere(uniteid?: string): IMatiereDoc {
    return (
        {
            _id: "",
            _rev: "",
            sigle: "",
            name: "",
            module_name: "",
            coefficient: 1.0,
            ecs: 0,
            uniteid: uniteid ? uniteid : "",
            doctype: DomainConstants.TYPE_MATIERE,
            _linkfield: DomainConstants.FIELD_MATIEREID,
        }
    );
} // GetInitialMatiere
//
export const initialMatiere: IMatiereDoc = CreateMatiere();
