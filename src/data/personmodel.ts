//personmodel.ts
//
import {UserInfo} from './userinfo';
import {BaseEditViewModel} from './baseeditmodel';
import {CSVImporter} from './cvsimporter';
import {IPerson, IDepartementPerson, ITransformArray,IBaseItem} from 'infodata';
//
interface MyEvent extends EventTarget {
    target: { files: any, result: any };
}
//
//
export class PersonViewModel<T extends IDepartementPerson> extends BaseEditViewModel<T> {
    //
    private _current_person: IPerson = null;
	private _importer: CSVImporter = null;
    //
    constructor(info: UserInfo) {
        super(info);
    }// constructor
	//
	public get canImport(): boolean {
        return (this.departementid !== null) && this.is_not_busy;
    }
    public importFileChanged(event: MyEvent): any {
        let files = event.target.files;
        if ((files !== undefined) && (files !== null) && (files.length > 0)) {
			this.is_busy = true;
            let file = files[0];
            if ((this._importer === undefined) || (this._importer === null)) {
                this._importer = new CSVImporter(this.dataService.itemFactory);
            }
            let stype = this.currentPerson.type();
            this._importer.transform_file(file, stype).then((dd: IPerson[]) => {
                return this.import_persons(dd);
			}).then((b)=>{
				this.is_busy = false;
				return true;
            }).catch((err) => {
                this.set_error(err);
				this.is_busy = false;
				return false;
            });
        }// files
    }// fileChanged
    protected import_persons(dd: IPerson[]): Promise<boolean> {
        let depid = this.departementid;
        if ((dd === undefined) || (dd === null) || (depid === null)) {
            return Promise.resolve(false);
        }
        let pp: IPerson[] = [];
        for (let x of dd) {
            if ((x !== undefined) && (x !== null)) {
                if ((x.username === undefined) || (x.username === null)) {
                    x.username = this.create_username(x.lastname, x.firstname);
                }
                if (x.id === null) {
                    x.id = x.create_id();
                }
                if ((x.departementids === undefined) || (x.departementids === null)) {
                    x.departementids = [];
                }
				let ps = x.password;
				if ((ps === undefined) || (ps === null)){
					x.reset_password();
				}
                this.add_id_to_array(x.departementids, depid);
                if (x.is_storeable()) {
                    pp.push(x);
                }
            }
        }// x
        if (pp.length < 1) {
            return Promise.resolve(false);
        }
        let service = this.dataService;
        return service.maintains_items(pp).then((zz) => {
            let ppp: T[] = [];
            for (let z of pp) {
                let p: T = this.create_item();
                p.departementid = depid;
				p.departementName = this.departementName;
                p.personid = z.id;
                p.firstname = z.firstname;
                p.lastname = z.lastname;
                ppp.push(p);
            }// z
            if (ppp.length > 0) {
                return service.maintains_items(ppp);
            } else {
                return [];
            }
        }).then((w) => {
            return this.refreshAll();
        }).catch((err) => {
            this.set_error(err);
            return false;
        })
    }// import_persons
    //
    //
	protected create_person(): IPerson {
        return this.itemFactory.create_person();
    }
	 protected prepare_model(): any {
		return {type: this.modelItem.type(),
			departementid:this.departementid};
	}// prepare_model
	protected perform_activate(): Promise<any> {
		return super.perform_activate().then((r) => {
			if (this._current_person === null) {
				this._current_person = this.create_person();
			}
			return true;
		});
	}// perform_activate
    protected post_update_departement(): Promise<boolean> {
		return super.post_update_departement().then((r)=>{
			this.modelItem.departementid = this.departementid;
            return this.activate_refresh();
		});
    }// post_change_departement
    public get currentPerson(): IPerson {
		if ((this._current_person === undefined) || (this._current_person === null)) {
			this._current_person = this.create_person();
		}
        return this._current_person;
    }
    public set currentPerson(s: IPerson) {
        this._current_person = ((s !== undefined) && (s !== null)) ?
			s : this.create_person();
    }
    //
    public reset_password(): any {
		let x: IPerson = this.currentPerson;
		let id = (x !== null) ? x.id : null;
		if ((id === null) || (x.rev === null)) {
			return;
		}
		this.is_busy = true;
		let service = this.dataService;
		this.clear_error();
		x.reset_password();
		return service.save_item(x).then((r) => {
			this.info_message = 'Mot de passe modifi??.';
			this.is_busy = false;
		}).catch((err) => {
			this.set_error(err);
			this.is_busy = false;
		});
    }// reset_password
	//
	private sync_avatars(): Promise<boolean> {
		return this.sync_person_avatars(this.currentPerson);
	}// sync_avatars;
    //
    public saveAvatar(): any {
		let f = this.fileDesc;
		let p = this.currentPerson;
		if ((f === null) || (p === null)) {
			return;
		}
		if ((p.id === null) || (p.rev === null) || (!f.is_storeable)) {
			return;
		}
		let id = p.id;
		if (id === null) {
			return;
		}
		let avatarid = f.name;
		let type = f.type;
		let data = f.data;
		if ((avatarid === null) || (type === null) || (data === null)) {
			return;
		}
		this.is_busy = true;
		this.clear_error();
		return this.dataService.save_person_avatar(p,avatarid,type,data,this.uiManager).then((r) => {
			this.fileDesc.clear_url();
			this.fileDesc.clear();
		}).then((cc)=>{
			this.is_busy = false;
			this.info_message = 'Avatar modifi??.';
		}).catch((err) => {
			this.set_error(err);
			this.is_busy = false;
		});
    }// saveAvatar
	//
	public removeAvatar(): any {
		let pPers = this.currentPerson;
		if ((pPers === undefined) || (pPers === null)){
			return Promise.resolve(false);
		}
		if ((pPers.id === null) || (pPers.rev === null)){
			return Promise.resolve(false);
		}
		let avatarid = pPers.avatarid;
		if (avatarid === null){
			return Promise.resolve(false);
		}
		this.is_busy = true;
		let p = this.currentItem;
		return this.confirm('Voulez-vous vraiment supprimer cet avatar?').then((bRet) => {
			if (bRet) {
				this.clear_error();
				return this.dataService.remove_person_avatar(pPers,this.uiManager);
			} else {
				return Promise.resolve(false);
			}
		}).then((x) => {
			if (x) {
				this.fileDesc.clear();
				this.info_message = 'Avatar supprim??.';
				return Promise.resolve(false);
			} else {
				return Promise.resolve(false);
			}
		}).then((xx)=>{
			this.is_busy = false;
			return true;
		}).catch((err) => {
			this.set_error(err);
			this.is_busy = false;
			return false;
		});
	}// removeAvatar
    //
	protected post_change_item(): Promise<any> {
        return super.post_change_item().then((r) => {
			let p = this.currentItem;
			let personid = (p !== null) ? p.personid : null;
            if (personid !== null) {
                return this.dataService.find_item_by_id(personid);
            } else {
                return null;
            }
        }).then((pPers: IPerson) => {
            this.currentPerson = ((pPers !== undefined) && (pPers !== null)) ? pPers :
                this.create_person();
            return this.retrieve_one_avatar(this.currentPerson);
        }).then((r) => {
			this.currentItem.url = this.currentPerson.url;
			if ((this.currentItem.avatarid == null) && (this.currentPerson.avatarid !== null)) {
				this.currentItem.avatarid = this.currentPerson.avatarid;
				return this.dataService.save_item(this.currentItem);
			} else {
				return Promise.resolve(true);
			}
        });

    }// post_change_item
    protected is_refresh(): boolean {
        return (this.departementid !== null);
    }
    protected is_storeable(): boolean {
        return this.currentPerson.is_storeable() && (this.departementid !== null);
    }
    public get username(): string {
        return this.currentPerson.username;
    }
    public set username(s: string) {
        this.currentPerson.username = s;
    }
    public get firstname(): string {
        return this.currentPerson.firstname;
    }
    public set firstname(s: string) {
        this.currentPerson.firstname = s;
    }
    public get lastname(): string {
        return this.currentPerson.lastname;
    }
    public set lastname(s: string) {
        this.currentPerson.lastname = s;
    }
    public get email(): string {
        return this.currentPerson.email;
    }
    public set email(s: string) {
        this.currentPerson.email = s;
    }
    public get phone(): string {
        return this.currentPerson.phone;
    }
    public set phone(s: string) {
        this.currentPerson.phone = s;
    }
    public save(): Promise<any> {
        let pPers = this.currentPerson;
        if ((this.departementid === null) || (pPers === null)) {
            return Promise.resolve(false);
        }
		if (!pPers.is_storeable()) {
			return Promise.resolve(false);
        }
		this.is_busy = true;
		let item = this.currentItem;
        if (item === null) {
            item = this.create_item();
            if (item === null) {
                return Promise.resolve(false);
            }
        }
		pPers.id = pPers.create_id();
		let ps = pPers.password;
		if ((ps === undefined) || (ps === null)){
			pPers.reset_password();
		}
		item.departementid = this.departementid;
		item.departementName = this.departementName;
		item.personid = pPers.id;
		item.firstname = pPers.firstname;
		item.lastname = pPers.lastname;
		item.avatarid = pPers.avatarid;
		let bOld = (item.rev !== null);
		this.clear_error();
		return this.dataService.save_item(this.currentPerson).then((b) => {
			return this.dataService.save_item(item);
		}).then((rx) => {
			this.is_busy = false;
			if (bOld) {
                return this.refresh();
            } else {
                return this.refreshAll();
            }
        }).catch((err) => {
            this.set_error(err);
			this.is_busy = false;
			return false;
        });
    }// save
	public get isEditable(): boolean {
		return this.is_admin || this.is_super;
    }
	public set isEditable(b:boolean){}
}// class PersonViewModel
