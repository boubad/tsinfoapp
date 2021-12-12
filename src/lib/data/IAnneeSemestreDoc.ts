//

import type { IBaseDoc } from "./IBaseDoc";

//
export interface IAnneeSemestreDoc extends IBaseDoc {
    anneeid: string;
    semestreid: string;
    _anneeSigle?: string;
    _semestreSigle?: string;
} // interface IAnneeSemestreGroupeDoc
