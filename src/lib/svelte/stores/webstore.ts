import type { IPaginationData } from "../../data/IPaginationData";
import { GetInitialPaginationData } from "../../data/PaginationUtils";
import { InfoStorage } from "../../data/InfoStorage";
import { DomainConstants } from "../../data/DomainConstants";
import { StatusType } from "../../data/StatusType";
//
export class InfoWebStorage extends InfoStorage {
  //
  private static readonly KEY_ETUDPAGINAION = "etudpagination";
  private static readonly KEY_ETUDFILTER = "etudfilter";
  private static readonly KEY_ANNEEID = "anneeid";
  private static readonly KEY_SEMESTREID = "semestreid";
  private static readonly KEY_GROUPEID = "groupeid";
  private static readonly KEY_UNITEID = "uniteid";
  private static readonly KEY_MATIEREID = "matiereid";
  //
  constructor(type?: string) {
    super(type);
  } // constructor
  //
  public get etudiantPagination(): IPaginationData {
    const r = this.getObject(InfoWebStorage.KEY_ETUDPAGINAION);
    const u = r as unknown;
    return u ? (u as IPaginationData) : GetInitialPaginationData();
  } // etudiantPagination
  public set etudiantPagination(v: IPaginationData) {
    const u = v as unknown;
    this.setObject(
      InfoWebStorage.KEY_ETUDPAGINAION,
      u as Record<string, unknown>
    );
  } // etudiantPagination
  public get etudiantFilter(): Record<string, unknown> {
    const r = this.getObject(InfoWebStorage.KEY_ETUDFILTER);
    const u = r as unknown;
    return u
      ? (u as Record<string, unknown>)
      : {
          doctype: DomainConstants.TYPE_ETUDIANT,
          status: StatusType.Normal,
        };
  } // etudiantfilter
  public set etudiantFilter(v: Record<string, unknown>) {
    this.setObject(InfoWebStorage.KEY_ETUDPAGINAION, v);
  } // etudiantFilter
  public get anneeid(): string {
    const s = this.get(InfoWebStorage.KEY_ANNEEID);
    return s ? s : "";
  } // anneeid
  public set anneeid(s: string) {
    this.set(InfoWebStorage.KEY_ANNEEID, s);
  } // anneeid
  public get semestreid(): string {
    const s = this.get(InfoWebStorage.KEY_SEMESTREID);
    return s ? s : "";
  } // semestreid
  public set semestreid(s: string) {
    this.set(InfoWebStorage.KEY_SEMESTREID, s);
  } // semestreid
  public get groupeid(): string {
    const s = this.get(InfoWebStorage.KEY_GROUPEID);
    return s ? s : "";
  } // groupeid
  public set groupeid(s: string) {
    this.set(InfoWebStorage.KEY_GROUPEID, s);
  } // groupeid
  public get uniteid(): string {
    const s = this.get(InfoWebStorage.KEY_UNITEID);
    return s ? s : "";
  } // uniteid
  public set uniteid(s: string) {
    this.set(InfoWebStorage.KEY_UNITEID, s);
  } // uniteid
  public get matiereid(): string {
    const s = this.get(InfoWebStorage.KEY_MATIEREID);
    return s ? s : "";
  } // matiereid
  public set matiereid(s: string) {
    this.set(InfoWebStorage.KEY_MATIEREID, s);
  } // matiereid
  //
} // class InfoWebStorage
