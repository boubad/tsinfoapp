import { DomainConstants } from './DomainConstants';
import type { IBaseDoc } from './IBaseDoc';
import type { ControleType } from './ControleType';

export interface IControleDoc extends IBaseDoc {
    anneeid: string;
    groupeid: string;
    groupecontroleid: string;
    date: string;
    place?: string;
    //
    _name?: string;
    _anneeSigle?: string;
    _semestreid?: string;
    _semestreSigle?: string;
    _groupeSigle?: string;
    _matiereid?: string;
    _matiereSigle?: string;
    _uniteid?: string;
    _uniteSigle?: string;
    _matiereCoeff?: number;
    _groupeControlesSigle?: string;
    _coefficient?: number;
    _controletype?: ControleType;
    _duration?: string;
    _hasnotes?: boolean;
    //
} // interface IControleDoc
export function CreateControle(groupecontroleid?: string, anneeid?: string, groupeid?: string): IControleDoc {
    return (
        {
            _id: "",
            _rev: "",
            groupecontroleid: groupecontroleid ? groupecontroleid : '',
            anneeid: anneeid ? anneeid : '',
            groupeid: groupeid ? groupeid : '',
            date: new Date().toISOString().slice(0, 10),
            doctype: DomainConstants.TYPE_CONTROLE,
            _linkfield: DomainConstants.FIELD_CONTROLEID,
        }
    );
} // GetInitialControle
//
export const initialControle: IControleDoc = CreateControle();
