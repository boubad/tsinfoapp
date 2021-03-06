//matieresmodel.ts
//
import {UserInfo} from './userinfo';
import {SigleNamedViewModel} from './siglenamedmodel';
import {IMatiere, IUnite} from 'infodata';
//
export class MatieresModel extends SigleNamedViewModel<IMatiere> {
	//
    constructor(info:UserInfo) {
        super(info);
        this.title = 'Matières';
    }// constructor
	protected create_item(): IMatiere {
		return this.itemFactory.create_matiere({
			departementid:this.departementid,
			uniteid: this.uniteid,
			genre: 'PRATIQUE',
			coefficient: 1.0
		});
	}
	protected get_remove_selector(): any {
		return { matiereid: this.currentItem.id };
	}
	protected prepare_model(): any {
		return {type: this.modelItem.type(),
			uniteid:this.uniteid};
	}// prepare_model
	protected post_update_unite(): Promise<boolean> {
		return super.post_update_unite().then((r)=>{
			this.modelItem.uniteid = this.uniteid;
		this.currentItem = this.create_item();
		if (!this.in_activate){
			return this.refreshAll();
		} else {
			return Promise.resolve(true);
		}
		});
	}
	protected is_refresh(): boolean {
		return (this.uniteid !== null);
	}
	public get genre(): string {
		return (this.currentItem !== null) ? this.currentItem.genre : null;
	}
	public set genre(s: string) {
		let x = this.currentItem;
		if (x !== null) {
			x.genre = s;
		}
	}
	public get matmodule(): string {
		return (this.currentItem !== null) ? this.currentItem.matmodule : null;
	}
	public set matmodule(s: string) {
		let x = this.currentItem;
		if (x !== null) {
			x.matmodule = s;
		}
	}
	public get coefficient(): string {
		return (this.currentItem !== null) ? this.number_to_string(this.currentItem.coefficient) : null;
	}
	public set coefficient(s: string) {
		let x = this.currentItem;
		if (x !== null) {
			let d =this.string_to_number(s);
			x.coefficient = ((d !== null) && (d > 0)) ? d : null;
		}
	}
	public get ecs(): string {
		return (this.currentItem !== null) ? this.number_to_string(this.currentItem.ecs) : null;
	}
	public set ecs(s: string) {
		let x = this.currentItem;
		if (x !== null) {
			let d =this.string_to_number(s);
			x.ecs = ((d !== null) && (d > 0)) ? d : null;
		}
	}
	private get_unite_matieres(): Promise<IMatiere[]> {
		let oRet:IMatiere[] = [];
		if (this.uniteid == null){
			return Promise.resolve(oRet);
		}
		let m = this.itemFactory.create_matiere();
		let sel:any = {uniteid:this.uniteid};
		return this.dataService.query_items(m.type(),sel).then((gg:IMatiere[])=>{
			oRet = ((gg !== undefined) && (gg !== null)) ? gg : [];
			return oRet;
		}).catch((e)=>{
			return oRet;
		});
	}//
	public save(): Promise<any> {
		let item = this.currentItem;
		if (item === null) {
			return Promise.resolve(false);
		}
		if (!item.is_storeable()) {
			return Promise.resolve(false);
		}
		this.is_busy = true;
		this.clear_error();
		item.check_id();
		let pUnite: IUnite = null;
		return this.dataService.save_item(item).then((r) => {
			return this.dataService.find_item_by_id(item.uniteid);
		}).then((p: IUnite) => {
			if ((p !== undefined) && (p !== null)) {
				pUnite = p;
				return this.get_unite_matieres();
			} else {
				return Promise.resolve([]);
			}
		}).then((mm: IMatiere[]) => {
			let sum: number = 0;
			if ((mm !== undefined) && (mm !== null)) {
				for (let m of mm) {
					sum += m.coefficient;
				}
			}// mm
			if (pUnite !== null) {
				pUnite.coefficient = (sum > 0) ? sum : 1.0;
				return super.save();
			} else {
				return Promise.resolve(true);
			}
		}).then((b)=>{
			this.is_busy = false;
			return true;
		}).catch((err) => {
			this.set_error(err);
			this.is_busy = false;
			return false;
		});
	}// save
}// class Matieres
