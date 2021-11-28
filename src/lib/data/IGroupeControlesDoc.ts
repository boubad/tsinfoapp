import { DomainConstants } from "./DomainConstants";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import { ControleType } from "./ControleType";

export interface IGroupeControlesDoc extends ISigleNamedDoc {
    matiereid: string;
    semestreid: string;
    coefficient: number;
    controletype: ControleType;
    duration?: string;
    hasnotes: boolean;
    //
    _matiereCoeff?: number;
    _semestreSigle?: string;
    _matiereSigle?: string;
    _uniteid?:string;
    _uniteSigle?: string;
}
export function CreateGroupeControles(semestreid?: string, matiereid?: string): IGroupeControlesDoc {
    return {
        _id: "",
        _rev: "",
        sigle: "",
        name: "",
        controletype: ControleType.Unknown,
        semestreid: semestreid ? semestreid : "",
        matiereid: matiereid ? matiereid : "",
        doctype: DomainConstants.TYPE_GROUPCONTROLE,
        _linkfield: DomainConstants.FIELD_GROUPECONTROLEID,
        coefficient: 1.0,
        hasnotes: true,
    };
} // GetInitialGroupeControles
//
export const initialGroupeControles: IGroupeControlesDoc = CreateGroupeControles();
