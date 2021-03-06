// baseitem.ts
import {ElementDesc} from './elementdesc';
import {AttachedDoc} from './attacheddoc';
import {IAttachedDoc, IBaseItem,IPerson} from 'infodata';
import {LASTCHAR_STRING} from './infoconstants';
//
export class BaseItem extends ElementDesc implements IBaseItem {
	//
	private _rev: string = null;
	private _deleted: boolean = false;
	private _attachments: IAttachedDoc[] = [];
	//
	constructor(oMap?: any) {
		super(oMap);
		if ((oMap !== undefined) && (oMap !== null)) {
			if (oMap._rev !== undefined) {
				this.rev = oMap._rev;
			}
			if (oMap._deleted !== undefined) {
				this._deleted = oMap._deleted;
			}
			if (oMap.docs !== undefined) {
				this._attachments = this.read_attached_docs(oMap.docs);
			}
			if ((oMap._attachments !== undefined) && (oMap._attachements !== null)) {
				this.format_attached_docs(oMap._attachments);
			}
		}// oMap
	}// constructor	
	//
	public store_prefix(): string {
		return null;
	}
	public type(): string {
		return null;
	}
	public is_storeable(): boolean {
		return (this.type() !== null) && (this.store_prefix() !== null);
	}
	public start_key(): string {
		return this.store_prefix();
	}
	public end_key(): string {
		let s = this.start_key();
		return (s !== null) ? s + LASTCHAR_STRING : LASTCHAR_STRING;
	}
	public create_id(): string {
		return null;
	}
	public check_id(): void {
		if (this.id == null) {
			this.id = this.create_id();
		}
	}
	public get rev(): string {
		return this._rev;
	}
	public set rev(s: string) {
		this._rev = this.check_string(s);
	}
	public get has_rev(): boolean {
		return (this.rev !== null);
	}
	public get deleted(): boolean {
		return this._deleted;
	}
	public set deleted(s:boolean){
		this._deleted = ((s !== undefined) && (s !== null)) ? s : false;
	}
	
	public get attachments(): IAttachedDoc[] {
		return this._attachments;
	}
	//
	public to_map(oMap: any): void {
		super.to_map(oMap);
		oMap.type = this.type();
		if (this.rev !== null) {
			oMap._rev = this._rev;
		}
		if (this.attachments.length > 0) {
			let xx: any[] = [];
			for (let x of this.attachments) {
				xx.push(x.to_map());
			}
			oMap.docs = xx;
		}
		if (this.status !== null) {
			oMap.status = this.status;
		}
	}// to_map
	//
	private read_attached_docs(dd: any[]): IAttachedDoc[] {
		let oRet: IAttachedDoc[] = [];
		if ((dd !== undefined) && (dd !== null) && (dd.length > 0)) {
			for (let d of dd) {
				if ((d !== undefined) && (d !== null)) {
					oRet.push(new AttachedDoc(d));
				}
			}// d
		}// dd
		return oRet;
	}//read_attached_docs
	private format_attached_docs(d: any): void {
		if ((this._attachments === undefined) || (this._attachments === null)) {
			this._attachments = [];
		}
		if ((d !== undefined) && (d !== null)) {
			let sav: string = this.avatarid;
			for (let x in d) {
				let bOk: boolean = true;
				if ((sav !== undefined) && (sav !== null)) {
					if (sav == x) {
						bOk = false;
					}
				}
				if (bOk) {
					let val: IPouchAttachment = d[x];
					if ((val !== undefined) && (val !== null)) {
						let stype: string = val.content_type;
						if ((stype !== undefined) && (stype !== null)) {
							let pDoc: IAttachedDoc = null;
							for (let px of this._attachments) {
								if ((x == px.id) && (stype == px.content_type)) {
									pDoc = px;
									break;
								}
							}// px
							if (pDoc !== null) {
								pDoc.stub = true;
								if (val.digest !== undefined) {
									pDoc.digest = val.digest;
								}
								if (val.length !== undefined) {
									pDoc.length = val.length;
								}
								if (val.revpos !== undefined) {
									pDoc.revpos = val.revpos;
								}
							} else {
								pDoc = new AttachedDoc({ _id: x, content_type: stype, title: x });
								pDoc.stub = true;
								if (val.digest !== undefined) {
									pDoc.digest = val.digest;
								}
								if (val.length !== undefined) {
									pDoc.length = val.length;
								}
								if (val.revpos !== undefined) {
									pDoc.revpos = val.revpos;
								}
								this._attachments.push(pDoc);
							}
						}// stype
					}// val
				}// bOk
			}// d
		}// d
	}// format_attached????docs
	//
}// class BaseItem
