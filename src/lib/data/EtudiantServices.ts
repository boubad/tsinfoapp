import { DomainConstants } from "./DomainConstants";
import { IEtudiantDoc, initialEtudiant } from "./IEtudiantDoc";
import { EtudAffectationServices } from "./EtudAffectationServices";
import { EvtServices } from "./EvtServices";
import type { IItemPayload } from "./IItemPayload";
import { ItemServices } from "./ItemServices";
import { NoteServices } from "./NoteServices";
import type { IDataStore } from "./IDataStore";
import type { ICouchDBUpdateResponse } from "./ICouchDBUpdateResponse";
import { ConvertData } from "./ConvertData";

export class EtudiantServices extends ItemServices<IEtudiantDoc> {
    constructor(
        store?: IDataStore, dbUrl?: string
    ) {
        super(initialEtudiant, store,dbUrl);
    }
    //
     //
     protected async registerDocAsync(doc: Record<string, unknown>): Promise<IEtudiantDoc> {
        const p = ConvertData.ConvertDataItem(this._item, doc)
        const lastname = p.lastname.toUpperCase();
        const firstname = p.firstname;
        const title = lastname + " " + firstname;
        p._fullname = title;
        const avatar =
          lastname.substring(0, 0).toUpperCase() +
          firstname.substring(0, 0).toUpperCase();
        p._avatar = avatar;
        const store = this.datastore
        const av = p.avatar;
        const aa = p._attachments;
        if (aa && av && av.trim().length > 0) {
           const n = aa.length;
           for (let i = 0; i < n; i++){
            const x = aa[i];
            if (x.name && x.name === av){
                p._url = x.url;
                p._photoData = x.imgData;
                break;
            }
           }// i
        }// av
        store.register_item(p)
        return p
    }// registerDocAsync
    //
    public async findItemsAsync(
        filter?: Record<string, unknown>,
        offset?: number,
        count?: number
    ): Promise<readonly IEtudiantDoc[]> {
        const xx = await super.findItemsAsync(filter, offset, count)
        const vret = [...xx];
        if (vret.length > 1) {
            vret.sort((a, b) => {
                if (a.lastname > b.lastname) {
                    return -1
                } else if (a.lastname < b.lastname) {
                    return 1
                }
                if (a.firstname > b.firstname) {
                    return -1
                } else if (a.firstname < b.firstname) {
                    return 1
                }
                return 0
            })
        } // sort
        return vret
    } // findItemsAsync
    //
    protected async fetchUniqueId(
        current: IEtudiantDoc
    ): Promise<string | undefined> {
        const sret = await super.fetchUniqueId(current)
        if (sret && sret.length > 0) {
            return sret;
        }
        const store = this.datastore;
        const ident = current.ident ? current.ident.trim() : "";
        if (ident.length > 0) {
            const filter: Record<string, unknown> = { doctype: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_DOSSIER] = ident;
            const ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        } // ident
        const username = current.username ? current.username.trim() : "";
        if (username.length > 0) {
            const filter: Record<string, unknown> = { doctype: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_USERNAME] = username;
            const ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        } // username
        const email = current.email ? current.email.trim() : "";
        if (email.length > 0) {
            const filter: Record<string, unknown> = { doctype: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_EMAIL] = email;
            const ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }
        const phone = current.phone ? current.phone.trim() : "";
        if (phone.length > 0) {
            const filter: Record<string, unknown> = { doctype: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_PHONE] = phone;
            const ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }
        const firstname = current.firstname.trim();
        const lastname = current.lastname.trim().toUpperCase();
        const filter: Record<string, unknown> = { doctype: DomainConstants.TYPE_ETUDIANT };
        filter[DomainConstants.FIELD_LASTNAME] = lastname;
        filter[DomainConstants.FIELD_FIRSTNAME] = firstname;
        const ix = await store.findOneItemIdByFilter(filter);
        if (ix) {
            return ix;
        }
        return undefined;
    } // fetchUniqueId
    //
    protected isStoreable(p: IEtudiantDoc): boolean {
        return p.firstname.trim().length > 0 && p.lastname.trim().length > 0;
    } // isStorable
    public async removeItemAsync(p: IEtudiantDoc): Promise<IItemPayload<IEtudiantDoc>> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        {
            const pf = new NoteServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_NOTE, etudiantid: id });
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const x = pp[i];
                const rsp = await pf.removeItemAsync(x);
                if (!rsp.ok) {
                    return {
                        ok: false,
                        error: rsp.error
                    }
                }
            }// i
        }// notes
        {
            const pf = new EvtServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_NOTE, etudiantid: id });
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const x = pp[i];
                const rsp = await pf.removeItemAsync(x);
                if (!rsp.ok) {
                    return {
                        ok: false,
                        error: rsp.error
                    }
                }
            }// i
        }// evts
        {
            const pf = new EtudAffectationServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_NOTE, etudiantid: id });
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const x = pp[i];
                const rsp = await pf.removeItemAsync(x);
                if (!rsp.ok) {
                    return {
                        ok: false,
                        error: rsp.error
                    }
                }
            }// i
        }// affetuds
        return super.removeItemAsync(p);
    } // removeItemAsync
    //
    protected getPersistMap(current: IEtudiantDoc): Record<string, unknown> {
        const data = super.getPersistMap(current);
        const firstname = current.firstname.trim();
        const lastname = current.lastname.trim().toUpperCase();
        data[DomainConstants.FIELD_LASTNAME] = lastname;
        data[DomainConstants.FIELD_FIRSTNAME] = firstname;
        const ident = current.ident ? current.ident.trim() : "";
        if (ident.length > 0) {
            data[DomainConstants.FIELD_DOSSIER] = ident;
        }
        const username = current.username ? current.username.trim() : "";
        if (username.length > 0) {
            data[DomainConstants.FIELD_USERNAME] = username;
        }
        const email = current.email ? current.email.trim() : "";
        if (email.length > 0) {
            data[DomainConstants.FIELD_EMAIL] = email;
        }
        const phone = current.phone ? current.phone.trim() : "";
        if (phone.length > 0) {
            data[DomainConstants.FIELD_PHONE] = phone;
        }
        if (
            current.notedirty !== undefined &&
            current.notedirty === true
        ) {
            data[DomainConstants.FIELD_NOTEDIRTY] = true;
        }
        if (
            current.evtdirty !== undefined &&
            current.evtdirty === true
        ) {
            data[DomainConstants.FIELD_EVTDIRTY] = true;
        }
        if (current.sup && current.sup.trim().length > 0) {
            data[DomainConstants.FIELD_ETUDESSUPERIEURES] = current.sup.trim();
        }
        if (current.typeformation && current.typeformation.trim().length > 0) {
            data[DomainConstants.FIELD_TYPEFORMATION] = current.typeformation.trim();
        }
        if (current.redoublant && current.redoublant.trim().length > 0) {
            data[DomainConstants.FIELD_REDOUBLANT] = current.redoublant.trim();
        }
        if (current.mentionbac && current.mentionbac.trim().length > 0) {
            data[DomainConstants.FIELD_MENTIONBAC] = current.mentionbac.trim();
        }
        if (current.optionbac && current.optionbac.trim().length > 0) {
            data[DomainConstants.FIELD_MENTIONBAC] = current.optionbac.trim();
        }
        if (current.seriebac && current.seriebac.trim().length > 0) {
            data[DomainConstants.FIELD_SERIEBAC] = current.seriebac.trim();
        }
        if (current.etablissement && current.etablissement.trim().length > 0) {
            data[DomainConstants.FIELD_ETABLISSEMENT] = current.etablissement.trim();
        }
        if (current.ville && current.ville.trim().length > 0) {
            data[DomainConstants.FIELD_VILLE] = current.ville.trim();
        }
        if (current.departement && current.departement.trim().length > 0) {
            data[DomainConstants.FIELD_DEPARTEMENT] = current.departement.trim();
        }
        if (current.birthyear && current.birthyear > 0) {
            data[DomainConstants.FIELD_BIRTHYEAR] = current.birthyear;
        }
        if (current.apb && current.apb > 0) {
            data[DomainConstants.FIELD_APB] = current.apb;
        }
        if (current.avatar && current.avatar.trim().length > 0) {
            data[DomainConstants.FIELD_AVATAR] = current.avatar.trim();
        }
        if (current.roles && current.roles.length > 0) {
            data[DomainConstants.FIELD_ROLES] = current.roles;
        }
        if (current.sexe && current.sexe.trim().length > 0) {
            data[DomainConstants.FIELD_SEXE] = current.sexe.trim();
        }
        if (current.birthdate && current.birthdate.trim().length > 0) {
            data[DomainConstants.FIELD_BIRTHDATE] = current.birthdate;
        }
        if (current.address && current.address.trim().length > 0) {
            data[DomainConstants.FIELD_ADDRESS] = current.address;
        }
        if (current.data !== undefined) {
            const pp = current.data;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_DATA] = rr;
            }
        } // data
        if (current.s0 !== undefined) {
            const pp = current.s0;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S0] = rr;
            }
        } // s0
        if (current.s1 !== undefined) {
            const pp = current.s1;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S1] = rr;
            }
        } // s1
        if (current.s2 !== undefined) {
            const pp = current.s2;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S2] = rr;
            }
        } // s2
        if (current.s3 !== undefined) {
            const pp = current.s3;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S3] = rr;
            }
        } // s3
        if (current.s4 !== undefined) {
            const pp = current.s4;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S4] = rr;
            }
        } // s4
        if (current.s5 !== undefined) {
            const pp = current.s5;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S5] = rr;
            }
        } // s5
        if (current.s6 !== undefined) {
            const pp = current.s6;
            let bFound = false;
            const rr: Record<string, unknown> = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S6] = rr;
            }
        } // s6
        return data;
    } // getPersistMap
    //
    public async setEtudiantAvatarAsync(
        etudiantid: string,
        attName: string,
        mimeType: string,
        data: Blob
    ): Promise<IItemPayload<IEtudiantDoc>> {
        const pRet: IItemPayload<IEtudiantDoc> = {};
        const store = this.datastore;
        const pEtud = await store.findItemByIdAsync(initialEtudiant, etudiantid);
        if (!pEtud) {
            return pRet;
        }
        const id = pEtud._id;
        let rr = await store.maintainsBlobAsync(id, attName, mimeType, data);
        let rsp = rr as ICouchDBUpdateResponse
        if (!rsp.ok) {
            return pRet;
        }
        const oMap = await store.findDocByIdAsync(id);
        if (!oMap._id) {
            return pRet;
        }
        oMap[DomainConstants.FIELD_AVATAR] = attName;
        rr = await store.maintainsDocAsync(oMap);
        rsp = rr as ICouchDBUpdateResponse
        if (!rsp.ok) {
            return pRet;
        }
        return this.selectItemAsync(id);
    } // setEtudiantAvatar
} // class EtudiantServices
