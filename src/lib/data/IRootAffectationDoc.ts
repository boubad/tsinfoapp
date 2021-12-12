import type { IAnneeSemestreDoc } from "./IAnneeSemestreDoc";

export interface IRootAffectationDoc extends IAnneeSemestreDoc {
  startdate?: string;
  enddate?: string;
} // interface IAffectationBaseDoc
