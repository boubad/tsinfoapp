//pouchdatabase.ts
//
declare var PouchDB: IPouchDB;
//
import {IDocPersist} from 'infodata';
import {DATABASE_NAME, PROP_ID, PROP_REV, PROP_ATTACHMENTS,
CREATED_STRING, EXISTS_STRING,
ERR_DATABASE_BUSY, ERR_NULL_DATABASE_NAME, ERR_NULL_DATABASE_HANDLE,
ERR_DOCUMENT_INVALID, ERR_DOCUMENT_ID, ERR_ARGUMENTS_INVALID} from './infoconstants';
//
export class PouchDatabase implements IDocPersist {
	//
	private _db: IPouchDB = null;
	private _url: string = DATABASE_NAME;
	private _busy: boolean = false;
	//
	constructor() {
	}
	//
	private get busy(): boolean {
		return this._busy;
	}
	private set busy(s: boolean) {
		this._busy = ((s !== undefined) && (s !== null)) ? s : false;
	}
	//
	public get name(): string {
		return this._url;
	}
	public set name(s: string) {
		let ss = ((s !== undefined) && (s !== null)) ? s.trim() : DATABASE_NAME;
		let url = ((ss !== null) && (ss.length > 0)) ? ss : DATABASE_NAME;
		if (this._db === null) {
			this._url = url;
		} else if (!this.busy) {
			this._url = url;
			this._db = null;
		}
	}
	//
	public get db(): Promise<IPouchDB> {
		if ((this._db !== undefined) && (this._db !== null)) {
			return Promise.resolve(this._db);
		}
		if (this.name === null) {
			throw new Error(ERR_NULL_DATABASE_NAME);
		}
		if (this.busy) {
			throw new Error(ERR_DATABASE_BUSY);
		}
		this.busy = true;
		return new Promise((resolve, reject) => {
			try {
				let xx = new PouchDB(this.name, { auto_compaction: true }, (err: PouchError, xdb: any) => {
					this._busy = false;
					if ((err !== undefined) && (err !== null)) {
						reject(new Error(err.reason));
					} else {
						this._db = ((xdb !== undefined) && (xdb !== null)) ? xdb : null;
						if (this._db !== null) {
							resolve(this._db);
						} else {
							reject(new Error(ERR_NULL_DATABASE_HANDLE));
						}
					}
				});
			} catch (e) {
				this.busy = false;
				let ss = ((e !== undefined) && (e !== null)) ? JSON.stringify(e) : 'Error: ';
				console.log(ss);
				reject(new Error(ss));
			}
		});
	}// db
	//
	public exists_doc(docid: string): Promise<string> {
		let sRet: string = null;
		if ((docid === undefined) || (docid === null)) {
			return Promise.resolve(sRet);
		}
		return this.db.then((xdb) => {
			return xdb.get(docid);
		}).then((doc) => {
			if ((doc !== undefined) && (doc !== null) &&
				(doc._id !== undefined) && (doc._id !== null) &&
				(doc._rev !== undefined) && (doc._rev !== null)) {
				sRet = doc._rev;
			}
			return sRet;
		}).catch((e) => {
			return sRet;
		})
	}// exists_doc
	//
	public read_doc(docid: string, bAttachments?: boolean, bMeta?: Boolean): Promise<IPouchDocument> {
		let oRet: IPouchDocument = null;
		if ((docid === undefined) || (docid === null)) {
			return Promise.resolve(oRet);
		}
		return this.db.then((xdb) => {
			let options: PouchGetOptions = {};
			if ((bAttachments !== undefined) && (bAttachments !== null) && (bAttachments == true)) {
				options.attachments = true;
			}
			if ((bMeta !== undefined) && (bMeta !== null) && (bMeta == true)) {
				options.meta = true;
			}
			return xdb.get(docid, options);
		}).then((doc) => {
			if ((doc !== undefined) && (doc !== null) &&
				(doc._id !== undefined) && (doc._id !== null) &&
				(doc._rev !== undefined) && (doc._rev !== null)) {
				oRet = doc;
			}
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}// exists_doc
	public insert_doc(doc: IPouchDocument): Promise<PouchUpdateResponse> {
		if ((doc === undefined) || (doc === null)) {
			throw new Error(ERR_DOCUMENT_INVALID);
		}
		return this.db.then((xdb) => {
			return xdb.put(doc);
		}).catch((e) => {
			return { ok: false, id: null, rev: null };
		});
	}// insert_doc
	public update_doc(doc: IPouchDocument): Promise<PouchUpdateResponse> {
		if ((doc === undefined) || (doc === null)) {
			throw new Error(ERR_DOCUMENT_INVALID);
		}
		let bInsert: boolean = false;
		let docid: string = null;
		if (!doc.hasOwnProperty(PROP_ID)) {
			bInsert = true;
		} else {
			docid = doc[PROP_ID];
			if (docid === null) {
				bInsert = true;
			} else if (docid.trim().length < 1) {
				bInsert = true;
			}
		}
		if (bInsert) {
			let temp: any = {};
			for (let key in doc) {
				if ((key != PROP_ID) && (key != PROP_REV)) {
					temp[key] = doc[key];
				}
			}
			return this.insert_doc(temp);
		}// null id
		let zdb: IPouchDB = null;
		let rid: string = null;
		let rev: string = null;
		return this.db.then((xdb) => {
			zdb = xdb;
			return xdb.get(docid, { attachments: true });
		}).then((p) => {
			rid = p[PROP_ID];
			rev = p[PROP_REV];
			doc[PROP_REV] = rev;
			if (p.hasOwnProperty(PROP_ATTACHMENTS)) {
				doc[PROP_ATTACHMENTS] = p[PROP_ATTACHMENTS];
			}
			return zdb.put(doc);
		}, (err) => {
			if (err.status != 404) {
				throw new Error(err.reason);
			}
			return zdb.put(doc);
		}).then((r) => {
			return r;
		}, (ex) => {
			if (ex.status != 409) {
				throw new Error(ex.reason);
			}
			return { ok: false, id: rid, rev: rev };
		});
	}// update_doc
	public remove_doc(doc: IPouchDocument): Promise<PouchUpdateResponse> {
		if ((doc === undefined) || (doc === null)) {
			throw new Error(ERR_DOCUMENT_INVALID);
		}
		if (!doc.hasOwnProperty(PROP_ID)) {
			throw new Error(ERR_DOCUMENT_ID);
		}
		let docid: string = doc[PROP_ID];
		if (docid == null) {
			throw new Error(ERR_DOCUMENT_ID);
		}
		if (docid.trim().length < 1) {
			throw new Error(ERR_DOCUMENT_ID);
		}
		let zdb: IPouchDB = null;
		return this.db.then((xdb) => {
			zdb = xdb;
			return xdb.get(docid);
		}).then((p) => {
			return zdb.remove(p);
		}, (err) => {
			if (err.status != 404) {
				throw new Error(err.reason);
			}
			return { ok: true, id: docid, rev: null };
		});
	}// remove_doc
	//
	public bulk_maintains(docs: IPouchDocument[]): Promise<PouchUpdateOptions[]> {
		let oRet: IPouchDocument[] = [];
		let dd: IPouchDocument[] = [];
		if ((docs !== undefined) && (docs !== null) && (docs.length > 0)) {
			for (let d of docs) {
				if ((d !== undefined) && (d !== null)) {
					dd.push(d);
				}
			}// d
		}
		if (dd.length < 1) {
			return Promise.resolve(oRet);
		}
		return this.db.then((xdb) => {
			return xdb.bulkDocs(docs);
		});
	}//bulk_maintains
	//
	public docs_ids_range(startKey: string, endKey: string, skip?: number, limit?: number): Promise<string[]> {
		let oRet: string[] = [];
		if ((startKey === undefined) || (startKey === null) ||
			(endKey === undefined) || (endKey === null)) {
			return Promise.resolve(oRet);
		}
		let options: PouchGetOptions = {
			startkey: startKey, endkey: endKey
		};
		if ((skip !== undefined) && (skip !== null) && (skip > 0)) {
			options.skip = skip;
		}
		if ((limit !== undefined) && (limit !== null) && (limit > 0)) {
			options.limit = limit;
		}
		return this.db.then((xdb) => {
			return xdb.allDocs(options);
		}).then((rr) => {
			if ((rr !== undefined) && (rr !== null) && (rr.rows !== undefined) &&
				(rr.rows !== null)) {
				for (let r of rr.rows) {
					if ((r.id !== undefined) && (r.id !== null)) {
						if ((r.deleted !== undefined) && (r.deleted !== null)) {
							continue;
						}
						oRet.push(r.id);
					}
				}// r
			}
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//get_ids
	public docs_read_range(startKey: string, endKey: string, skip?: number, limit?: number): Promise<IPouchDocument[]> {
		let oRet: IPouchDocument[] = [];
		if ((startKey === undefined) || (startKey === null) ||
			(endKey === undefined) || (endKey === null)) {
			return Promise.resolve(oRet);
		}
		let options: PouchGetOptions = {
			startkey: startKey, endkey: endKey, include_docs: true
		};
		if ((skip !== undefined) && (skip !== null) && (skip > 0)) {
			options.skip = skip;
		}
		if ((limit !== undefined) && (limit !== null) && (limit > 0)) {
			options.limit = limit;
		}
		return this.db.then((xdb) => {
			return xdb.allDocs(options);
		}).then((rr) => {
			if ((rr !== undefined) && (rr !== null) && (rr.rows !== undefined) &&
				(rr.rows !== null)) {
				for (let r of rr.rows) {
					if ((r.id !== undefined) && (r.doc !== undefined) && (r.doc !== null)) {
						if ((r.deleted !== undefined) && (r.deleted !== null)) {
							continue;
						}
						let doc = r.doc;
						if ((doc !== undefined) && (doc !== null)) {
							oRet.push(doc);
						}
					}
				}// r
			}
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//docs_read_range
  
	public docs_array(ids: string[]): Promise<IPouchDocument[]> {
		let oRet: IPouchDocument[] = [];
		if ((ids === undefined) || (ids === null)) {
			return Promise.resolve(oRet);
		}
		let dd: string[] = [];
		for (let id of ids) {
			if ((id !== undefined) && (id !== null) && (id.trim().length > 0)) {
				dd.push(id);
			}
		}
		if (dd.length < 1) {
			return Promise.resolve(oRet);
		}
		let options: PouchAllDocsOptions = { keys: dd, include_docs: true };
		return this.db.then((xdb) => {
			return xdb.allDocs(options);
		}).then((rr) => {
			if ((rr !== undefined) && (rr !== null)) {
				let data = rr.rows;
				if ((data !== undefined) && (data !== null)) {
					for (let r of data) {
						let bOk = true;
						if ((r.value !== undefined) && (r.value !== null)) {
							let val = r.value;
							if ((val.deleted !== undefined) && (val.deleted !== null)) {
								bOk = false;
							}
							if ((val.error !== undefined) && (val.error !== null)) {
								bOk = false;
							}
						}
						if (bOk && ((r.doc === undefined) || (r.doc === null))) {
							bOk = false;
						}
						if (bOk) {
							oRet.push(r.doc);
						}
					}// r
				}// data
			}// rr
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}//docs_array
	public remove_all_items(startKey: string, endKey: string): Promise<PouchUpdateOptions[]> {
		if ((startKey === undefined) || (startKey === null) ||
			(endKey === undefined) || (endKey === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let rdb: IPouchDB = null;
		return this.db.then((xdb) => {
			rdb = xdb;
			let options: PouchGetOptions = {
				startkey: startKey, endkey: endKey, include_docs: true
			};
			return rdb.allDocs(options);
		}).then((dd) => {
			let docs: any[] = [];
			for (let x of dd.rows) {
				let d = x.doc;
				docs.push({ _id: d._id, _rev: d._rev, _deleted: true });
			}// x
			if (docs.length > 0) {
				return rdb.bulkDocs(docs);
			} else {
				return [];
			}
		});
	}//remove_all_items
	//
	public isOnline(): Promise<boolean> {
		return this.db.then((xdb) => {
			return ((xdb !== undefined) && (xdb !== null));
		}).catch((e) => {
			return false;
		})
	}// isOnline
	//
	public find_attachment(docid: string, attachmentId: string): Promise<Blob> {
		let oRet: Blob = null;
		if ((docid === undefined) || (docid === null) || (attachmentId === undefined) ||
			(attachmentId === null)) {
			return Promise.resolve(oRet);
		}
		if ((docid.trim().length < 1) || (attachmentId.trim().length < 1)) {
			return Promise.resolve(oRet);
		}
		return this.db.then((xdb: IPouchDB) => {
			return xdb.getAttachment(docid, attachmentId);
		}).catch((e) => {
			return null;
		});
	}// find_attachment
	public maintains_attachment(docid: string, attachmentId: string,
		attachmentData: Blob, attachmentType: string): Promise<PouchUpdateResponse> {
		if ((docid === undefined) || (docid === null) || (attachmentId === undefined) ||
			(attachmentId === null) || (attachmentData === undefined) ||
			(attachmentData === null) || (attachmentType === undefined) ||
			(attachmentType === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		if ((docid.trim().length < 1) || (attachmentId.trim().length < 1) ||
			(attachmentType.trim().length < 1) || (attachmentData.size < 1)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let xdb: IPouchDB = null;
		let rev: string = null;
		return this.db.then((d: IPouchDB) => {
			xdb = d;
			return xdb.get(docid);
		}).then((p) => {
			rev = p._rev;
			return xdb.putAttachment(p._id, attachmentId, p._rev, attachmentData, attachmentType);
		}).then((rx) => {
			return rx;
		}, (err: PouchError) => {
			if (err.status == 409) {
				return { ok: true, id: docid, rev: rev };
			} else {
				throw new Error(err.reason);
			}
		}).catch((e) => {
			return { ok: false, id: null, rev: null };
		});
	}// maintains_attachment
	public remove_attachment(docid: string, attachmentId: string): Promise<PouchUpdateResponse> {
		if ((docid === undefined) || (docid === null) || (attachmentId === undefined) ||
			(attachmentId === null)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		if ((docid.trim().length < 1) || (attachmentId.trim().length < 1)) {
			throw new Error(ERR_ARGUMENTS_INVALID);
		}
		let xdb: IPouchDB = null;
		return this.db.then((d: IPouchDB) => {
			xdb = d;
			return xdb.get(docid);
		}).then((p) => {
			return xdb.removeAttachment(p._id, attachmentId, p._rev);
		}).catch((e) => {
			return { ok: false, id: null, rev: null };
		});
	}// maintains_attachment
	//	
	public create_one_index(field: string): Promise<boolean> {
		let oRet: boolean = false;
		if ((field === undefined) || (field === null)) {
			return Promise.resolve(oRet);
		}
		if (field.trim().length < 1) {
			return Promise.resolve(oRet);
		}
		return this.db.then((xdb) => {
			return xdb.createIndex({ index: { fields: [field] } });
		}).then((r) => {
			let bRet: boolean = false;
			if ((r !== undefined) && (r !== null) && (r.result !== undefined)) {
				bRet = ((r.result == CREATED_STRING) || (r.result == EXISTS_STRING));
			}
			return bRet;
		}).catch((e) => {
			return false;
		});
	}// create_indexes
	public create_multi_index(fields: string[]): Promise<boolean> {
		if ((fields === undefined) || (fields === null)) {
			Promise.reject(new Error(ERR_ARGUMENTS_INVALID));
		}
		let ss: string[] = [];
		for (let s of fields) {
			if ((s !== undefined) && (s !== null) && (s.trim().length > 0)) {
				ss.push(s);
			}
		}
		if (ss.length < 1) {
			Promise.reject(new Error(ERR_ARGUMENTS_INVALID));
		}
		return this.db.then((xdb) => {
			if ((xdb === undefined) || (xdb === null)) {
				Promise.reject(new Error(ERR_NULL_DATABASE_HANDLE));
			}
			return xdb.createIndex({ index: { fields: ss } });
		}).then((r) => {
			let bRet: boolean = false;
			if ((r !== undefined) && (r !== null) && (r.result !== undefined)) {
				bRet = ((r.result == CREATED_STRING) || (r.result == EXISTS_STRING));
			}
			return bRet;
		}).catch((e) => {
			return false;
		});
	}// create_indexes
	public create_indexes(fields: string[]): Promise<boolean[]> {
		let oRet: boolean[] = [];
		if ((fields === undefined) || (fields === null)) {
			return Promise.resolve(oRet);
		}
		let ss: string[] = [];
		for (let s of fields) {
			if ((s !== undefined) && (s !== null) && (s.trim().length > 0)) {
				ss.push(s);
			}
		}
		if (ss.length < 1) {
			return Promise.resolve(oRet);
		}
		let oAr: Promise<boolean>[] = [];
		for (let x of ss) {
			oAr.push(this.create_one_index(x));
		}
		return Promise.all(oAr).then((r) => {
			return r;
		}).catch((e) => {
			return oRet;
		});
	}//create_all_indexes
	public query_docs(sel: any, skip?: number, limit?: number, fields?: string[]): Promise<IPouchDocument[]> {
		let oRet: IPouchDocument[] = [];
		if ((sel === undefined) || (sel === null)) {
			return Promise.resolve(oRet);
		}
		let options: PouchFindOptions = { selector: sel };
		if ((fields !== undefined) && (fields !== null) && (fields.length > 0)) {
			let ff: string[] = [];
			for (let f of fields) {
				if ((f !== undefined) && (f !== null) && (f.trim().length > 0)) {
					ff.push(f);
				}
			}
			if (ff.length > 0) {
				options.fields = ff;
			}
		}
		if ((skip !== undefined) && (skip !== null) && (skip > 0)) {
			options.skip = skip;
		}
		if ((limit !== undefined) && (limit !== null) && (limit > 0)) {
			options.limit = limit;
		}
		return this.db.then((xdb) => {
			return xdb.find(options);
		}).then((r) => {
			if ((r !== undefined) && (r !== null) && (r.docs !== undefined) && (r.docs !== null)) {
				oRet = r.docs;
			}
			return oRet;
		}).catch((e) => {
			return oRet;
		});
	}// find_docs
	public remove_query_docs(sel: any): Promise<boolean> {
		if ((sel === undefined) || (sel == null)) {
			return Promise.resolve(false);
		}
		let xdb: IPouchDB = null;
		return this.db.then((td) => {
			xdb = td;
			let fields: string[] = [PROP_ID, PROP_REV];
			let options: PouchFindOptions = { selector: sel, fields: fields };
			return xdb.find(options);
		}).then((r) => {
			let docs: any[] = [];
			if ((r !== undefined) && (r !== null) && (r.docs !== undefined) && (r.docs !== null)) {
				docs = r.docs;
			}
			for (let doc of docs) {
				doc._deleted = true;
			}
			if (docs.length > 0) {
				return xdb.bulkDocs(docs);
			} else {
				return Promise.resolve([]);
			}
		}).then((rr) => {
			return true;
		}).catch((e) => {
			return false;
		});
	}// remove_query_docs
	public replicate(from: string, to: string, ids?: string[]): Promise<boolean> {
		let oRet: boolean = false;
		let options: any = {};
		if ((ids !== undefined) && (ids !== null) && (ids.length > 0)) {
			let ff: string[] = [];
			for (let f of ids) {
				if ((f !== undefined) && (f !== null) && (f.trim().length > 0)) {
					ff.push(f);
				}
			}
			if (ff.length > 0) {
				options.doc_ids = ff;
			}
		}
		return PouchDB.replicate(from, to, options).then((b) => {
			oRet = ((b !== undefined) && (b !== null));
			return oRet;
		}).catch((e) => {
			return false;
		});
	}// replicate_all
}// class PouchDatabase
