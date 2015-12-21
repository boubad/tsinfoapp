//departementsmodel.ts
//
import {UserInfo} from './userinfo';
import {SigleNamedViewModel} from './siglenamedmodel';
import {IDepartement} from 'infodata';
//
export class DepartementsModel extends SigleNamedViewModel<IDepartement> {
	//
    constructor(info: UserInfo) {
        super(info);
        this.title = 'Départements';
    }// constructor
    protected create_item(): IDepartement {
        return this.itemFactory.create_departement();
    }
	protected prepare_model(): any {
		return {type: this.modelItem.type()};
	}// prepare_model
    public get isEditable(): boolean {
		return this.is_super;
    }
	public set isEditable(b:boolean){}
	protected get_remove_selector(): any {
		return {departementid: this.currentItem.id};
	}
    public canActivate(params?: any, config?: any, instruction?: any): any {
		return this.is_super;
    }// activate
}// class DepartementModel
