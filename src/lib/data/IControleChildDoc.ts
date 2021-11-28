// IControleChildDoc.ts
//

import type { IBaseDoc } from "./IBaseDoc";

export interface IControleChildDoc extends IBaseDoc {
    controleid: string;
    etudiantid: string;
    //
    _uniteid?:string;
    _anneeid?:string;
    _anneeSigle?: string;
    _semestreid?:string;
    _semestreSigle?: string;
    _matiereid?:string;
    _matiereSigle?: string;
    _groupeid?:string;
    _groupeSigle?:string;
    _controleCoeff?: number;
    _matiereCoeff?: number;
    _uniteSigle?: string;
    _firstname?: string;
    _lastname?: string;
    _fullname?: string;
    _avatar?: string;
    _url?: string;
    _controleName?: string;
    _date?: string;
    _photoData?: ArrayBuffer;
    _groupecontroleid?:string;
    _groupeControlesSigle?:string;
} // interface IControleChildDoc
