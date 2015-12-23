//import-bar.ts
//
//
import {BaseComponent} from '../../data/basecomponent';
import {PersonViewModel} from '../../data/personmodel';
import {IDepartementPerson} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('import-bar')
export class ImportBar extends BaseComponent<PersonViewModel<IDepartementPerson>> {
	//
	constructor() {
		super();
	}
	//
	public get isEditable(): boolean {
		return this.parent.isEditable;
    }
    public get canImport(): boolean {
        return this.parent.canImport;
    }
    public importFileChanged(event: any): any {
		this.parent.importFileChanged(event);
	}
	//
}// class ImportBar