import { DomainConstants } from "./DomainConstants";
import { EvtType } from "./EvtType";
import { CreateAnnee, IAnneeDoc } from "./IAnneeDoc";
import type { IBaseDoc } from "./IBaseDoc";
import type { IControleChildDoc } from "./IControleChildDoc";
import { CreateControle, IControleDoc } from "./IControleDoc";
import { CreateEtudiant, IEtudiantDoc } from "./IEtudiantDoc";
import { CreateEvt, IEvtDoc } from "./IEvtDoc";
import {
    CreateGroupeControles,
    IGroupeControlesDoc,
} from "./IGroupeControlesDoc";
import { CreateGroupe, IGroupeDoc } from "./IGroupeDoc";
import { CreateMatiere, IMatiereDoc } from "./IMatiereDoc";
import { CreateNote, INoteDoc } from "./INoteDoc";
import type { IPersonDoc } from "./IPersonDoc";
import { CreateSemestre, ISemestreDoc } from "./ISemestreDoc";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import { CreateUnite, IUniteDoc } from "./IUniteDoc";
import type {
    IItemAnnee,
    IItemControle,
    IItemControleChild,
    IItemDoc,
    IItemEtudAffectation,
    IItemEtudiant,
    IItemEvt,
    IItemGroupe,
    IItemGroupeControles,
    IItemMatiere,
    IItemNote,
    IItemPerson,
    IItemSemestre,
    IItemSigleNamed,
    IItemUnite,
} from "./InfoDomain";
import { ControleType } from "./ControleType";
import { CreateEtudAffectation, IEtudAffectationDoc } from "./IEtudAffectationDoc";
//
export class ConvertData {
    //
    public static ConvertDataItem<T extends IBaseDoc>(
        item: T,
        src: Record<string, unknown>
    ): T {
        const x: unknown = ConvertData.ConvertDataItemByType(item.doctype, src);
        return x as T;
    } // ConvertDataItem
    //
    public static CreateRecordFromType(doctype: string): Record<string, unknown> | undefined {
        switch (doctype) {
            case DomainConstants.TYPE_ANNEE:
                {
                    const x = CreateAnnee() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_CONTROLE:
                {
                    const x = CreateControle() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_ETUDAFFECTATION:
                {
                    const x = CreateEtudAffectation() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_ETUDIANT:
                {
                    const x = CreateEtudiant() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_EVT:
                {
                    const x = CreateEvt() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_GROUPE:
                {
                    const x = CreateGroupe() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_MATIERE:
                {
                    const x = CreateMatiere() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_NOTE:
                {
                    const x = CreateNote() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_SEMESTRE:
                {
                    const x = CreateSemestre() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_UNITE:
                {
                    const x = CreateUnite() as unknown;
                    return x as Record<string, unknown>;
                }
            case DomainConstants.TYPE_GROUPCONTROLE:
                {
                    const x = CreateGroupeControles() as unknown;
                    return x as Record<string, unknown>;
                }
            default:
                break;
        }// doctype
        return undefined;
    }// CreateRecordFromType
    //
    private static _convertGroupeDoc(p: IItemGroupe): IGroupeDoc {
        const pp = CreateGroupe();
        ConvertData._convertSigleNamedDoc(p, pp);
        if (p.semestreid) {
            pp.semestreid = p.semestreid.trim();
        }
        if (p.parentid) {
            pp.parentid = p.parentid;
        }
        if (p.groupetype) {
            pp.groupetype = p.groupetype;
        }
        return pp;
    } // ConvertGroupeDoc
    public static ConvertDataItemByType(
        doctype: string,
        src: Record<string, unknown>
    ): IBaseDoc {
        switch (doctype) {
            case DomainConstants.TYPE_ANNEE:
                return ConvertData._convertAnneeDoc(src);
            case DomainConstants.TYPE_CONTROLE:
                return ConvertData._convertControleDoc(src);
            case DomainConstants.TYPE_ETUDAFFECTATION:
                return ConvertData._convertEtudAffectationDoc(src);
            case DomainConstants.TYPE_ETUDIANT:
                return ConvertData._convertEtudiantDoc(src);
            case DomainConstants.TYPE_EVT:
                return ConvertData._convertEvtDoc(src);
            case DomainConstants.TYPE_GROUPE:
                return ConvertData._convertGroupeDoc(src);
            case DomainConstants.TYPE_MATIERE:
                return ConvertData._convertMatiereDoc(src);
            case DomainConstants.TYPE_NOTE:
                return ConvertData._convertNoteDoc(src);
            case DomainConstants.TYPE_SEMESTRE:
                return ConvertData._convertSemestreDoc(src);
            case DomainConstants.TYPE_UNITE:
                return ConvertData._convertUniteDoc(src);
            case DomainConstants.TYPE_GROUPCONTROLE:
                return ConvertData._convertGroupeControlesDoc(src);
            default:
                break;
        } // stype
        throw new Error("Invalid doctpe")
    } // ConvertDataItem
    private static _convertSemestreDoc(p: IItemSemestre): ISemestreDoc {
        const pp = CreateSemestre();
        ConvertData._convertSigleNamedDoc(p, pp);
        return pp;
    } // CconvertSemestreDoc
    private static _convertUniteDoc(p: IItemUnite): IUniteDoc {
        const pp = CreateUnite();
        ConvertData._convertSigleNamedDoc(p, pp);
        return pp;
    } // convertUniteDoc
    private static _convertMatiereDoc(p: IItemMatiere): IMatiereDoc {
        const pp = CreateMatiere();
        ConvertData._convertSigleNamedDoc(p, pp);
        pp.uniteid = p.uniteid ? p.uniteid : "";
        pp.module_name = p.modname ? p.modname : "";
        pp.coefficient = p.coefficient ? p.coefficient : 1.0;
        pp.ecs = p.ecs ? p.ecs : 0;
        return pp;
    } // convertMatiereDoc
    private static _convertAnneeDoc(p: IItemAnnee): IAnneeDoc {
        const pp = CreateAnnee();
        ConvertData._convertSigleNamedDoc(p, pp);
        pp.startdate = p.startdate ? p.startdate : "";
        pp.enddate = p.enddate ? p.enddate : "";
        return pp;
    } // convertAnneeDoc
    //
    private static _convertEtudiantDoc(p: IItemEtudiant): IEtudiantDoc {
        const pp = CreateEtudiant();
        ConvertData._convertPersonDoc(p, pp);
        pp.ident = p.ident ? p.ident : "";
        pp.departement = p.departement ? p.departement : "";
        pp.ville = p.ville ? p.ville : "";
        pp.etablissement = p.etablissement ? p.etablissement : "";
        pp.seriebac = p.seriebac ? p.seriebac : "";
        pp.optionbac = p.optionbac ? p.optionbac : "";
        pp.mentionbac = p.mentionbac ? p.mentionbac : "";
        pp.apb = p.apb ? p.apb : null;
        pp.birthyear = p.birthyear ? p.birthyear : 0;
        pp.sup = p.sup ? p.sup : "";
        pp.redoublant = p.redoublant ? p.redoublant : "";
        pp.typeformation = p.typeformation ? p.typeformation : "";
        if (p.notedirty) {
            pp.notedirty = p.notedirty;
        }
        if (p.evtdirty) {
            pp.evtdirty = p.evtdirty;
        }
        if (p.data) {
            pp.data = p.data;
        }
        if (p.s0) {
            pp.s0 = p.s0;
        }
        if (p.s1) {
            pp.s1 = p.s1;
        }
        if (p.s2) {
            pp.s2 = p.s2;
        }
        if (p.s3) {
            pp.s3 = p.s3;
        }
        if (p.s4) {
            pp.s4 = p.s4;
        }
        if (p.s5) {
            pp.s5 = p.s5;
        }
        if (p.s6) {
            pp.s6 = p.s6;
        }
        return pp;
    } // ConvertEtudiantDoc
    //
    private static _convertEtudAffectationDoc(
        p: IItemEtudAffectation
    ): IEtudAffectationDoc {
        const pp = CreateEtudAffectation();
        ConvertData._convertBaseDoc(p, pp);
        pp.startdate = p.startdate ? p.startdate : "";
        pp.enddate = p.enddate ? p.enddate : "";
        pp.anneeid = p.anneeid ? p.anneeid : "";
        pp.groupeid = p.groupeid ? p.groupeid : "";
        pp.etudiantid = p.etudiantid ? p.etudiantid : "";
        return pp;
    } // convertEtudAffectationDoc
    private static _convertGroupeControlesDoc(
        p: IItemGroupeControles
    ): IGroupeControlesDoc {
        const pp = CreateGroupeControles();
        ConvertData._convertBaseDoc(p, pp);
        pp.semestreid = p.semestreid ? p.semestreid : "";
        pp.matiereid = p.matiereid ? p.matiereid : "";
        pp.sigle = p.sigle ? p.sigle : "";
        pp.name = p.name ? p.name : "";
        pp.controletype =
            p.controletype
                ? p.controletype
                : ControleType.Unknown;
        pp.coefficient = p.coefficient ? p.coefficient : 1.0;
        pp.hasnotes =
            p.hasnotes ? p.hasnotes : true;
        pp.duration = p.duration ? p.duration : "";
        return pp;
    } // convertControleDoc
    private static _convertControleDoc(p: IItemControle): IControleDoc {
        const pp = CreateControle();
        ConvertData._convertBaseDoc(p, pp);
        pp.groupecontroleid = p.groupecontroleid ? p.groupecontroleid : "";
        pp.anneeid = p.anneeid ? p.anneeid : "";
        pp.groupeid = p.groupeid ? p.groupeid : "";
        pp.date = p.date ? p.date : "";
        pp.place = p.place ? p.place : "";
        return pp;
    } // convertControleDoc

    private static _convertEvtDoc(p: IItemEvt): IEvtDoc {
        const pp = CreateEvt();
        ConvertData._convertControleChildDoc(p, pp);
        pp.evttype =
            p.evttype
                ? p.evttype
                : EvtType.Inconnu;
        pp.justifie = p.justifie ? p.justifie : false;
        pp.duration = p.duration ? p.duration : "";
        return pp;
    } // convertEvtDoc
    private static _convertNoteDoc(p: IItemNote): INoteDoc {
        const pp = CreateNote();
        ConvertData._convertControleChildDoc(p, pp);
        if (p.value) {
            pp.value = p.value;
        }
        return pp;
    } // convertNoteDoc
    //
    private static _convertBaseDoc(p: IItemDoc, pp: IBaseDoc) {
        pp._id = p._id ? p._id : "";
        pp._rev = p._rev ? p._rev : "";
        pp.doctype = p.doctype ? p.doctype : "";
        pp.observations = p.observations ? p.observations : "";
        if (p.status) {
            pp.status = p.status;
        }
        if (p.ownerid) {
            pp.ownerid = p.ownerid;
        }
        if (p.reptype) {
            pp.reptype = p.reptype;
        }
        pp._storeable = true;
        pp._modified = false;
    } // convertBaseDoc
    private static _convertSigleNamedDoc(p: IItemSigleNamed, pp: ISigleNamedDoc) {
        ConvertData._convertBaseDoc(p, pp);
        pp.sigle = p.sigle ? p.sigle : "";
        pp.name = p.name ? p.name : "";
        pp._text = pp.name;
    } // ConvertSigleNamedDoc
    private static _convertControleChildDoc(
        p: IItemControleChild,
        pp: IControleChildDoc
    ) {
        ConvertData._convertBaseDoc(p, pp);
        pp.controleid = p.controleid ? p.controleid : "";
        pp.etudiantid = p.etudiantid ? p.etudiantid : "";
    } // convertControleChildDoc
    private static _convertPersonDoc(p: IItemPerson, pp: IPersonDoc) {
        ConvertData._convertBaseDoc(p, pp);
        pp.username = p.username ? p.username : "";
        pp.password = p.password ? p.password : "";
        pp.firstname = p.firstname ? p.firstname : "";
        pp.lastname = p.lastname ? p.lastname.toUpperCase() : "";
        pp.email = p.email ? p.email : "";
        pp.phone = p.phone ? p.phone : "";
        pp.address = p.address ? p.address : "";
        pp.birthdate = p.birthdate ? p.birthdate : "";
        pp.sexe = p.sexe ? p.sexe : "";
        pp.roles = p.roles ? p.roles : [];
        pp.avatar = p.avatar ? p.avatar : "";
        pp._text = pp.lastname + " " + pp.firstname;
    } // convertPersonDoc
} // class ConvertData
