//basedetailmodel.ts
//
import {BaseView} from './baseview';
import {UserInfo} from './userinfo';
import {IPersonItem} from 'infodata';
//
export class BaseDetailModel<T extends IPersonItem> extends BaseView {
    //
	private _item: T = null;
	public canEdit: boolean = false;
    //
    constructor(userinfo: UserInfo) {
        super(userinfo);
    }
	
	protected initialize_activate_params(params?: any): Promise<boolean> {
		let id = ((params !== undefined) && (params !== null) && (params.id !== undefined)) ? params.id : null;
		return this.initialize_item(id);
	}// initialize_activate_params
	protected perform_activate(): Promise<boolean> {
		return Promise.resolve(true);
	}
	protected initialize_item(evtid: string): Promise<boolean> {
		this.clear_error();
		this._item = null;
		return this.dataService.find_item_by_id(evtid).then((p: T) => {
			this.currentItem = p;
			return this.retrieve_one_avatar(this.currentItem);
		}).then((x) => {
			return true;
		});
	}// initialize_item
	public get canSave(): boolean {
		return (this.currentItem !== null) && this.currentItem.is_storeable() && (!this.is_etud);
	}
	public get cannotSave(): boolean {
		return (!this.canSave);
	}
	public get canDocuments(): boolean {
		if (this.is_etud) {
			return (this.currentItem !== null) && (this.currentItem.attachments.length > 0);
		} else {
			return (this.currentItem !== null);
		}
	}
	public save(): Promise<any> {
		let p = this.currentItem;
		if (p === null) {
			return Promise.resolve(false);
		}
		if (!p.is_storeable()) {
			return Promise.resolve(false);
		}
		this.clear_error();
		return this.dataService.save_item(p).then((b) => {
			if ((b !== undefined) && (b !== null) && (b == true)) {
				this.info_message = "Item modofié!";
			} else {
				this.error_message = "Erreur enregistrement...";
			}
		}).catch((e) => {
			this.set_error(e);
		})
	}// save
	public deactivate(): any {
		if ((this.currentItem !== null) && (this.currentItem.url !== null)) {
			this.revokeUrl(this.currentItem.url);
			this.currentItem.url = null;
		}
	}
	protected set_currentitem(s: T): void {
		this._item = (s !== undefined) ? s : null;
	}
	public get currentItem(): T {
		return this._item;
	}
	public set currentItem(s: T) {
		this.set_currentitem(s);
	}
	public get current_id(): string {
		return (this.currentItem !== null) ? this.currentItem.id : null;
	}
	public get eventUrl(): string {
		return (this.currentItem !== null) ? this.currentItem.url : null;
	}
	public get itemUrl(): string {
		return this.eventUrl;
	}
	public get hasEventUrl(): boolean {
		return (this.currentItem !== null) && (this.currentItem.url !== null);
	}// hasUrl
	public get hasItemUrl(): boolean {
		return (this.eventUrl !== null);
	}
	public get description(): string {
		return (this.currentItem !== null) ? this.currentItem.description : null;
	}
	public set description(s: string) {
		if (this.currentItem !== null) {
			this.currentItem.description = s;
		}
	}
	public get status(): string {
		return (this.currentItem !== null) ? this.currentItem.status : null;
	}
	public set status(s: string) {
		if (this.currentItem !== null) {
			this.currentItem.status = s;
		}
	}
}
