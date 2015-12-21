//unitesmodel.ts
//
import {UserInfo} from './userinfo';
import {DepSigleNameViewModel} from './depsiglenamemodel';
import {IUnite, IMatiere} from 'infodata';
//
export class UnitesModel extends DepSigleNameViewModel<IUnite> {
	//
	constructor(info: UserInfo) {
		super(info);
		this.title = 'Unités';
	}// constructor
	protected get_remove_selector(): any {
		return { uniteid: this.currentItem.id };
	}
	public get order(): string {
		return (this.currentItem !== null) ? this.number_to_string(this.currentItem.order) : "";
	}
	public set order(s: string) {
		let x = this.currentItem;
		if (x !== null) {
			let d = this.string_to_number(s);
			x.order = ((d !== null) && (d > 0)) ? d : null;
		}
	}
	public get coefficient(): string {
		return (this.currentItem !== null) ? this.number_to_string(this.currentItem.coefficient) : "";
	}
	public set coefficient(s: string) { }
	protected create_item(): IUnite {
		return this.itemFactory.create_unite({
			departementid: this.departementid
		});
	}
	private get_unite_matieres(): Promise<IMatiere[]> {
		return this.dataService.get_unite_matieres(this.unite);
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
		let model = this.itemFactory.create_matiere({ uniteid: item.id });
		return this.get_unite_matieres().then((mm: IMatiere[]) => {
			let sum: number = 0;
			if ((mm !== undefined) && (mm !== null)) {
				for (let m of mm) {
					sum += m.coefficient;
				}
			}// mm
			item.coefficient = (sum > 0) ? sum : 1;
			return super.save();
		}).then((r) => {
			this.is_busy = false;
			return true;
		}).catch((err) => {
			this.set_error(err);
			this.is_busy = false;
			return false;
		});
	}// save
}// class UnitesModel
