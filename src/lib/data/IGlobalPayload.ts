import type { IBasePayload } from "./IBasePayload";
import type { IDataOption } from "./IDataOption";
//
export interface IGlobalPayload extends IBasePayload {
  annees?: readonly IDataOption[];
  semestres?: readonly IDataOption[];
  groupes?: readonly IDataOption[];
  unites?: readonly IDataOption[];
  matieres?: readonly IDataOption[];
  anneeid?: string;
  semestreid?: string;
  groupeid?: string;
  uniteid?: string;
  matiereid?: string;
} // interface IAppState
