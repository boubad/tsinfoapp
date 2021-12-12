import type { IDataOption } from "./IDataOption";
import type { IGroupeDoc } from "./IGroupeDoc";
import type { IMatiereDoc } from "./IMatiereDoc";
import type { IControleDoc } from "./IControleDoc";
import type { IEtudAffectationDoc } from "./IEtudAffectationDoc";

export interface IGlobalStatePayload {
  annees?: IDataOption[];
  semestres?: IDataOption[];
  groupes?: IDataOption[];
  unites?: IDataOption[];
  matieres?: IDataOption[];
  groupescontroles?: IDataOption[];
  anneeid?: string;
  semestreid?: string;
  groupeid?: string;
  uniteid?: string;
  matiereid?: string;
  controles?: IControleDoc[];
  etudaffectations?: IEtudAffectationDoc[];
  matieredocs?: IMatiereDoc[];
  groupedocs?: IGroupeDoc[];
} // interface IGlobalStatePayload
