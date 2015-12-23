//siglename-bar.ts
//
import {ISigleNamedItem} from 'infodata';
import {customElement} from 'aurelia-framework';
import {BaseComponent} from '../../data/basecomponent';
import {SigleNamedViewModel} from '../../data/siglenamedmodel';
//
@customElement('siglename-bar')
export class SiglenameBar extends BaseComponent<SigleNamedViewModel<ISigleNamedItem>>  {
    //
    constructor() {
		super();
    }
    public get isReadOnly(): boolean {
		return this.parent.isReadOnly;
    }
    public get sigle(): string {
        return this.parent.sigle;
    }
    public set sigle(s: string) {
		this.parent.sigle = s;
    }
    public get name(): string {
        return this.parent.name;
    }
    public set name(s: string) {
		this.parent.name = s;
    }
    public get description(): string {
        return this.parent.description;
    }
    public set description(s: string) {
		this.parent.description = s;
    }
	public get status(): string {
        return this.parent.status;
    }
    public set status(s: string) {
		this.parent.status = s;
    }
}
