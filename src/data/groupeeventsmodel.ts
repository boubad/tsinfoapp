// groupeeventsmodel.ts
//
import {UserInfo} from './userinfo';
import {BaseEditViewModel} from './baseeditmodel';
import {EVT_NOTE, EVT_ABSENCE, EVT_RETARD, EVT_MISC, GENRE_TP,
GVT_EXAM, GVT_CONTROL, GVT_TP, GVT_TD, GVT_PROMO, GVT_MISC, PROFAFFECTATION_TYPE} from './infoconstants';
import {IEnseignantAffectation, IEtudiantAffectation, IDepartement, IAnnee, ISemestre, IUnite, IMatiere,
IGroupe,
IGroupeEvent, IEtudiantEvent, IUIManager, IBaseItem, IDepartementPerson} from 'infodata';
//
const EMPTY_STRING: string = '';
//
export class GroupeEventsModel extends BaseEditViewModel<IGroupeEvent> {
	//
    private _profaffectations: IEnseignantAffectation[];
    private _current_affectation: IEnseignantAffectation;
    private _etud_affectations: IEtudiantAffectation[];
    private _current_etudaffectations: IEtudiantAffectation[];
    private _etudaffectation_model: IEtudiantAffectation;
    private _notes: IEtudiantEvent[];
    private _evts: IEtudiantEvent[];
    private _evt_model: IEtudiantEvent;
    private _etud_evt_genre: string;
    private _current_etudevts: IEtudiantEvent[];
    private _all_notes: IEtudiantEvent[];
    //
    private _startdate: string;
    private _enddate: string;
    //
    private _evtMode: boolean;
    private _noteMode: boolean;
    private _editMode: boolean;
    //
	public xgenres: string[] = [GVT_TP, GVT_CONTROL, GVT_TD, GVT_PROMO, GVT_EXAM, GVT_MISC];
	private _xgenre: string;
	public etudEvtGenres: string[] = [EVT_ABSENCE, EVT_RETARD, EVT_MISC];
	//
	private _xdeps: IDepartement[];
	//
    constructor(userinfo: UserInfo) {
        super(userinfo);
        this.title = "Edition Devoirs";
		this._xgenre = this.xgenres[0];
        this._profaffectations = [];
        this._current_affectation = null;
        this._etud_affectations = [];
        this._current_etudaffectations = null;
        this._etudaffectation_model = null;
        this._notes = [];
        this._evts = [];
        this._evt_model = null;
        this._etud_evt_genre = null;
        this._current_etudevts = [];
        this._all_notes = [];
        this._startdate = null;
        this._enddate = null;
        this._evtMode = false;
        this._noteMode = false;
        this._editMode = true;
    }// constructor
	protected get_remove_selector(): any {
		return { groupeeventid: this.currentItem.id };
	}
	protected get_groupes(): IGroupe[] {
		return (this.userInfo !== null) ? this.userInfo.groupes : [];
	}
	public get evtMode(): boolean {
		return this._evtMode;
	}
	public set evtMode(s: boolean) {
		this._evtMode = ((s !== undefined) && (s !== null)) ? s : false;
	}
	public get editMode(): boolean {
		return this._editMode;
	}
	public set editMode(s: boolean) {
		this._editMode = ((s !== undefined) && (s !== null)) ? s : false;
	}
	public get noteMode(): boolean {
		return this._noteMode;
	}
	public set noteMode(s: boolean) {
		this._noteMode = ((s !== undefined) && (s !== null)) ? s : false;
	}
	protected get profAffectations(): IEnseignantAffectation[] {
        if ((this._profaffectations === undefined) || (this._profaffectations === null)) {
            this._profaffectations = [];
        }
        return this._profaffectations;
    }
    protected set profAffectations(s: IEnseignantAffectation[]) {
        this._profaffectations = ((s !== undefined) && (s !== null)) ? s : [];
    }
	public get xdepartements(): IDepartement[] {
		return ((this._xdeps !== undefined) && (this._xdeps !== null)) ? this._xdeps : [];
	}
	protected get currentProfAffectation(): IEnseignantAffectation {
        return (this._current_affectation !== undefined) ?
            this._current_affectation : null;
    }
    protected set currentProfAffectation(s: IEnseignantAffectation) {
        this._current_affectation = (s !== undefined) ? s : null;
        let x = this.currentProfAffectation;
		this._startdate = null;
		this._enddate = null;
        if (x !== null) {
            this._startdate = this.date_to_string(x.startDate);
            this._enddate = this.date_to_string(x.endDate);
        }
		if ((this._startdate == null) && (this.semestre !== null)) {
			this._startdate = this.date_to_string(this.semestre.startDate);
		}
		if ((this._enddate == null) && (this.semestre !== null)) {
			this._enddate = this.date_to_string(this.semestre.endDate);
		}
    }
	public get xgenre(): string {
		return ((this._xgenre !== undefined) && (this._xgenre !== null)) ? this._xgenre : GVT_TP;
	}
	public set xgenre(s: string) {
		this._xgenre = ((s !== undefined) && (s !== null)) ? s : GVT_TP;
		this.currentItem.genre = this._xgenre;
	}
    protected get profaffectationid(): string {
        let x = this.currentProfAffectation;
        return (x !== null) ? x.id : null;
    }
	public get startDate(): string {
        return (this._startdate !== undefined) ? this._startdate : null;
    }
    public get endDate(): string {
        return (this._enddate !== undefined) ? this._enddate : null;
    }
    public get etudEvents(): IEtudiantEvent[] {
        return ((this._evts !== undefined) && (this._evts !== null)) ? this._evts : [];
    }
    public set etudEvents(s: IEtudiantEvent[]) {
        this._evts = ((s !== undefined) && (s !== null)) ? s : [];
    }
    public get allNotes(): IEtudiantEvent[] {
        return ((this._all_notes !== undefined) && (this._all_notes !== null)) ? this._all_notes : [];
    }
    public set allNotes(s: IEtudiantEvent[]) {
        this._all_notes = ((s !== undefined) && (s !== null)) ? s : [];
    }
    public get currentEtudEvts(): IEtudiantEvent[] {
        return ((this._current_etudevts !== undefined) && (this._current_etudevts !== null)) ?
            this._current_etudevts : [];
    }
    public set currentEtudEvts(s: IEtudiantEvent[]) {
        this._current_etudevts = (s !== undefined) ? s : null;
    }
	protected get eventModel(): IEtudiantEvent {
        if (this._evt_model === null) {
            this._evt_model = this.itemFactory.create_etudiantevent();
        }
        return this._evt_model;
    }
    protected get etudAffectationModel(): IEtudiantAffectation {
        if (this._etudaffectation_model === null) {
            this._etudaffectation_model = this.itemFactory.create_etudiantaffectation({
                semestreid: this.semestreid,
                groupeid: this.groupeid
            });
        }
        return this._etudaffectation_model;
    }
    public get etudAffectations(): IEtudiantAffectation[] {
        return ((this._etud_affectations !== undefined) && (this._etud_affectations !== null)) ?
            this._etud_affectations : [];
    }
    public set etudAffectations(s: IEtudiantAffectation[]) {
        this._etud_affectations = ((s !== undefined) && (s !== null)) ? s : [];
    }
    public get currentEtudAffectations(): IEtudiantAffectation[] {
        return ((this._current_etudaffectations !== undefined) && (this._current_etudaffectations !== null)) ?
            this._current_etudaffectations : [];
    }
    public set currentEtudAffectations(s: IEtudiantAffectation[]) {
        this._current_etudaffectations = ((s !== undefined) && (s !== null)) ? s : [];
    }
	protected update_profaffectation(): any {
        this.currentProfAffectation = null;
        let semid: string = this.semestreid;
        let matid: string = this.matiereid;
        let grpid: string = this.groupeid;
        for (let a of this.profAffectations) {
            if ((a.semestreid == semid) && (a.matiereid == matid) &&
                (a.groupeid == grpid)) {
                this.currentProfAffectation = a;
                break;
            }
        }// a
		if (this.currentItem.rev == null) {
			let id = (this.currentProfAffectation !== null) ? this.currentProfAffectation.id : null;
			this.currentItem.profaffectationid = id;
		}
		let xid: string = null;
		if (this.currentItem.profaffectationid !== null) {
			xid = this.currentItem.profaffectationid;
			if (xid === undefined) {
				xid = null;
			}
			if ((xid !== null) && (xid.trim().length < 1)) {
				xid = null;
			}
		}
		if (xid == null) {
			this.edit_mode();
		}
        return true;
    }//update_profaffectation
	protected fill_etudaffectations(): Promise<any> {
        for (let a of this.etudAffectations) {
            let x = a.url;
            if (x !== null) {
                this.revokeUrl(x);
                a.url = null;
            }
        }
        this.currentEtudAffectations = [];
        this.etudAffectations = [];
		if (this.currentProfAffectation == null) {
			return Promise.resolve(true);
		}
		if (this.currentItem.profaffectationid != this.currentProfAffectation.id) {
			return Promise.resolve(true);
		}
        if ((this.semestre === null) || (this.groupe === null)) {
            return Promise.resolve(true);
        }
		if ((this.semestre.id != this.currentProfAffectation.semestreid) ||
			(this.groupeid != this.currentProfAffectation.groupeid)) {
			return Promise.resolve(true);
		}
		let aa: IEtudiantAffectation[] = [];
		return this.get_semestre_groupe_etudaffectations(this.semestre, this.groupe).then((pp) => {
			aa = ((pp !== undefined) && (pp !== null)) ? pp : [];
			return this.dataService.check_items_avatars(aa);
		}).then((b) => {
			return this.retrieve_avatars(aa);
		}).then((aaa: IEtudiantAffectation[]) => {
			this.etudAffectations = ((aaa !== undefined) && (aaa !== null)) ? aaa : [];
			return true;
		})
    }// fill_etudaffectations
	private retrieve_events(): Promise<IEtudiantEvent[]> {
		let oRet: IEtudiantEvent[] = [];
		let id = this.currentItem.id;
        if (id === null) {
            return Promise.resolve(oRet);
        }
		let pp: IEtudiantEvent[] = [];
		return this.dataService.query_items(this.eventModel.type(), { groupeeventid: id }).then((e1: IEtudiantEvent[]) => {
			pp = ((e1 !== undefined) && (e1 !== null)) ? e1 : [];
			return this.dataService.check_items_avatars(pp);
		}).then((x) => {
			return this.retrieve_avatars(pp);
		}).catch((xx: IEtudiantEvent[]) => {
			oRet = xx;
			return oRet;
		}).catch((e) => {
			return oRet;
		})
	}//retrieve_events
    protected fill_notes(): Promise<any> {
        let id = this.currentItem.id;
        if (id === null) {
            return Promise.resolve(true);
        }
		let pp: IEtudiantEvent[] = [];
        return this.dataService.query_items(this.eventModel.type(), { groupeeventid: id }).then((e1: IEtudiantEvent[]) => {
			pp = ((e1 !== undefined) && (e1 !== null)) ? e1 : [];
			return this.dataService.check_items_avatars(pp);
		}).then((x) => {
			return this.retrieve_avatars(pp);
		}).then((ee: IEtudiantEvent[]) => {
            if ((ee !== undefined) && (ee !== null)) {
                let oRet1: IEtudiantEvent[] = [];
                let oRet2: IEtudiantEvent[] = [];
                for (let x of ee) {
					if (x.groupeEventGenre == null) {
						x.groupeEventGenre = this.currentItem.genre;
					}
                    if (x.genre == EVT_NOTE) {
                        this.add_item_to_array(oRet1, x);
                    } else {
                        this.add_item_to_array(oRet2, x);
                    }
                }// e
                this._notes = oRet1;
                this._evts = oRet2;
            }// ee
            this.compute_all_notes();
            return true;
        }).catch((e) => {
			return false;
		});
    }
    protected compute_all_notes(): void {
        let item = this.currentItem;
        let id = (item !== null) ? item.id : null;
        if (id === null) {
            return;
        }
        let evts = this.etudEvents;
        let affs = this.etudAffectations;
        let xNotes = (this._notes !== null) ? this._notes : [];
        let oRet: IEtudiantEvent[] = [];
        for (let a of affs) {
            let personid = a.personid;
            for (let y of evts) {
                if (y.personid == personid) {
					if ((y.url === undefined) || (y.url === null)) {
						y.url = a.url;
					}
                    break;
                }
            }// y
            let bFound: boolean = false;
            for (let n of xNotes) {
                if (n.personid == personid) {
                    bFound = true;
                    this.add_item_to_array(oRet, n);
                }
            }// n
            if (!bFound) {
                let x: IEtudiantEvent = this.itemFactory.create_etudiantevent({
					url: a.url,
					avatarid: a.avatarid,
					personid: a.personid,
					firstname: a.firstname,
					lastname: a.lastname,
					semestreid: a.semestreid,
					matiereid: (this.currentEtudAffectations !== null) ? this.currentProfAffectation.matiereid : null,
					genre: EVT_NOTE,
					eventDate: item.eventDate,
					matiereName: this.matiereName,
					groupeName: this.groupeName,
					groupeid: (this.currentProfAffectation !== null) ? this.currentProfAffectation.groupeid : null,
					groupeeventid: item.id,
					etudiantaffectationid: a.id,
					groupeEventName: this.currentItem.name,
					groupeEventGenre: this.currentItem.genre,
					coefficient: this.currentItem.coefficient,
					etudiantid: a.etudiantid,
					anneeid: this.anneeid,
					anneeName: this.anneeName,
					semestreName: this.semestreName,
					matiereCoefficient: (this.matiere !== null) ? this.matiere.coefficient : 1.0,
					uniteid: this.uniteid,
					uniteCoefficient: (this.unite !== null) ? this.unite.coefficient : 1.0,
					uniteName: this.uniteName,
					departementid: this.departementid,
					departementName: this.departementName,
					semestreMinDate: this.semestreMinDate,
					semestreMaxDate: this.semestreMaxDate
                });
                x.check_id();
                this.add_item_to_array(oRet, x);
            }
        }// a
        this._all_notes = oRet;
    }// compute_all_notes
    protected perform_activate(): Promise<any> {
		let i1 = this.userInfo;
		if ((i1 === undefined) || (i1 === null)) {
			return Promise.resolve(false);
		}
		let info = i1.loginInfo;
		if ((info === undefined) || (info === null)) {
			return Promise.resolve(false);
		}
		this._profaffectations = [];
        this._current_affectation = null;
		this._xdeps = [];
        return super.perform_activate().then((rx) => {
			let pPers = this.person;
			let ids: string[] = ((pPers !== undefined) && (pPers !== null)) ? pPers.affectationids : [];
			return this.dataService.get_items_array(ids);
        }).then((items: IBaseItem[]) => {
			if ((items !== undefined) && (items !== null)) {
				for (let it of items) {
					if (it.type() == PROFAFFECTATION_TYPE) {
						let v: IEnseignantAffectation = <IEnseignantAffectation>it;
						this._profaffectations.push(v);
					}
				}
			}// items
			for (let a of this._profaffectations) {
				let id = a.groupeid;
				for (let g of info.all_groupes) {
					if (g.id == id) {
						let depid = g.departementid;
						for (let d of info.all_departements) {
							if (d.id == depid) {
								this.add_item_to_array(this._xdeps, d);
							}
						}// d
					}//groupe
				}// g
			}// a
			if (this._xdeps.length > 0) {
				this.departement = this._xdeps[0];
			}
			if (this.etudEvtGenre === null) {
                this.etudEvtGenre = EVT_ABSENCE;
            }
			return this.update_profaffectation();
		});
    }// perform_activate
    public get isEditable(): boolean {
        return (this.currentProfAffectation !== null) && (this.personid !== null) &&
            (this.currentProfAffectation.personid == this.personid);
    }
    public set isEditable(s: boolean) { }
    public get canEdit(): boolean {
        return (this.currentProfAffectation !== null) &&
            (this.currentProfAffectation.personid == this.personid);
    }

