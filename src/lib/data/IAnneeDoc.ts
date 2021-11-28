import { DomainConstants } from './DomainConstants';
import type { ISigleNamedDoc } from './ISigleNamedDoc';
//
export interface IAnneeDoc extends ISigleNamedDoc {
    startdate: string;
    enddate: string;
} // interface IAnneeAdoc
export function CreateAnnee(): IAnneeDoc {
    return (
        {
            _id: "",
            _rev: "",
            sigle: "",
            name: "",
            startdate: new Date().toISOString().slice(0, 10),
            enddate: new Date().toISOString().slice(0, 10),
            doctype: DomainConstants.TYPE_ANNEE,
            _linkfield: DomainConstants.FIELD_ANNEEID,
        }
    );
} // CreateAnnee
//
export const initialAnnee: IAnneeDoc = CreateAnnee();
//