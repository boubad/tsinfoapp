import type { IEtudiantStatItem } from "./IEtudiantStatItem";

export interface  IMatiereStatItem  extends  IEtudiantStatItem  {
    readonly note:number;
    readonly evts: string[];
}// type IMatiereStatItem