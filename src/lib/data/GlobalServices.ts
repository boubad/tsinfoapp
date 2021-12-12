import type { IDataOption } from "./IDataOption";
import { BaseServices } from "./BaseServices";
import type { IGlobalPayload } from "./IGlobalPayload";
import type { IDataStore } from "./IDataStore";
import { initialAnnee } from "./IAnneeDoc";
import { initialSemestre } from "./ISemestreDoc";
import { initialGroupe } from "./IGroupeDoc";
import { initialUnite } from "./IUniteDoc";
import { initialMatiere } from "./IMatiereDoc";
import { GroupeType } from "./GroupeType";
import type { IDataUrlCreator } from "./IDataUrlCreator";
//
export class GlobalServices extends BaseServices {
  constructor(store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string) {
    super(store, creator, dbUrl);
  }
  //
  private _selectItemId(
    options: readonly IDataOption[],
    oldId: string
  ): string {
    const n = options.length;
    if (oldId.length > 0) {
      for (let i = 0; i < n; i++) {
        if (options[i].value === oldId) {
          return oldId;
        }
      } // i
    } // oldId
    let sret = "";
    if (n > 1) {
      sret = options[1].value;
    }
    return sret;
  } // _selectItemId
  //
  public async refreshAnneesAsync(
    anneeid: string,
    filterAnnee?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    const annees = await this.getItemOptionsAsync(initialAnnee, filterAnnee, true);
    const id = this._selectItemId(annees, anneeid);
    if (id.length > 0) {
      return {
        ok: true,
        annees: annees,
        anneeid: id,
      };
    }
    return {
      ok: true,
      annees: annees,
      anneeid: "",
    };
  } // refreshAnneeAsync
  public async changeAnneeIdAsync(anneeid: string): Promise<IGlobalPayload> {
    const a = await this.datastore.findItemByIdAsync(initialAnnee, anneeid);
    if (a) {
      return {
        ok: true,
        anneeid: a._id,
      };
    }
    return {
      ok: true,
      anneeid: "",
    };
  } // changeAnneeIdAsync
  //
  public async refreshSemestresAsync(
    semestreid: string,
    groupeid: string,
    filterSemestre?: Record<string, unknown>,
    filterGroupe?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    const pRet: IGlobalPayload = {
      ok: true,
      semestreid: "",
      groupes: [],
      groupeid: "",
    };
    const store = this.datastore;
    const semestres = await this.getItemOptionsAsync(
      initialSemestre,
      filterSemestre
    );
    pRet.semestres = semestres;
    const id = this._selectItemId(semestres, semestreid);
    if (id.length > 0) {
      const sem = await store.findItemByIdAsync(initialSemestre, id);
      if (sem) {
        pRet.semestreid = id;
        const filter1 = filterGroupe
          ? { ...filterGroupe, semestreid: id, groupetype: GroupeType.Tp }
          : { semestreid: id, groupetype: GroupeType.Tp };
        const groupes = await this.getItemOptionsAsync(initialGroupe, filter1);
        pRet.groupes = groupes;
        const id2 = this._selectItemId(groupes, groupeid);
        if (id2.length > 0) {
          const groupe = await store.findItemByIdAsync(initialGroupe, id2);
          if (groupe) {
            pRet.groupeid = id2;
          }
        }
      } // semestre
    } // semestre id
    return pRet;
  } // refreshSemestreAsync
  public async changeSemestreIdAsync(
    semestreid: string,
    groupeid: string,
    filterGroupe?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    const pRet: IGlobalPayload = {
      ok: true,
      semestreid: "",
      groupes: [],
      groupeid: "",
    };
    const store = this.datastore;
    const id = semestreid.trim();
    if (id.length > 0) {
      const sem = await store.findItemByIdAsync(initialSemestre, id);
      if (sem) {
        pRet.semestreid = id;
        const filter1 = filterGroupe
          ? { ...filterGroupe, semestreid: id, groupetype: GroupeType.Tp }
          : { semestreid: id, groupetype: GroupeType.Tp };
        const groupes = await this.getItemOptionsAsync(initialGroupe, filter1);
        pRet.groupes = groupes;
        const id2 = this._selectItemId(groupes, groupeid);
        if (id2.length > 0) {
          const groupe = await store.findItemByIdAsync(initialGroupe, id2);
          if (groupe) {
            pRet.groupeid = id2;
          }
        }
      } // semestre
    } // semestre id
    return pRet;
  } // changeSemestreIdAsync
  //
  public async refreshGroupesAsync(
    groupeid: string,
    semestreid: string,
    filterGroupe?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      groupeid: "",
    };
    const xfilter = filterGroupe
      ? { ...filterGroupe, semestreid: semestreid, groupetype: GroupeType.Tp }
      : { semestreid: semestreid, groupetype: GroupeType.Tp };
    const groupes = await this.getItemOptionsAsync(initialGroupe, xfilter);
    pRet.groupes = groupes;
    const id = this._selectItemId(groupes, groupeid);
    if (id.length > 0) {
      const groupe = await this.datastore.findItemByIdAsync(initialGroupe, id);
      if (groupe) {
        pRet.groupeid = id;
      }
    }
    return pRet;
  } // refreshGroupeAsync
  public async changeGroupeIdAsync(groupeid: string): Promise<IGlobalPayload> {
    const pRet: IGlobalPayload = { ok: true, groupeid: "" };
    const g = await this.datastore.findItemByIdAsync(initialGroupe, groupeid);
    if (g) {
      pRet.groupeid = g._id;
    }
    return pRet;
  } // changeGroupeIdAsync
  //
  public async refreshUnitesAsync(
    uniteid: string,
    matiereid: string,
    filterUnite?: Record<string, unknown>,
    filterMatiere?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      unites: [],
      uniteid: "",
      matieres: [],
      matiereid: "",
    };
    const store = this.datastore;
    const unites = await this.getItemOptionsAsync(initialUnite, filterUnite);
    pRet.unites = unites;
    const id = this._selectItemId(unites, uniteid);
    if (id.length > 0) {
      const unite = await store.findItemByIdAsync(initialUnite, id);
      if (unite) {
        pRet.uniteid = unite._id;
        const filter1 = filterMatiere
          ? { ...filterMatiere, uniteid: id }
          : { uniteid: id };
        const matieres = await this.getItemOptionsAsync(
          initialMatiere,
          filter1
        );
        pRet.matieres = matieres;
        const id2 = this._selectItemId(matieres, matiereid);
        if (id2.length > 0) {
          const matiere = await store.findItemByIdAsync(initialMatiere, id2);
          if (matiere) {
            pRet.matiereid = matiere._id;
          } // matiere
        } // id
      } // semestre
    } // semestre id
    return pRet;
  } // refreshUnitesAsync
  public async changeUniteIdAsync(
    uniteid: string,
    matiereid: string,
    filterMatiere?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      uniteid: "",
      matieres: [],
      matiereid: "",
    };
    const store = this.datastore;
    const id = uniteid.trim();
    if (id.length > 0) {
      const unite = await store.findItemByIdAsync(initialUnite, id);
      if (unite) {
        pRet.uniteid = unite._id;
        const filter1 = filterMatiere
          ? { ...filterMatiere, uniteid: uniteid }
          : { uniteid: uniteid };
        const matieres = await this.getItemOptionsAsync(
          initialMatiere,
          filter1
        );
        pRet.matieres = matieres;
        const id2 = this._selectItemId(matieres, matiereid);
        if (id2.length > 0) {
          const matiere = await store.findItemByIdAsync(initialMatiere, id2);
          if (matiere) {
            pRet.matiereid = matiere._id;
          } // matiere
        } // id
      } // semestre
    } // semestre id
    return pRet;
  } // changeUniteIdAsync
  public async refreshMatieresAsync(
    uniteid: string,
    matiereid: string,
    filterMatiere?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      matieres: [],
      matiereid: "",
    };
    const store = this.datastore;
    if (uniteid.length > 0) {
      const xfilter = filterMatiere
        ? { ...filterMatiere, uniteid: uniteid }
        : { uniteid: uniteid };
      const matieres = await this.getItemOptionsAsync(initialMatiere, xfilter);
      pRet.matieres = matieres;
      const id2 = this._selectItemId(matieres, matiereid);
      if (id2.length > 0) {
        const matiere = await store.findItemByIdAsync(initialMatiere, id2);
        if (matiere) {
          pRet.matiereid = matiere._id;
        } // matiere
      } // id
    } // semestre
    return pRet;
  } //  refreshMatieresAsync
  public async changeMatiereIdAsync(
    matiereid: string
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      matiereid: "",
    };
    const store = this.datastore;
    if (matiereid.length > 0) {
      const id2 = matiereid;
      if (id2.length > 0) {
        const matiere = await store.findItemByIdAsync(initialMatiere, id2);
        if (matiere) {
          pRet.matiereid = matiere._id;
        } // matiere
      } // id
    } // semestre
    return pRet;
  } // changeMatiereIdAsync
  public async refreshAllAsync(
    anneeid: string,
    semestreid: string,
    uniteid: string,
    matiereid: string,
    groupeid: string,
    filterAnnee?: Record<string, unknown>,
    filterSemestre?: Record<string, unknown>,
    filterUnite?: Record<string, unknown>,
    filterMatiere?: Record<string, unknown>,
    filterGroupe?: Record<string, unknown>
  ): Promise<IGlobalPayload> {
    let pRet: IGlobalPayload = {
      ok: true,
      annees: [],
      anneeid: "",
      semestres: [],
      semestreid: "",
      groupes: [],
      groupeid: "",
      unites: [],
      uniteid: "",
      matieres: [],
      matiereid: "",
    };
    const store = this.datastore;
    const annees = await this.getItemOptionsAsync(initialAnnee, filterAnnee);
    pRet.annees = annees;
    anneeid = this._selectItemId(annees, anneeid);
    if (anneeid.length > 0) {
      const a = await store.findItemByIdAsync(initialAnnee, anneeid);
      if (a) {
        pRet.anneeid = a._id;
      }
    }
    const semestres = await this.getItemOptionsAsync(
      initialSemestre,
      filterSemestre
    );
    pRet.semestres = semestres;
    semestreid = this._selectItemId(semestres, semestreid);
    if (semestreid.length > 0) {
      const s = await store.findItemByIdAsync(initialSemestre, semestreid);
      if (s) {
        pRet.semestreid = s._id;
        const xfilter = filterGroupe
          ? {
            ...filterGroupe,
            semestreid: semestreid,
            groupetype: GroupeType.Tp,
          }
          : { semestreid: semestreid, groupetype: GroupeType.Tp };
        const groupes = await this.getItemOptionsAsync(initialGroupe, xfilter);
        pRet.groupes = groupes;
        groupeid = this._selectItemId(groupes, groupeid);
        if (groupeid.length > 0) {
          const s = await store.findItemByIdAsync(initialGroupe, groupeid);
          if (s) {
            pRet.groupeid = s._id;
          }
        }
      }
    }
    const unites = await this.getItemOptionsAsync(initialUnite, filterUnite);
    pRet.unites = unites;
    uniteid = this._selectItemId(unites, uniteid);
    if (uniteid.length > 0) {
      const s = await store.findItemByIdAsync(initialUnite, uniteid);
      if (s) {
        pRet.uniteid = s._id;
        const xfilter = filterMatiere
          ? { ...filterMatiere, uniteid: uniteid }
          : { uniteid: uniteid };
        const matieres = await this.getItemOptionsAsync(
          initialMatiere,
          xfilter
        );
        pRet.matieres = matieres;
        matiereid = this._selectItemId(matieres, matiereid);
        if (matiereid.length > 0) {
          const s = await store.findItemByIdAsync(initialMatiere, matiereid);
          if (s) {
            pRet.matiereid = s._id;
          }
        }
      }
    }
    return pRet;
  } // RefreshAllAsync
  //
} // class AppStateServices
