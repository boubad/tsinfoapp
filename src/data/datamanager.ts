//datamanager.ts
//
import {IDepartement, IDocPersist, IItemFactory, IDataManager,
IGroupe, ISemestre, IUnite, IMatiere, IAffectation,
IPerson, IBaseItem, IUIManager, IGroupeEvent, IDepartementPerson,
IEtudiantEvent, IEnseignantAffectation, IEtudiantAffectation} from 'infodata';
import {DataService} from './dataservice';
import {DEPARTEMENT_TYPE, UNITE_TYPE, GROUPE_TYPE, ANNEE_TYPE, SEMESTRE_TYPE,
MATIERE_TYPE, PERSON_TYPE, ETUDIANT_TYPE, ENSEIGNANT_TYPE, ADMINISTRATOR_TYPE,
ETUDAFFECTATION_TYPE, PROFAFFECTATION_TYPE, GROUPEEVENT_TYPE, ETUDEVENT_TYPE, SUPER_FIRSTNAME,
SUPER_USERNAME, SUPER_LASTNAME, GENRE_TP} from './infoconstants';
//
const INDEXED_FIELDS: string[] = ["_id", "type", "status", "dossier", "sexe", "birthDate", "birthYear",
	"username", "firstname", "lastname", "ville", "etablissement",
	"serieBac", "optionBac", "mentionBac", "etudesSuperieures", "apb",
	"personid", "sigle", "departementid", "uniteid", "anneeid", "groupeid", "matiereid", "semestreid",
	"etudiantid", "enseignantid", "profaffectationid", "groupeeventid", "etudiantaffectationid",
	"genre", "name", "startDate", "endDate", "eventDate", "note"];
