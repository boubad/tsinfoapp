//elementdesc.ts
import {InfoElement} from './infoelement';
import {IElementDesc} from 'infodata';
//
export class ElementDesc extends InfoElement implements IElementDesc {
	private _selected: boolean = false;
	private _avatarid: string = null;
	private _url: string = null;
	private _display: string;
	private _status: string;
	private _description: string = null;
	//
	constructor(oMap?: any) {
		super(oMap);
		if ((oMap !== undefined) && (oMap !== null)) {
			if (oMap.avatarid !== undefined) {
				this.avatarid = oMap.avatarid;
			}
			if (oMap.description !== undefined) {
				this.description = oMap.description;
			}
			if (oMap.status !== undefined) {
				this.status = oMap.status;
			}
		}
	}
	//
	public avardocid():string {
		return this.id;
	}
	public to_map(oMap: any): void {
		if (this.id !== null) {
			oMap._id = this.id;
		}
		if (this.status !== null) {
			oMap.status = this.status;
		}
		if (this.description !== null) {
			oMap.description = this.description;
		}
		if (this.avatarid !== null){
			oMap.avatarid = this.avatarid;
		}
	}// to_map
	//
	public get status(): string {
		return (this._status !== undefined) ? this._status : null;
	}
	public set status(s: string) {
		this._status = this.check_upper_string(s);
	}
	public get selected(): boolean {
		return this._selected;
	}
	public set selected(s: boolean) {
		this._selected = ((s !== undefined) && (s !== null)) ? s : false;
	}
	public get avatarid(): string {
		return this._avatarid;
	}
	public set avatarid(s: string) {
		this._avatarid = this.check_string(s);
	}
	public get url(): string {
		return this._url;
	}
	public set url(s: string) {
		this._url = this.check_string(s);
	}
	public get has_url(): boolean {
		return (this.url !== null);
	}
	public get display(): string {
		return (this._display !== undefined) ? this._display : null;
	}
	public set display(s: string) {
		this._display = this.check_string(s);
	}
	public get description(): string {
		return this._description;
	}
	public set description(s: string) {
		this._description = this.check_string(s);
	}
	public toString(): string {
		let s = this.display;
		return (s !== null) ? s : '';
	}
}// class ElementDesc