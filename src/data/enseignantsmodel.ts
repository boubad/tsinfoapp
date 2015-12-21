//enseignantsmodel.ts
//
import {UserInfo} from './userinfo';
import {PersonViewModel} from './personmodel';
import {IEnseignant} from 'infodata';
//
export class EnseignantsModel extends PersonViewModel<IEnseignant> {
	//
    constructor(info: UserInfo) {
        super(info);
        this.title = 'Enseignants';
    }// constructor
	protected get_remove_selector(): any {
		return { enseignantid: this.currentItem.id };
	}
    protected create_item(): IEnseignant {
        return this.itemFactory.create_enseignant({
			departementid:this.departementid,
			departementName: this.departementName
		});
    }
    
}// class DepartementModel