    public get etudEvtGenre(): string {
        return ((this._etud_evt_genre !== undefined) && (this._etud_evt_genre !== null)) ?
			this._etud_evt_genre : EVT_ABSENCE;
    }
    public set etudEvtGenre(s: string) {
        this._etud_evt_genre = ((s !== undefined) && (s !== null)) ? s : EVT_ABSENCE;
    }
    public get canAddEtudEvt(): boolean {
        return (this.currentItem !== null) && (this.currentItem.id !== null) && (this.etudAffectations.length > 0) &&
            (this.etudEvtGenre !== null) && this.canEdit;
    }
    public get cannotAddEtudEvt(): boolean {
        return (!this.canAddEtudEvt);
    }
    public get canEvtMode(): boolean {
        return (this.currentItem !== null) && (this.currentItem.id !== null) && (this.etudAffectations.length > 0);
    }
    public get canNoteMode(): boolean {
        return (this.currentItem !== null) && (this.currentItem.id !== null) && (this.etudAffectations.length > 0);
    }
    public evt_mode(): void {
        this.evtMode = true;
        this.noteMode = false;
        this.editMode = false;
    }
    public note_mode(): void {
        this.evtMode = false;
        this.noteMode = true;
        this.editMode = false;
    }
    public edit_mode(): void {
        this.evtMode = false;
        this.noteMode = false;
        this.editMode = true;
    }
    public get isNotEvtMode(): boolean {
        return (!this.evtMode) && (this.etudAffectations.length > 0);
        //  return (!this.evtMode);
    }
    public get isNotNoteMode(): boolean {
        return (!this.noteMode) && (this.allNotes.length > 0);
        //return (!this.noteMode);
    }
    public get isNotEditMode(): boolean {
        return (!this.editMode);
    }
    public get name(): string {
        return (this.currentItem !== null) ? this.currentItem.name : EMPTY_STRING;
    }
    public set name(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            x.name = s;
        }
    }
    public get location(): string {
        return (this.currentItem !== null) ? this.currentItem.location : EMPTY_STRING;
    }
    public set location(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            x.location = s;
        }
    }
    public get eventDate(): string {
        return (this.currentItem !== null) ?
            this.date_to_string(this.currentItem.eventDate) : null;
    }
    public set eventDate(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            x.eventDate = this.string_to_date(s);
        }
    }
    public get coefficient(): string {
        return (this.currentItem !== null) ?
            this.number_to_string(this.currentItem.coefficient) : EMPTY_STRING;
    }
    public set coefficient(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            let d = this.string_to_number(s);
            if ((d !== null) && (d > 0)) {
                x.coefficient = d;
            } else {
                x.coefficient = null;
            }
        }
    }
	public get minnote(): string {
        return (this.currentItem !== null) ?
            this.number_to_string(this.currentItem.minnote) : EMPTY_STRING;
    }
    public set minnote(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            let d = this.string_to_number(s);
            if ((d !== null) && (d >= 0)) {
                x.minnote = d;
            } else {
                x.minnote = null;
            }
        }
    }
	public get maxnote(): string {
        return (this.currentItem !== null) ?
            this.number_to_string(this.currentItem.maxnote) : EMPTY_STRING;
    }
    public set maxnote(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            let d = this.string_to_number(s);
            if ((d !== null) && (d >= 0)) {
                x.maxnote = d;
            } else {
                x.maxnote = null;
            }
        }
    }
    public get startTime(): string {
        return (this.currentItem !== null) ? this.currentItem.startTime : null;
    }
    public set startTime(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            x.startTime = s;
        }
    }
    public get endTime(): string {
        return (this.currentItem !== null) ? this.currentItem.endTime : null;
    }
    public set endTime(s: string) {
        let x = this.currentItem;
        if (x !== null) {
            x.endTime = s;
        }
    }

    protected is_refresh(): boolean {
        return (this.modelItem !== null) &&
            (this.personid !== null) && (this.groupeid !== null) && (this.matiereid !== null) &&
            (this.semestreid !== null) && (this.uniteid !== null) &&
            (this.anneeid) && (this.departementid !== null)
            && (this.currentProfAffectation !== null) &&
            (this.currentProfAffectation.id !== null);
    }
    protected create_item(): IGroupeEvent {
        let pPers = this.person;
        let firstname = (pPers !== null) ? pPers.firstname : null;
        let lastname = (pPers !== null) ? pPers.lastname : null;
        let p = this.itemFactory.create_groupeevent({
			personid: this.personid,
			lastname: lastname,
            firstname: firstname,
			semestreid: this.semestreid,
			matiereid: this.matiereid,
			matiereName: (this.matiere !== null) ? this.matiere.text : null,
			groupeName: (this.groupe !== null) ? this.groupe.text : null,
			groupeid: (this.currentProfAffectation !== null) ? this.currentProfAffectation.groupeid : null,
            profaffectationid: this.profaffectationid,
			avatarid: (pPers !== null) ? pPers.avatarid : null,
			coefficient: 1.0,
			minnote: 0,
			maxnote: 20.0,
			anneeid: this.anneeid,
			anneeName: this.anneeName,
			semestreName: this.semestreName,
			matiereCoefficient: (this.matiere !== null) ? this.matiere.coefficient : 1.0,
			uniteid: this.uniteid,
			uniteCoefficient: (this.unite !== null) ? this.unite.coefficient : 1.0,
			uniteName: this.uniteName,
			departementid: this.departementid,
			departementName: this.departementName,
			semestreMinDate: this.semestreMinDate,
			semestreMaxDate: this.semestreMaxDate
        });
        return p;
    }// create_item
	protected prepare_model(): any {
		return {
			profaffectationid: (this.currentProfAffectation !== null) ? this.currentProfAffectation.id : null
		};
	}// prepare_model
    protected is_storeable(): boolean {
        if (this.currentItem !== null) {
			this.currentItem.profaffectationid = (this.currentProfAffectation !== null) ? this.currentProfAffectation.id : null;
			this.currentItem.semestreid = this.semestreid;
			this.currentItem.matiereid = this.matiereid;
			this.currentItem.personid = this.personid;
			this.currentItem.firstname = this.person.firstname;
			this.currentItem.lastname = this.person.lastname;
			this.currentItem.departementid = this.departementid;
            this.currentItem.genre = (this.xgenre !== null) ? this.xgenre : null;
        }
        return super.is_storeable();
    }
    protected post_update_groupe(): Promise<boolean> {
		return super.post_update_groupe().then((r) => {
			this.etudEvents = [];
			this.etudAffectationModel.groupeid = this.groupeid;
			this.update_profaffectation();
			return this.fill_etudaffectations();
		}).then((xr) => {
			return this.activate_refresh();
        });
    }
    protected post_update_semestre(): Promise<boolean> {
		return super.post_update_semestre().then((rx) => {
			this.modelItem.semestreid = this.semestreid;
			this.etudAffectationModel.semestreid = this.semestreid;
			this.update_profaffectation();
			return this.fill_etudaffectations();
		}).then((r) => {
			return this.activate_refresh();
        });
    }
    protected post_update_matiere(): Promise<boolean> {
		return super.post_update_matiere().then((rx) => {
			this.modelItem.matiereid = this.matiereid;
			this.update_profaffectation();
			return this.activate_refresh();
		});
    }
    protected post_change_item(): Promise<any> {
		let item = this.currentItem;
		if (item != null) {
			if (item.avatarid == null) {
				item.avatarid = this.person.avatarid;
			}
			let id = (this.currentItem != null) ? this.currentItem.genre : null;
			let aa = this.xgenres;
			let p: string = null;
			for (let x of aa) {
				if (x == id) {
					p = x;
					break;
				}
			}
			this.xgenre = p;
		}// item
		return this.retrieve_one_avatar(item).then((rx) => {
			return this.fill_etudaffectations();
        }).then((rx) => {
			return this.fill_notes();
		});
    }// post_change_item
   
    public get canAdd(): boolean {
        return (!this.addMode) && (this.currentProfAffectation !== null) &&
            (this.matiereid !== null) && (this.semestreid !== null) &&
            (this.groupeid !== null) && (this.xgenre !== null) &&
            (this.personid !== null) && this.canEdit;
    }
    public get canSaveNotes(): boolean {
        if (!this.canEdit) {
            return false;
        }
        if (this.allNotes.length < 1) {
            return false;
        }
        let bRet = false;
        for (let n of this.allNotes) {
            if (n.is_storeable() && n.selected) {
                bRet = true;
                break;
            }
        }
        return bRet;
    }
    public get cannotSaveNotes(): boolean {
        return (!this.canSaveNotes);
    }
    public get canSaveEtudEvents(): boolean {
        if (!this.canEdit) {
            return false;
        }
        let item = this.currentItem;
        let id = (item !== null) ? item.id : null;
        if ((id === null) || (this.etudEvtGenre === null) ||
            (this.etudAffectations.length < 1)) {
            return false;
        }
        let bRet = false;
        for (let x of this.etudAffectations) {
            if (x.selected) {
                bRet = true;
                break;
            }
        }
        return bRet;
    }
    public get cannotSaveEtudEvents(): boolean {
        return (!this.canSaveEtudEvents);
    }
    public get canRemoveEtudEvents(): boolean {
        let bRet = false;
        for (let x of this.etudEvents) {
            if (x.selected && (x.id !== null) && (x.rev !== null)) {
                bRet = true;
                break;
            }
        }
        return bRet;
    }
    public get cannotRemoveEtudEvents(): boolean {
        return (!this.canRemoveEtudEvents);
    }
    public removeEtudEvents(): any {
        let ee: IEtudiantEvent[] = [];
        for (let x of this.etudEvents) {
            if (x.selected && (x.id !== null) && (x.rev !== null)) {
                ee.push(x);
            }
        }// x
        if (ee.length < 1) {
            return Promise.resolve(true);
        }
		return this.confirm('Voulez-vous vraiment supprimer?').then((b) => {
			if ((b !== undefined) && (b !== null) && (b == true)) {
				this.is_busy = true;
				this.clear_error();
				let pp: Promise<any>[] = [];
				let service = this.dataService;
				for (let xx of ee) {
					let p = service.remove_item(xx);
					pp.push(p);
				}// xx
				return Promise.all(pp);
			} else {
				return Promise.resolve([]);
			}
		}).then((r) => {
            return this.fill_notes();
		}).then((x) => {
			this.is_busy = false;
			return true;
        }).catch((err) => {
            this.set_error(err);
			this.is_busy = false;
			return false;
        });
    }// removeetudEvent
    public saveEtudEvents(): any {
		this.is_busy = true;
        let item = this.currentItem;
        let xgenre = this.etudEvtGenre;
        let id = (item !== null) ? item.id : null;
        if ((xgenre === null) || (id === null)) {
			this.is_busy = false;
            return;
        }
        let oRet: IEtudiantEvent[] = [];
        let affs = this.etudAffectations;
		let selectedAffes: IEtudiantAffectation[] = [];
        for (let a of affs) {
            if (a.selected) {
				selectedAffes.push(a);
                let x = this.itemFactory.create_etudiantevent({
					departementid: this.departementid,
					departementName: this.departementName,
                    url: a.url,
					avatarid: a.avatarid,
					personid: a.personid,
					firstname: a.firstname,
					lastname: a.lastname,
					semestreid: a.semestreid,
					matiereid: this.currentProfAffectation.matiereid,
					genre: this.etudEvtGenre,
					eventDate: item.eventDate,
					matiereName: this.matiereName,
					groupeName: this.groupeName,
					anneeName: this.anneeName,
					groupeid: (this.currentProfAffectation !== null) ? this.currentProfAffectation.groupeid : null,
					groupeeventid: item.id,
					etudiantaffectationid: a.id,
					groupeEventName: this.currentItem.name,
					groupeEventGenre: this.currentItem.genre,
					coefficient: this.currentItem.coefficient,
					etudiantid: a.etudiantid,
					anneeid: this.anneeid,
					semestreName: this.semestreName,
					matiereCoefficient: (this.matiere !== null) ? this.matiere.coefficient : 1.0,
					uniteid: this.uniteid,
					uniteCoefficient: (this.unite !== null) ? this.unite.coefficient : 1.0,
					uniteName: this.uniteName,
					semestreMinDate: this.semestreMinDate,
					semestreMaxDate: this.semestreMaxDate
                });
                x.check_id();
                oRet.push(x);
            }// selected
        }// a
        if (oRet.length < 1) {
			this.is_busy = false;
            return Promise.resolve(true);
        }
        let pp: Promise<any>[] = [];
        let service = this.dataService;
        for (let px of oRet) {
			pp.push(service.save_item(px));
        }
        this.clear_error();
        return Promise.all(oRet).then((r) => {
            for (let aa of selectedAffes) {
                aa.selected = false;
            }
            return this.fill_notes();
		}).then((x) => {
			this.is_busy = false;
			return true;
        }).catch((err) => {
            this.set_error(err);
			this.is_busy = false;
            return false;
        });
    }// saveEtudEvents
	private retrieve_save_notes(): IEtudiantEvent[] {
		let oRet: IEtudiantEvent[] = [];
		let vMin: number = (this.currentItem !== null) ? this.currentItem.minnote : null;
		let vMax: number = (this.currentItem !== null) ? this.currentItem.maxnote : null;
		for (let p of this.allNotes) {
			let bOk: boolean = true;
			if (p.selected && p.is_storeable()) {
				let n = p.note;
				if ((n !== undefined) && (n !== null)) {
					if ((vMin !== null) && (n < vMin)) {
						bOk = false;
					}
					if (bOk && (vMax !== null) && (n > vMax)) {
						bOk = false;
					}
					if (bOk) {
						oRet.push(p);
					}
				}// note
			}// p
			if (!bOk) {
				p.selected = false;
			}
		}// p
		return oRet;
	}//retrieve_save_notes
    public saveNotes(): any {
		this.is_busy = true;
        let oRet: IEtudiantEvent[] = this.retrieve_save_notes();
        for (let n of this.allNotes) {
            if (n.selected && n.is_storeable() && (n.note !== null)) {
                oRet.push(n);
            }
        }// n
        if (oRet.length < 1) {
			this.is_busy = false;
            return Promise.resolve(true);
        }
        let pp: Promise<any>[] = [];
        let service = this.dataService;
        for (let px of oRet) {
			pp.push(service.save_item(px));
        }
        this.clear_error();
        return Promise.all(oRet).then((rr) => {
			for (let aa of oRet) {
                aa.selected = false;
            }
            return this.fill_notes();
		}).catch((x) => {
			this.is_busy = false;
			return true;
        }).catch((err) => {
            this.set_error(err)
            return false;
        });
    }// saveNotes
    public canActivate(params?: any, config?: any, instruction?: any): any {
		return this.is_connected;
    }// activate
	public save(): Promise<any> {
		let item = this.currentItem;
		if (item === null) {
			return Promise.resolve(false);
		}
		if (!item.is_storeable()) {
			return Promise.resolve(false);
		}
		if (item.avatarid == null) {
			item.avatarid = this.person.avatarid;
		}
		this.clear_error();
		return this.dataService.save_item(item).then((r) => {
			return this.refreshAll();
		}).catch((err) => {
			this.set_error(err);
			return false;
		});
	}// save
	public refresh(): Promise<any> {
		this.clear_error();
		if (this.items.length > 0) {
			for (let elem of this.items) {
				let x = elem.url;
				if (x !== null) {
					this.revokeUrl(x);
					elem.url = null;
				}
			}// elem
		}
		this.items = [];
		let nbItems = this.allIds.length;
		if (nbItems < 1) {
			return Promise.resolve(true);
		}
		this.is_busy = true;
		let nc = this.itemsPerPage;
		let istart = (this.currentPage - 1) * nc;
		if (istart < 0) {
			istart = 0;
		}
		let iend = istart + nc - 1;
		if (iend >= nbItems) {
			iend = nbItems - 1;
		}
		let xids: string[] = [];
		for (let i = istart; i <= iend; ++i) {
			xids.push(this.allIds[i]);
		}
		let oldid: string = this.currentItem.id;
		return this.dataService.get_items_array(xids).then((rr: IGroupeEvent[]) => {
			let rx = ((rr !== undefined) && (rr !== null)) ? rr : [];
			return this.retrieve_avatars(rx);
		}).then((xx: IGroupeEvent[]) => {
			this.items = [];
			for (let xc of xx) {
				this.add_item_to_array(this.items, xc);
			}
			let p = this.sync_array(this.items, oldid);
			this.currentItem = p;
			this.pageStatus = this.get_pageStatus();
			//return this.fill_notes();
		}).then((xx) => {
			this.is_busy = false;
			return true;
		}).catch((e) => {
			this.is_busy = false;
			return false;
		})
	}// refresh
	private get_semestre_groupe_etudaffectations(sem: ISemestre, grp: IGroupe): Promise<IEtudiantAffectation[]> {
		return this.dataService.get_semestre_groupe_etudaffectations(sem, grp);
	}//get_semestre_groupe_etudaffectations
}// class Profgroupeevents
