import { DomainConstants } from "./DomainConstants";
import type { IBaseDoc } from "./IBaseDoc";

export interface IEtudAffectationDoc extends IBaseDoc {
    anneeid: string;
    etudiantid: string;
    groupeid: string;
    startdate?: string;
    enddate?: string;
    _anneeSigle?: string;
    _semestreSigle?: string;
    _semestreid?: string;
    _groupeSigle?: string;
    _lastname?: string;
    _firstname?: string;
    _fullname?: string;
    _photoData?: ArrayBuffer;
}
export function CreateEtudAffectation(anneeid?: string, groupeid?: string, etudiantid?: string): IEtudAffectationDoc {
    return (
        {
            _id: "",
            _rev: "",
            anneeid: anneeid ? anneeid : "",
            groupeid: groupeid ? groupeid : "",
            etudiantid: etudiantid ? etudiantid : "",
            doctype: DomainConstants.TYPE_ETUDAFFECTATION,
            startdate: new Date().toISOString().slice(0, 10),
            enddate: new Date().toISOString().slice(0, 10),
        }
    );
} // GetInitialEtudAffectation
export const initialEtudAffectation: IEtudAffectationDoc = CreateEtudAffectation();