//
//
export class DataManager extends DataService {
	//
	private _bInitialized: boolean = false;
	//
	constructor(serv?: IDocPersist, fact?: IItemFactory) {
		super(serv, fact);
	}// constructor
	public remove_all_persons(): Promise<boolean> {
		return this.service.query_docs({ type: PERSON_TYPE }, null, null, ["_id", "_rev", "type", "username"]).then((dd) => {
			let pp: Promise<boolean>[] = [];
			for (let d of dd) {
				if ((d.username !== undefined) && (d.usename != SUPER_USERNAME)) {
					let p = this.itemFactory.create_item(d);
					if (p !== null) {
						pp.push(this.remove_query_item(p, { personid: p.id }));
					}
				}// username
			}// d	
			if (pp.length > 0) {
				return Promise.all(pp);
			} else {
				return Promise.resolve([]);
			}
		}).then((xx) => {
			return true;
		}).catch((e)=>{
			return false;
		})
	}//remove_all_persons
	public get_all_departements(): Promise<IDepartement[]> {
		let oRet: IDepartement[] = [];
		return this.query_items(DEPARTEMENT_TYPE).then((dd: IDepartement[]) => {
			oRet = ((dd !== undefined) && (dd !== null)) ? dd : [];
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//get_all_departements
	public refresh_person_docids(pPers: IPerson): Promise<boolean> {
		if ((pPers === undefined) || (pPers === null)) {
			return Promise.resolve(false);
		}
		if (pPers.id === null) {
			return Promise.resolve(false);
		}
		pPers.departementids = [];
		pPers.anneeids = [];
		pPers.semestreids = [];
		pPers.groupeids = [];
		pPers.uniteids = [];
		pPers.matiereids = [];
		pPers.affectationids = [];
		pPers.eventids = [];
		pPers.etudiantids = [];
		pPers.enseignantids = [];
		pPers.administratorids = [];
		if (pPers.is_super) {
			return Promise.resolve(true);
		}
		let sel: any = { personid: pPers.id };
		let fields: string[] = ["_id", "type"];
		let docs: any[] = [];
		let oAr: string[] = [];
		let oAf: string[] = [];
		let oAv: string[] = [];
		return this.service.query_docs(sel, null, null, fields).then((dd) => {
			docs = ((dd !== undefined) && (dd !== null)) ? dd : [];
			for (let doc of docs) {
				if ((doc._id !== undefined) && (doc._id !== null) &&
					(doc.type !== undefined) && (doc.type !== null)) {
					let id: string = doc._id;
					let type: string = doc.type;
					if (type == ADMINISTRATOR_TYPE) {
						this.add_id_to_array(pPers.administratorids, id);
						oAr.push(id);
					} else if (type == ENSEIGNANT_TYPE) {
						this.add_id_to_array(pPers.enseignantids, id);
						oAr.push(id);
					} else if (type == ETUDIANT_TYPE) {
						this.add_id_to_array(pPers.etudiantids, id);
						oAr.push(id);
					} else if (type == ETUDAFFECTATION_TYPE) {
						this.add_id_to_array(pPers.affectationids, id);
						oAf.push(id);
					} else if (type == PROFAFFECTATION_TYPE) {
						this.add_id_to_array(pPers.affectationids, id);
						oAf.push(id);
					} else if (type == GROUPEEVENT_TYPE) {
						this.add_id_to_array(pPers.eventids, id);
					} else if (type == ETUDEVENT_TYPE) {
						this.add_id_to_array(pPers.eventids, id);
						oAv.push(id);
					}
				}// i
			}// doc
			return this.get_items_array(oAr);
		}).then((dx: IDepartementPerson[]) => {
			for (let p of dx) {
				this.add_id_to_array(pPers.departementids, p.departementid);
			}
			return this.get_items_array(oAf);
		}).then((aa: IAffectation[]) => {
			for (let a of aa) {
				this.add_id_to_array(pPers.anneeids, a.anneeid);
				this.add_id_to_array(pPers.semestreids, a.semestreid);
				this.add_id_to_array(pPers.groupeids, a.groupeid);
				if (a.type() == PROFAFFECTATION_TYPE) {
					let pa: IEnseignantAffectation = <IEnseignantAffectation>a;
					this.add_id_to_array(pPers.uniteids, pa.uniteid);
					this.add_id_to_array(pPers.matiereids, pa.matiereid);
				}
			}// a
			if (oAv.length > 0) {
				return this.get_items_array(oAv);
			} else {
				return Promise.resolve([]);
			}
		}).then((xx: IEtudiantEvent[]) => {
			for (let x of xx) {
				this.add_id_to_array(pPers.uniteids, x.uniteid);
				this.add_id_to_array(pPers.matiereids, x.matiereid);
			}// x
			return true;
		}).catch((e) => {
			return false;
		});
	}//refresh_person_docids
	public find_user(username: string, password: string): Promise<IPerson> {
		let model: IPerson = this.itemFactory.create_person({ username: username });
		model.check_id();
		return this.find_item_by_id(model.id, true).then((pPers: IPerson) => {
			let oRet: IPerson = null;
			if ((pPers !== undefined) && (pPers !== null)) {
				if (pPers.check_password(password)) {
					oRet = pPers;
				}
			}
			return oRet;
		}).catch((e) => {
			return null;
		});
	}// find_user
	public get_semestre_groupe_etudaffectations(sem: ISemestre, grp: IGroupe): Promise<IEtudiantAffectation[]> {
		let oRet: IEtudiantAffectation[] = [];
		if ((sem === undefined) || (sem === null) || (grp === undefined) || (grp === null)) {
			return Promise.resolve(oRet);
		}
		let s1 = sem.id;
		let s2 = grp.id;
		let genre = grp.genre;
		if ((s1 === undefined) || (s2 === undefined) || (s1 === null) || (s2 === null) ||
			(genre === undefined) || (genre === null)) {
			return Promise.resolve(oRet);
		}
		if (genre == GENRE_TP) {
			let model = this.itemFactory.create_etudiantaffectation();
			let sel: any = { groupeid: s2, semestreid: s1 };
			return this.query_items(model.type(), sel).then((dd: IEtudiantAffectation[]) => {
				oRet = ((dd !== undefined) && (dd !== null)) ? dd : [];
				this.sort_array(oRet);
				return oRet;
			}).catch((e) => {
				return oRet;
			});
		}
		let ids: string[] = grp.childrenids;
		if ((ids === undefined) || (ids === null)) {
			ids = [];
		}
		return this.get_items_array(ids).then((gg: IGroupe[]) => {
			let oAr: Promise<IEtudiantAffectation[]>[] = [];
			if ((gg !== undefined) && (gg !== null)) {
				for (let g of gg) {
					oAr.push(this.get_semestre_groupe_etudaffectations(sem, g));
				}
			}// gg
			return Promise.all(oAr);
		}).then((dd) => {
			if ((dd !== undefined) && (dd !== null)) {
				for (let xx of dd) {
					for (let a of xx) {
						oRet.push(a);
					}
				}// xx
			}// dd
			this.sort_array(oRet);
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//get_semestre_groupe_etudaffectations
	public get_unite_matieres(p: IUnite): Promise<IMatiere[]> {
		let oRet: IMatiere[] = [];
		if ((p === undefined) || (p === null)) {
			return Promise.resolve(oRet);
		}
		let uniteid = p.id;
		if (uniteid == null) {
			return Promise.resolve(oRet);
		}
		let m = this.itemFactory.create_matiere();
		let sel: any = { uniteid: uniteid };
		return this.query_items(m.type(), sel).then((gg: IMatiere[]) => {
			oRet = ((gg !== undefined) && (gg !== null)) ? gg : [];
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//
	public remove_person_avatar(pPers: IPerson, man: IUIManager): Promise<boolean> {
		return this.remove_item_avatar(pPers, man).then((b) => {
			return this.sync_person_avatars(pPers);
		});
	}//remove_person_avatar
	public remove_item_avatar(p: IBaseItem, man: IUIManager): Promise<boolean> {
		if ((p === undefined) || (p === null)) {
			return Promise.resolve(false);
		}
		if (p.url !== null) {
			man.revokeUrl(p.url);
			p.url = null;
		}
		let id = p.avatardocid();
		let avatarid = p.avatarid;
		if ((id === null) || (avatarid === null)) {
			return Promise.resolve(true);
		}
		return this.remove_attachment(id, avatarid);
	}//remove_person_avatar
	public save_person_avatar(pPers: IPerson, avatarid: string,
		avatarType: string, data: Blob, man: IUIManager): Promise<boolean> {
		return this.save_item_avatar(pPers, avatarid, avatarType, data, man).then((r) => {
		}).then((xx) => {
			return this.sync_person_avatars(pPers);
		}).then((x) => {
			return true;
		}).catch((err) => {
			return false;
		});
	}//save_person_avatar
	public save_item_avatar(p: IBaseItem, avatarid: string,
		avatarType: string, data: Blob, man: IUIManager): Promise<boolean> {
		if ((p === undefined) || (p === null) ||
			(avatarid === undefined) || (avatarid === null) ||
			(avatarType === undefined) || (avatarType === null) ||
			(data === undefined) || (data === null)) {
			return Promise.resolve(false);
		}
		if ((p.avatardocid() === null) || (data.size < 2)) {
			return Promise.resolve(false);
		}
		return this.maintains_attachment(p.avatardocid(), avatarid, data, avatarType).then((r) => {
			p.avatarid = avatarid;
			if (p.url !== null) {
				man.revokeUrl(p.url);
				p.url = null;
			}
			return this.save_item(p);
		}).then((cc) => {
			return this.retrieve_one_avatar(p, man);
		}).then((x) => {
			return true;
		}).catch((err) => {
			return false;
		});
	}//save_item_avatar
	public remove_etudaffectation(aff: IEtudiantAffectation): Promise<boolean> {
		if ((aff === undefined) || (aff === null)) {
			return Promise.resolve(false);
		}
		let affid = aff.id;
		if ((affid === undefined) || (affid === null)) {
			return Promise.resolve(false);
		}
		let pPers: IPerson = null;
		return this.find_item_by_id(aff.personid).then((pf: IPerson) => {
			pPers = (pf !== undefined) ? pf : null;
			if (pPers == null) {
				return Promise.resolve([]);
			} else {
				let model = this.itemFactory.create_etudiantevent();
				return this.query_items(model.type(), { etudiantaffectationid: affid });
			}
		}).then((gg: IEtudiantEvent[]) => {
			for (let g of gg) {
				g.deleted = true;
			}
			return this.maintains_items(gg);
		}).then((xa) => {
			return this.remove_item(aff);
		}).then((xr) => {
			if (pPers !== null) {
				let vv = this.remove_id_from_array(pPers.affectationids, affid);
				pPers.affectationids = vv;
				return this.save_item(pPers);
			} else {
				return Promise.resolve(false);
			}
		}).catch((e) => {
			return false;
		});
	}//remove_profaffectation
	public remove_profaffectation(aff: IEnseignantAffectation): Promise<boolean> {
		if ((aff === undefined) || (aff === null)) {
			return Promise.resolve(false);
		}
		let affid = aff.id;
		if ((affid === undefined) || (affid === null)) {
			return Promise.resolve(false);
		}
		let pPers: IPerson = null;
		return this.find_item_by_id(aff.personid).then((pf: IPerson) => {
			pPers = (pf !== undefined) ? pf : null;
			if (pPers == null) {
				return Promise.resolve([]);
			} else {
				let model = this.itemFactory.create_groupeevent();
				return this.query_items(model.type(), { profaffectationid: affid });
			}
		}).then((gg: IGroupeEvent[]) => {
			let pp: Promise<boolean>[] = [];
			for (let g of gg) {
				pp.push(this.remove_groupeevent(g));
			}
			return Promise.all(pp);
		}).then((xa) => {
			return this.remove_item(aff);
		}).then((xr) => {
			if (pPers !== null) {
				let vv = this.remove_id_from_array(pPers.affectationids, affid);
				pPers.affectationids = vv;
				return this.save_item(pPers);
			} else {
				return Promise.resolve(false);
			}
		}).catch((e) => {
			return false;
		});
	}//remove_profaffectation
	public remove_groupeevent(item: IGroupeEvent): Promise<boolean> {
		if ((item === undefined) || (item === null)) {
			return Promise.resolve(false);
		}
		let id = item.id;
        if (id === null) {
            return Promise.resolve(false);
        }
		let model = this.itemFactory.create_etudiantevent();
		return this.query_items(model.type(), { groupeeventid: id }).then((e1: IEtudiantEvent[]) => {
			let e2: IEtudiantEvent[] = ((e1 !== undefined) && (e1 !== null)) ? e1 : [];
			for (let p of e2) {
				p.deleted = true;
			}// p
			return this.maintains_items(e2);
		}).then((xx) => {
			return this.remove_item(item);
		}).then((z) => {
			return this.find_item_by_id(item.personid);
		}).then((pPers: IPerson) => {
			if (pPers !== null) {
				let vv = this.remove_id_from_array(pPers.eventids, id);
				pPers.eventids = vv;
				return this.save_item(pPers);
			} else {
				return Promise.resolve(false);
			}
		}).catch((e) => {
			return false;
		});
	}//remove_groupeevent
	public sync_person_avatars(pPers: IPerson): Promise<boolean> {
		if ((pPers === undefined) || (pPers === null)) {
			return Promise.resolve(false);
		}
		if ((pPers.id === null) || (pPers.rev === null)) {
			return Promise.resolve(false);
		}
		let items: IBaseItem[] = [];
		let avatarid = pPers.avatarid;
		return this.get_items_array(pPers.administratorids).then((pp1: IBaseItem[]) => {
			if ((pp1 !== undefined) && (pp1 !== null) && (pp1.length > 0)) {
				for (let x of pp1) {
					x.avatarid = avatarid;
					items.push(x);
				}
			}
			return this.get_items_array(pPers.enseignantids);
		}).then((pp2) => {
			if ((pp2 !== undefined) && (pp2 !== null) && (pp2.length > 0)) {
				for (let x of pp2) {
					x.avatarid = avatarid;
					items.push(x);
				}
			}
			return this.get_items_array(pPers.etudiantids);
		}).then((pp3) => {
			if ((pp3 !== undefined) && (pp3 !== null) && (pp3.length > 0)) {
				for (let x of pp3) {
					x.avatarid = avatarid;
					items.push(x);
				}
			}
			return this.get_items_array(pPers.affectationids);
		}).then((pp4) => {
			if ((pp4 !== undefined) && (pp4 !== null) && (pp4.length > 0)) {
				for (let x of pp4) {
					x.avatarid = avatarid;
					items.push(x);
				}
			}
			return this.get_items_array(pPers.eventids);
		}).then((pp5) => {
			if ((pp5 !== undefined) && (pp5 !== null) && (pp5.length > 0)) {
				for (let x of pp5) {
					x.avatarid = avatarid;
					items.push(x);
				}
			}
			return this.maintains_items(items);
		}).then((xx) => {
			return true;
		}).catch((e) => {
			return false;
		});
	}// sync_avatars;
	public retrieve_avatars(items: IBaseItem[], man: IUIManager): Promise<IBaseItem[]> {
        if ((items === undefined) || (items === null)) {
            return Promise.resolve([]);
        }
        if (items.length < 1) {
            return Promise.resolve([]);
        }
        let pp: Promise<IBaseItem>[] = [];
        for (let p of items) {
            let x = this.retrieve_one_avatar(p, man);
            pp.push(x);
        }// p
        return Promise.all(pp);
    }// retrive_avatars
	public retrieve_one_avatar(item: IBaseItem, man: IUIManager): Promise<IBaseItem> {
        if ((item === undefined) || (item === null)) {
            return Promise.resolve(item);
        }
		if ((item.url !== undefined) && (item.url !== null)) {
			return Promise.resolve(item);
		}
		item.url = null;
		let id = item.avatarid;
		let docid = item.avatardocid();
		if ((id === undefined) || (id === null) || (docid === undefined) || (docid === null)) {
			return Promise.resolve(item);
		}
        return this.find_attachment(docid, id).then((b) => {
			if ((b !== undefined) && (b !== null)) {
				item.url = man.createUrl(b);
			}
			return item;
		}).catch((e) => {
			return item;
		});
	}//retrieve_one_avatar
	public init_database(): Promise<boolean> {
		if (this._bInitialized) {
			return Promise.resolve(true);
		}
		let bRet: boolean = false;
		let fact = this.itemFactory;
		let pPersist = this.service;
		if ((pPersist === null) || (fact === null)) {
			return Promise.resolve(bRet);
		}
		let pPers: IPerson = null;
		return pPersist.create_indexes(INDEXED_FIELDS).then((bb) => {
			pPers = fact.create_super_administrator();
			pPers.check_id();
			return this.find_item_by_id(pPers.id);
		}).then((xPers: IPerson) => {
			if ((xPers === undefined) || (xPers === null)) {
				pPers.reset_password();
				return this.save_item(pPers);
			} else {
				return Promise.resolve(true);
			}
		}).then((xRet) => {
			bRet = ((xRet !== undefined) && (xRet !== null));
			this._bInitialized = bRet;
			return bRet;
		}).catch((err) => {
			return false;
		});
	}// init_database
}// class DataManager