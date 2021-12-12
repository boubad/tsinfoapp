import { DomainConstants } from "./DomainConstants";
import type { IDataStore } from "./IDataStore";
import { IGroupeControlesDoc, initialGroupeControles } from './IGroupeControlesDoc';
import { SigleNamedItemServices } from "./SigleNamedItemServices";
import type { IItemPayload } from './IItemPayload';
import { ControleServices } from "./ControleServices ";
import { ConvertData } from "./ConvertData";
import { initialSemestre } from './ISemestreDoc';
import { initialMatiere } from "./IMatiereDoc";
import type { IDataUrlCreator } from "./IDataUrlCreator";

//
export class GroupeControlesServices extends SigleNamedItemServices<IGroupeControlesDoc> {
    //
    constructor(
        store: IDataStore, creator?:IDataUrlCreator, dbUrl?: string
    ) {
        super(initialGroupeControles, store,creator,dbUrl);
    }
    //
    protected async registerDocAsync(doc: Record<string, unknown>): Promise<IGroupeControlesDoc> {
        const p = ConvertData.ConvertDataItem(this.item, doc)
        const store = this.datastore
        const semestre = await store.findItemByIdAsync(initialSemestre, p.semestreid);
        if (semestre) {
            p._semestreSigle = semestre.sigle;
        }
        const matiere = await store.findItemByIdAsync(initialMatiere, p.matiereid)
        if (matiere) {
            p._matiereSigle = matiere.sigle;
            p._matiereCoeff = matiere.coefficient;
            p._uniteSigle = matiere._uniteSigle;
            p._uniteid = matiere.uniteid;
        }
        store.register_item(p)
        return p
    }// registerDocAsync
    //
    protected async fetchUniqueId(
        current: IGroupeControlesDoc
    ): Promise<string | undefined> {
        const store = this.datastore;
        if (current._id.trim().length > 0) {
            const rev = await store.findDocRevisionAsync(current._id);
            if (rev && rev.length > 0) {
                return current._id;
            }
        }
        const matiereid = current.matiereid;
        const semestreid = current.semestreid;
        if (matiereid.length > 0 && semestreid.length > 0) {
            const sigle = current.sigle;
            if (sigle.length > 0) {
                const ix = await store.findOneItemIdByFilter({
                    doctype: DomainConstants.TYPE_GROUPCONTROLE,
                    matiereid,
                    semestreid,
                    sigle,
                });
                if (ix && ix.length > 0) {
                    return ix;
                }
            } // sigle
            const name = current.name;
            if (name.length > 0) {
                const ix = await store.findOneItemIdByFilter({
                    doctype: DomainConstants.TYPE_GROUPCONTROLE,
                    matiereid,
                    semestreid,
                    name,
                });
                if (ix && ix.length > 0) {
                    return ix;
                }
            } // sigle
        } // matiere && semestre
        return "";
    } // fetchUniqueId
    //
    protected isStoreable(p: IGroupeControlesDoc): boolean {
        return (
            p.semestreid.trim().length > 0 && p.matiereid.trim().length > 0 && super.isStoreable(p)
        );
    } // getPersistMap
    protected getPersistMap(
        current: IGroupeControlesDoc
    ): Record<string, unknown> {
        const data = super.getPersistMap(current);
        const matiereid = current.matiereid;
        const semestreid = current.semestreid;
        data[DomainConstants.FIELD_MATIEREID] = matiereid;
        data[DomainConstants.FIELD_SEMESTREID] = semestreid;
        return data;
    } // SaveItemAsync
    public async removeItemAsync(p: IGroupeControlesDoc): Promise<IItemPayload<IGroupeControlesDoc>> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return {
                ok: false,
                error: 'Item not persisted'
            };
        }
        {
            const pf = new ControleServices(this.datastore)
            const pp = await pf.findAllItemsByFilterAsync({ doctype: DomainConstants.TYPE_CONTROLE, groupecontroleid: id });
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
        }// controles
        return super.removeItemAsync(p);
    } // removeItemAsync
} // class ControleServices
//
