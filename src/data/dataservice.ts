//dataservice.ts
//
import {IDataService, IDocPersist, IBaseItem, IItemFactory, IPerson} from 'infodata';
import {InfoElement} from './infoelement';
import {ItemFactory} from './itemfactory';
import {PouchDatabase} from './pouchdatabase';
//
import {ERR_DATASERVICE_INVALID, ERR_ARGUMENTS_INVALID,
PROP_ID, PROP_REV, PROP_DELETED, PROP_TYPE, PROP_ATTACHMENTS,
LASTCHAR_STRING} from './infoconstants';
//
export class DataService extends InfoElement implements IDataService {
	//
	private _service: IDocPersist;
	private _factory: IItemFactory;
	//
	constructor(serv?: IDocPersist, fact?: IItemFactory) {
		super();
		if ((serv !== undefined) && (serv !== null)) {
			this._service = serv;
		} else {
			this._service = new PouchDatabase();
		}
		if ((fact !== undefined) && (fact !== null)) {
			this._factory = fact;
		} else {
			this._factory = new ItemFactory();
		}
	}// constructor
	//
	public get service(): IDocPersist {
		return this._service;
	}
	public get itemFactory(): IItemFactory {
		return this._factory;
	}
	public get name(): string {
		return this.service.name;
	}
	public set name(s: string) {
		this.service.name = s;
	}
	public get is_valid(): boolean {
		return (this.service !== null) && (this.itemFactory !== null);
	}
	//
	public replicate_all(from: string, to: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		if ((from === undefined) || (from === null) || (to === undefined) || (to === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let source = from.trim();
		let dest = to.trim();
		if ((source.length < 1) || (dest.length < 1) || (source == dest)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		return this.service.replicate(source, dest);
	}// replicate_all
	//
	public replicate_person(pPers: IPerson, from: string, to: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		if ((pPers !== undefined) || (pPers === null) || (from === undefined) || (from === null) || (to === undefined) || (to === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let ids = pPers.get_all_ids();
		let source = from.trim();
		let dest = to.trim();
		if ((source.length < 1) || (dest.length < 1) || (source == dest)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		return this.service.replicate(source, dest, ids);
	}//replicate_person
	//
	public replicate_to(to: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		return this.service.replicate(this.service.name, to);
	}
	public replicate_person_to(pPers: IPerson, to: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		if ((pPers === undefined) || (pPers === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		return this.replicate_person(pPers, this.service.name, to);
	}
	public replicate_from(from: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		return this.service.replicate(from, this.service.name);
	}
	public replicate_person_from(pPers: IPerson, from: string): Promise<any> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		if ((pPers === undefined) || (pPers === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		return this.replicate_person(pPers, from, this.service.name);
	}
	//
	public remove_query_item(p: IBaseItem, sel?: any): Promise<boolean> {
		if (!this.is_valid) {
			throw new Error(ERR_DATASERVICE_INVALID);
		}
		if ((p === undefined) || (p === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let id: string = p.id;
		let rev: string = p.rev;
		if ((id == null) || (rev == null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let doc: any = {};
		p.to_map(doc);
		return this.service.remove_doc(doc).then((r) => {
			if ((sel !== undefined) && (sel !== null)) {
				return this.service.remove_query_docs(sel);
			} else {
				return Promise.resolve(true);
			}
		});
	}//remove_query_item
	public query_items(xtype: string, selector?: any, skip?: number, limit?: number, fields?: string[]): Promise<IBaseItem[]> {
		let oRet: IBaseItem[] = [];
		if ((xtype === undefined) || (xtype === null)) {
			return Promise.resolve(oRet);
		}
		if (xtype.trim().length < 1) {
			return Promise.resolve(oRet);
		}
		let xsel: any = { type: xtype };
		if ((selector !== undefined) && (selector !== null)) {
			for (let key in selector) {
				let skey = key.toString();
				if ((skey != PROP_TYPE) && (skey != PROP_ID) &&
					(skey != PROP_REV) && (skey != PROP_DELETED)
					&& (skey != PROP_ATTACHMENTS)) {
					let val = selector[key];
					if ((val !== undefined) && (val !== null)) {
						if (val.toString().length > 0) {
							xsel[key] = val;
						}
					}
				}// skey
			}// key
		}
		return this.service.query_docs(xsel, skip, limit, fields).then((dd) => {
			if ((dd !== undefined) && (dd !== null)) {
				for (let doc of dd) {
					let item = this.itemFactory.create_item(doc);
					if (item !== null) {
						oRet.push(item);
					}
				}// doc
			}// dd
			this.sort_array(oRet);
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}// query_items
	public query_by_template(temp: IBaseItem, skip?: number, limit?: number, fields?: string[]): Promise<IBaseItem[]> {
		let oRet: IBaseItem[] = [];
		if ((temp === undefined) || (temp === null)) {
			return Promise.resolve(oRet);
		}
		let xtype: string = temp.type();
		if (xtype.trim().length < 1) {
			return Promise.resolve(oRet);
		}
		let xsel: any = {};
		temp.to_map(xsel);
		return this.query_items(xtype, xsel, skip, limit, fields);
	}// query_by_template
	//
	public query_ids(selector?: any, skip?: number, limit?: number): Promise<string[]> {
		let oRet: string[] = [];
		if ((selector === undefined) || (selector === null)) {
			return Promise.resolve(oRet);
		}
		return this.service.query_docs(selector, skip, limit, ["_id"]).then((dd) => {
			if ((dd !== undefined) && (dd !== null)) {
				for (let doc of dd) {
					if ((doc._id !== undefined) && (doc._id !== null)) {
						oRet.push(doc._id);
					}
				}// doc
			}// dd
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}// query_items
	//
	public find_attachment(docid: string, attachmentId: string): Promise<Blob> {
		let oRet: Blob = null;
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		if ((docid === undefined) || (docid === null) || (attachmentId === undefined) ||
			(attachmentId === null)) {
			return Promise.resolve(oRet);
		}
		if ((docid.trim().length < 1) || (attachmentId.trim().length < 1)) {
			return Promise.resolve(oRet);
		}
		return this.service.find_attachment(docid, attachmentId).then((b) => {
			if ((b !== undefined) && (b !== null)) {
				oRet = b;
			}
			return oRet;
		}).catch((ee) => {
			return oRet;
		});
	}// find_attachment
	//
	public maintains_attachment(docid: string, attachmentId: string,
		attachmentData: Blob, attachmentType: string): Promise<boolean> {
		let oRet: boolean = null;
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		return this.service.maintains_attachment(docid, attachmentId, attachmentData, attachmentType).then((r: PouchUpdateResponse) => {
			oRet = (r !== undefined) && (r !== null) && (r.ok == true);
			return oRet;
		}).catch((ee) => {
			return oRet;
		});
	}// maintains_attachment
	public remove_attachment(docid: string, attachmentId: string): Promise<boolean> {
		let oRet: boolean = null;
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		return this.service.remove_attachment(docid, attachmentId).then((r: PouchUpdateResponse) => {
			oRet = (r !== undefined) && (r !== null) && (r.ok == true);
			return oRet;
		}).catch((ee) => {
			return oRet;
		});
	}//remove_attachment
	//
	public remove_all_items(startkey: string, endkey: string): Promise<boolean> {
		let oRet: boolean = false;
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		if ((startkey === undefined) || (startkey === null) || (endkey === undefined) || (endkey === null)) {
			return Promise.resolve(oRet);
		}
		return this.service.remove_all_items(startkey, endkey).then((b) => {
			if ((b !== undefined) && (b !== null)) {
				oRet = true;
			}
			return oRet;
		}).catch((err) => {
			return oRet;
		});
	}//remove_all_items
	public get_items_array(ids: string[]): Promise<IBaseItem[]> {
		let oRet: IBaseItem[] = [];
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		if ((ids === undefined) || (ids === null)) {
			return Promise.resolve(oRet);
		}
		if (ids.length < 1) {
			return Promise.resolve(oRet);
		}
		let fact = this.itemFactory;
		return this.service.docs_array(ids).then((docs) => {
			if ((docs !== undefined) && (docs !== null)) {
				let n = docs.length;
				for (let i = 0; i < n; ++i) {
					let p = fact.create_item(docs[i]);
					if ((p !== undefined) && (p !== null)) {
						oRet.push(p);
					}
				}// i
			}// docs
			this.sort_array(oRet);
			return oRet;
		}).catch((err) => {
			return oRet;
		});
	}// get_items_array
	public get_ids(startkey: string, endkey?: string, skip?: number, limit?: number): Promise<string[]> {
		let oRet: string[] = [];
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		if ((startkey === undefined) || (startkey === null)) {
			return Promise.resolve(oRet);
		}
		let start = startkey.trim();
		if (start.length < 1) {
			return Promise.resolve(oRet);
		}
		let end: string = ((endkey !== undefined) && (endkey !== null) && (endkey.length > 0)) ? endkey : (start + LASTCHAR_STRING);
		return this.service.docs_ids_range(start, end, skip, limit).then((dd) => {
			if ((dd !== undefined) && (dd !== null)) {
				oRet = dd;
			}
			return oRet;
		}).catch((err) => {
			return oRet;
		});
	}// get_ids
	public get_items_range(startkey: string, endkey: string, skip?: number, limit?: number): Promise<IBaseItem[]> {
		let oRet: IBaseItem[] = [];
		if (!this.is_valid) {
			return Promise.resolve(oRet);
		}
		if ((startkey === undefined) || (startkey === null) || (endkey === undefined) || (endkey === null)) {
			return Promise.resolve(oRet);
		}
		let fact = this.itemFactory;
		return this.service.docs_read_range(startkey, endkey, skip, limit).then((docs) => {
			if ((docs !== undefined) && (docs !== null)) {
				let n = docs.length;
				for (let i = 0; i < n; ++i) {
					let p = fact.create_item(docs[i]);
					if ((p !== undefined) && (p !== null)) {
						oRet.push(p);
					}
				}// i
			}// docs
			this.sort_array(oRet);
			return oRet;
		}).catch((err) => {
			return oRet;
		});
	}// get_items_range
	public maintains_items(pp: IBaseItem[]): Promise<boolean[]> {
		let oRet: boolean[] = [];
		if ((pp === undefined) || (pp === null) || (pp.length < 1) || (!this.is_valid)) {
			return Promise.resolve(oRet);
		}
		let oAr: Promise<boolean>[] = [];
		for (let p of pp) {
			if ((p !== undefined) && (p !== null)) {
				if (p.deleted) {
					oAr.push(this.remove_item(p));
				} else {
					oAr.push(this.save_item(p));
				}
			} // p
		}// p
		return Promise.all(oAr);
	}//maintains_items
	private perform_save(p: IBaseItem): Promise<boolean> {
		let doc: any = {};
		p.to_map(doc);
		return this.service.update_doc(doc).then((r: PouchUpdateResponse) => {
			let bRet = r.ok;
			if (bRet) {
				p.rev = r.rev;
			}
			return bRet;
		}).catch((e) => {
			return false;
		});
	}//perform_save
	public remove_item(p: IBaseItem): Promise<boolean> {
		let doc: any = {};
		p.to_map(doc);
		return this.service.remove_doc(doc).then((r: PouchUpdateResponse) => {
			let bRet = r.ok;
			return bRet;
		}).catch((e) => {
			return false;
		});
	}// remove_item
	//
	public save_item(p: IBaseItem): Promise<boolean> {
		let oRet: boolean = false;
		if ((p === undefined) || (p === null) || (!this.is_valid)) {
			return Promise.resolve(oRet);
		}
		if (!p.is_storeable()) {
			return Promise.resolve(oRet);
		}
		p.check_id();
		return this.perform_save(p);
	}// save_item
	public find_item_by_id(id: string, bAttach?: boolean, bMeta?: boolean): Promise<IBaseItem> {
		let oRet: IBaseItem = null;
		if ((id === undefined) || (id === null) || (!this.is_valid)) {
			return Promise.resolve(oRet);
		}
		return this.service.read_doc(id, bAttach, bMeta).then((doc) => {
			if ((doc !== undefined) && (doc !== null)) {
				oRet = this.itemFactory.create_item(doc);
			}
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//find_item_by_id
	public is_online(): Promise<boolean> {
		if (!this.is_valid) {
			Promise.reject(new Error(ERR_DATASERVICE_INVALID));
		}
		return this.service.isOnline().then((b) => {
			let bRet: boolean = (b !== undefined) && (b !== null) && (b == true);
			return bRet;
		});
	}// is_online
}// class DataService