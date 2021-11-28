import { DomainConstants } from "./DomainConstants";
import { IAnneeDoc, initialAnnee } from "./IAnneeDoc";
import type { IAttachedDoc } from "./IAttachedDoc";
import type { IBaseDoc } from "./IBaseDoc";
import type { IControleChildDoc } from "./IControleChildDoc";
import { IControleDoc, initialControle } from "./IControleDoc";
import { IEtudiantDoc, initialEtudiant } from "./IEtudiantDoc";
import { IEvtDoc, initialEvt } from "./IEvtDoc";
import {
    IGroupeControlesDoc,
    initialGroupeControles,
} from "./IGroupeControlesDoc";
import { IGroupeDoc, initialGroupe } from "./IGroupeDoc";
import { IMatiereDoc, initialMatiere } from "./IMatiereDoc";
import { initialNote, INoteDoc } from "./INoteDoc";
import { initialSemestre, ISemestreDoc } from "./ISemestreDoc";
import { initialUnite, IUniteDoc } from "./IUniteDoc";
import { ConvertData } from "./ConvertData";
import type { IDataStore } from "./IDataStore";
import type { IHttpOutput } from "./IHttpOutput";
import { IEtudAffectationDoc, initialEtudAffectation } from "./IEtudAffectation";
import { HTTP_OK, HTTP_MODIFIED } from './IHttpOutput';
import { ConvertEvtTypeToString } from "./EvtType";
import { CouchDBClient } from './CouchDBClient';
import { fetchClient } from './fetchClient';
//
const urlCreator = window.URL || window.webkitURL;
//
export class InfoDataStore implements IDataStore {
    //
    private readonly _datastore: IDataStore;
    private _data: Map<string, Map<string, IBaseDoc>> = new Map<
        string,
        Map<string, IBaseDoc>
    >();
    //
    constructor(store?: IDataStore, dbUrl?: string) {
        if (!store) {
            this._datastore = new CouchDBClient(fetchClient, dbUrl);
        } else {
            this._datastore = store;
        }
        if (!this._datastore) {
            throw new Error("Invalid datastore")
        }
    }
    public get datastore(): IDataStore {
        return this._datastore;
    }
    //
    public async processDocAttachmentsAsync(p: Record<string, unknown>): Promise<IAttachedDoc[]> {
        const vret: IAttachedDoc[] = [];
        const id: string = p._id ? (p._id as string) : "";
        if ((!p._attachments) || id.length < 1) {
            return vret;
        }
        const aa = p._attachments as Record<string, unknown>[];
        for (const key in aa) {
            const x = aa[key] as unknown;
            const info = x as IAttachedDoc;
            if (!urlCreator) {
                const px = { ...info, docid: id, name: key };
                vret.push(px);
            } else {
                const rsp = await this.datastore.getBlobDataAsync(id, key);
                if ((!rsp.body) || (rsp.status !== HTTP_OK && rsp.status !== HTTP_MODIFIED)) {
                    const px = { ...info, docid: id, name: key };
                    vret.push(px);
                } else {
                    const data = rsp.body as ArrayBuffer;
                    const blob = new Blob([data], { type: info.content_type });
                    const url = urlCreator.createObjectURL(blob);
                    const px = { ...info, docid: id, name: key, url: url };
                    vret.push(px);
                }
            }// urlCreator
        } // key
        return vret;
    } // _processDocAttachmentsAsync
    //
    public fetchItemById<T extends IBaseDoc>(item: T, id: string): T | undefined {
        return this._internal_find_item<T>(item, id)
    } // fetchItemById
    public register_item<T extends IBaseDoc>(p: T): void {
        const id = p._id;
        const doctype = p.doctype;
        let m = this._data.get(doctype);
        if (!m) {
            m = new Map<string, IBaseDoc>();
            m.set(id, p);
            this._data.set(doctype, m);
        } else {
            m.set(id, p);
        }
    } // register_item
    //
    public async findOneItemIdByFilter(
        filter: Record<string, unknown>
    ): Promise<string | undefined> {
        const dd = await this.datastore.findAllDocsIdsBySelectorAsync(filter)
        return (dd.length > 0) ? dd[0] : undefined;
    } // findOneItemIdByFilter
    //
    public async getItemsCountAsync<T extends IBaseDoc>(
        item: T,
        sel?: Record<string, unknown>
    ): Promise<number> {
        const filter: Record<string, unknown> = sel ? sel : {};
        filter.doctype = item.doctype;
        return this.datastore.findDocsCountBySelectorAsync(filter);
    } // GetItemsCountAsync
    public async getItemsAsync<T extends IBaseDoc>(
        item: T,
        sel?: Record<string, unknown>,
        skip?: number,
        limit?: number
    ): Promise<readonly T[]> {
        const filter: Record<string, unknown> = sel ? { ...sel, doctype: item.doctype } : { doctype: item.doctype };
        const pp = await this.datastore.findDocsBySelectorAsync(
            filter,
            skip,
            limit,
            [DomainConstants.FIELD_ID]
        );
        const pRet: T[] = [];
        const n = pp.length;
        for (let i = 0; i < n; i++) {
            const x = pp[i];
            if (x._id) {
                const y = await this.findItemByIdAsync(item, x.id as string);
                if (x) {
                    pRet.push(y);
                }
            }
        } // i
        return pRet;
    } //  getItemsAsync
    public async findItemsAsync<T extends IBaseDoc>(
        item: T,
        sel?: Record<string, unknown>,
        skip?: number,
        limit?: number
    ): Promise<readonly T[]> {
        const filter: Record<string, unknown> = sel ? { ...sel, doctype: item.doctype } : { doctype: item.doctype };
        const pp = await this.datastore.findDocsBySelectorAsync(
            filter,
            skip,
            limit
        );
        const pRet: T[] = [];
        const n = pp.length;
        for (let i = 0; i < n; i++) {
            const x = pp[i];
            const v = ConvertData.ConvertDataItem(item, x)
            pRet.push(v);
        } // i
        return pRet;
    } //  GetItemsAsync
    //
    public async findItemByIdAsync<T extends IBaseDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        const doctype = item.doctype;
        if (doctype === DomainConstants.TYPE_NOTE) {
            const p = (await this._findNoteByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_EVT) {
            const p = (await this._findEvtByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ETUDAFFECTATION) {
            const p = (await this._findEtudAffectationByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_CONTROLE) {
            const p = (await this._findControleByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ETUDIANT) {
            const p = (await this._findEtudiantByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_MATIERE) {
            const p = (await this._findMatiereByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_GROUPE) {
            const p = (await this._findGroupeByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ANNEE) {
            const p = (await this._findAnneeByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_SEMESTRE) {
            const p = (await this._findSemestreByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_UNITE) {
            const p = (await this._findUniteByIdAsync(id)) as unknown;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_GROUPCONTROLE) {
            const p = (await this._findGroupeControlesByIdAsync(id)) as unknown;
            return p as T;
        }
        return undefined;
    } // findItemByIdAsync
    //
    // IDataStore implementation
    //
    public async isOnLineAsync(): Promise<boolean> {
        return this.datastore.isOnLineAsync();
    }
    public formBlobUrl(id?: string, name?: string): string {
        return this.datastore.formBlobUrl(id, name);
    }
    public async getBlobDataAsync(
        id: string,
        name: string
    ): Promise<IHttpOutput> {
        return this.datastore.getBlobDataAsync(id, name);
    }
    public async findDocByIdAsync(
        id: string
    ): Promise<Record<string, unknown>> {
        return this.datastore.findDocByIdAsync(id);
    }
    public async findDocRevisionAsync(sid: string): Promise<string> {
        return this.datastore.findDocRevisionAsync(sid);
    }
    public async maintainsDocAsync(
        doc: Record<string, unknown>
    ): Promise<Record<string, unknown>> {
        return this.datastore.maintainsDocAsync(doc);
    }
    public async removeDocAsync(id: string): Promise<Record<string, unknown>> {
        return this.datastore.removeDocAsync(id);
    }
    public async maintainsBlobAsync(
        id: string,
        name: string,
        mime: string,
        data: Blob | ArrayBuffer
    ): Promise<Record<string, unknown>> {
        return this.datastore.maintainsBlobAsync(id, name, mime, data);
    }
    public async removeBlobAsync(id: string, name: string): Promise<Record<string, unknown>> {
        return this.datastore.removeBlobAsync(id, name);
    }
    public async findDocsBySelectorAsync(
        sel: Record<string, unknown>,
        start?: number,
        count?: number,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        return this.datastore.findDocsBySelectorAsync(
            sel,
            start,
            count,
            fields,
            sort
        );
    }
    public async findAllDocsBySelectorAsync(
        sel: Record<string, unknown>,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        return this.datastore.findAllDocsBySelectorAsync(sel, fields, sort);
    }
    public async findAllDocsIdsBySelectorAsync(
        sel: Record<string, unknown>
    ): Promise<readonly string[]> {
        return this.datastore.findAllDocsIdsBySelectorAsync(sel);
    }
    public async findDocsCountBySelectorAsync(
        sel: Record<string, unknown>
    ): Promise<number> {
        return this.datastore.findDocsCountBySelectorAsync(sel);
    }
    public async maintainsManyDocsAsync(
        docs: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        return this.datastore.maintainsManyDocsAsync(docs);
    }
    public async bulkGetAsync(ids: readonly string[]): Promise<readonly Record<string, unknown>[]> {
        return this.datastore.bulkGetAsync(ids);
    }
    public async removeDocsBySelectorAsync(
        sel: Record<string, unknown>
    ): Promise<readonly Record<string, unknown>[]> {
        return this.datastore.removeDocsBySelectorAsync(sel);
    }
    public async findDocBySelectorAsync(
        sel: Record<string, unknown>,
        fields?: string[]
    ): Promise<Record<string, unknown>> {
        return this.datastore.findDocBySelectorAsync(sel, fields);
    }
    //
    // private methods
    //
   
    private async _loadItemByIdAsync<T extends IBaseDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        const p = await this._datastore.findDocByIdAsync(id);
        if (!p) {
            return undefined;
        }
        const aa = await this.processDocAttachmentsAsync(p);
        const pz = ConvertData.ConvertDataItem<T>(item, p);
        pz._attachments = aa;
        return pz;
    } // findItemByIdAsync
    private _internal_find_item<T extends IBaseDoc>(
        item: T,
        id: string
    ): T | undefined {
        const m = this._data.get(item.doctype);
        if (!m) {
            return undefined;
        }
        const p = m.get(id);
        if (p) {
            return p as T;
        }
        return undefined;
    } // _internal_find_item
    //
    private async _internal_find_item_by_id_async<T extends IBaseDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        let p = this._internal_find_item(item, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(item, id);
        if (!p) {
            return undefined;
        }
        this.register_item(p);
        return p;
    }
    //
    private async _findAnneeByIdAsync(id: string): Promise<IAnneeDoc | undefined> {
        return this._internal_find_item_by_id_async(initialAnnee, id);
    } // findAnneeByIdAsync
    private async _findSemestreByIdAsync(
        id: string
    ): Promise<ISemestreDoc | undefined> {
        return this._internal_find_item_by_id_async(initialSemestre, id);
    } // findSemestreByIdAsync
    private async _findGroupeByIdAsync(
        id: string
    ): Promise<IGroupeDoc | undefined> {
        let p = this._internal_find_item(initialGroupe, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialGroupe, id);
        if (!p) {
            return undefined;
        }
        const sem = await this._findSemestreByIdAsync(p.semestreid);
        if (sem) {
            p._semestreSigle = sem.sigle;
        }
        if (p.parentid.length > 0) {
            const px = await this._findGroupeByIdAsync(p.parentid);
            if (px) {
                p._parentSigle = px.sigle;
            }
        } // parent
        this.register_item(p);
        return p;
    } // findGroupeByIdAsync

    private async _findUniteByIdAsync(id: string): Promise<IUniteDoc | undefined> {
        return this._internal_find_item_by_id_async(initialUnite, id);
    } // findAnneeByIdAsync
    private async _findMatiereByIdAsync(
        id: string
    ): Promise<IMatiereDoc | undefined> {
        let p = this._internal_find_item(initialMatiere, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialMatiere, id);
        if (!p) {
            return undefined;
        }
        const unite = await this._findUniteByIdAsync(p.uniteid);
        if (unite) {
            p._uniteSigle = unite.sigle;
        }
        this.register_item(p);
        return p;
    } // findMatiereByIdAsync
    private async _findEtudiantByIdAsync(
        id: string
    ): Promise<IEtudiantDoc | undefined> {
        let p = this._internal_find_item(initialEtudiant, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialEtudiant, id);
        if (!p) {
            return undefined;
        }
        p._fullname = p.lastname + " " + p.firstname;
        p._avatar =
            p.lastname.substring(0, 1).toUpperCase() +
            p.firstname.substring(0, 1).toUpperCase();
        this._checkPersonAvatar(p);
        this.register_item(p);
        return p;
    } // findEtudiantByIdAsync

    private async _findEtudAffectationByIdAsync(
        id: string
    ): Promise<IEtudAffectationDoc | undefined> {
        let p = this._internal_find_item(initialEtudAffectation, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialEtudAffectation, id);
        if (!p) {
            return undefined;
        }
        if (p) {
            const annee = await this._findAnneeByIdAsync(p.anneeid);
            if (annee) {
                p._anneeSigle = annee.sigle;
            }
            const groupe = await this._findGroupeByIdAsync(p.groupeid);
            if (groupe) {
                p._groupeSigle = groupe.sigle;
                p._semestreSigle = groupe._semestreSigle;
                p._semestreid = groupe.semestreid;
            }
            const etudiant = await this._findEtudiantByIdAsync(p.etudiantid);
            if (etudiant) {
                p._lastname = etudiant.lastname;
                p._firstname = etudiant.firstname;
                p._fullname = etudiant._fullname;
                p._url = etudiant._url;
                p._photoData = etudiant._photoData;
                p._avatar = etudiant._avatar;
            }
        }
        this.register_item(p);
        return p;
    } // findEtudAffectationByIdAsync
    private async _findGroupeControlesByIdAsync(
        id: string
    ): Promise<IGroupeControlesDoc | undefined> {
        let p = this._internal_find_item(initialGroupeControles, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialGroupeControles, id);
        if (!p) {
            return undefined;
        }
        if (p) {
            const pSem = await this._findSemestreByIdAsync(p.semestreid);
            if (pSem) {
                p._semestreSigle = pSem.sigle;
            }
            const pMat = await this._findMatiereByIdAsync(p.matiereid);
            if (pMat) {
                p._matiereSigle = pMat.sigle;
            }
        }
        this.register_item(p);
        return p;
    } // findCGroupeontrolesByIdAsync
    //
    private async _findControleByIdAsync(
        id: string
    ): Promise<IControleDoc | undefined> {
        let p = this._internal_find_item(initialControle, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(initialControle, id);
        if (!p) {
            return undefined;
        }
        const pAnnee = await this._findAnneeByIdAsync(p.anneeid);
        if (pAnnee) {
            p._anneeSigle = pAnnee.sigle;
        }
        const pGroupe = await this._findGroupeByIdAsync(p.groupeid);
        if (pGroupe) {
            p._groupeSigle = pGroupe.sigle;
        }
        const pg = await this._findGroupeControlesByIdAsync(p.groupecontroleid);
        if (pg) {
            p._groupeControlesSigle = pg.sigle;
            p._name = pg.name;
            p._text = pg.name;
            p._coefficient = pg.coefficient;
            p._controletype = pg.controletype;
            p._duration = pg.duration;
            p._hasnotes = pg.hasnotes;
            const pSem = await this._findSemestreByIdAsync(pg.semestreid);
            if (pSem) {
                p._semestreid = pSem._id;
                p._semestreSigle = pSem.sigle;
            }
            const pMat = await this._findMatiereByIdAsync(pg.matiereid);
            if (pMat) {
                p._matiereid = pMat._id;
                p._matiereSigle = pMat.sigle;
                p._matiereCoeff = pMat.coefficient;
                p._uniteid = pMat.uniteid;
                p._uniteSigle = pMat._uniteSigle;
            }
        } // pg
        this.register_item(p);
        return p;
    } // findControleByIdAsync
    //
    private async _findControleChildByIdAsync<T extends IControleChildDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        let p = this._internal_find_item(item, id);
        if (p) {
            return p;
        }
        p = await this._loadItemByIdAsync(item, id);
        if (!p) {
            return undefined;
        }
        const cont = await this._findControleByIdAsync(p.controleid);
        if (cont) {
            p._matiereid = cont._matiereid;
            p._matiereSigle = cont._matiereSigle;
            p._groupeSigle = cont._groupeSigle;
            p._anneeSigle = cont._anneeSigle;
            p._uniteid = cont._uniteid;
            p._uniteSigle = cont._uniteSigle;
            p._semestreSigle = cont._semestreSigle;
            p._date = cont.date;
            p._controleCoeff = cont._coefficient;
            p._controleName = cont._name;
            p._matiereCoeff = cont._matiereCoeff;
        }
        const etudiant = await this._findEtudiantByIdAsync(p.etudiantid);
        if (etudiant) {
            p._lastname = etudiant.lastname;
            p._firstname = etudiant.firstname;
            p._fullname = etudiant._fullname;
            p._url = etudiant._url;
            p._avatar = etudiant._avatar;
            p._photoData = etudiant._photoData;
        }
        this.register_item(p);
        return p;
    } // findControleChildrenByIdAsyn
    private async _findNoteByIdAsync(
        id: string,
    ): Promise<INoteDoc | undefined> {
        return this._findControleChildByIdAsync(initialNote, id);
    }
    private async _findEvtByIdAsync(
        id: string,
    ): Promise<IEvtDoc | undefined> {
        const p = await this._findControleChildByIdAsync(initialEvt, id);
        p._name = ConvertEvtTypeToString(p.evttype);
        return p;
    }
    //
    private _checkPersonAvatar(p: IEtudiantDoc): void {
        if (!p._attachments) {
            return;
        }
        const aa = p._attachments;
        const n = aa.length;
        if (p.avatar && p.avatar.length > 0) {
            const avatar = p.avatar;
            for (let i = 0; i < n; i++) {
                const a = aa[i];
                if (a.name && a.name === avatar && a.content_type.startsWith('image/')) {
                    p._url = a.url;
                    return;
                }// name
            }// i
        }// avatar
        for (let i = 0; i < n; i++) {
            const a = aa[i];
            if (a.content_type.startsWith('image/')) {
                p._url = a.url;
                return;
            }// name
        }// i
    }// _checkPersonAvatar
    //
} // class InfoDataStore
