//person-bar.ts
//
//
import {BaseComponent} from '../../data/basecomponent';
import {PersonViewModel} from '../../data/personmodel';
import {IDepartementPerson} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('person-bar')
export class PersonBar extends BaseComponent<PersonViewModel<IDepartementPerson>> {
	//
	constructor() {
		super();
	}
	//
    public get canImport(): boolean {
        return this.parent.canImport;
    }
    public importFileChanged(event: any): any {
		this.parent.importFileChanged(event);
	}
	//
	public get isReadOnly(): boolean {
		return this.parent.isReadOnly;
    }
    public get isEditItem(): boolean {
        return this.parent.isEditItem;
    }
	public get isNotEditItem(): boolean {
		return this.parent.isNotEditItem;
	}
    public get isEditable(): boolean {
		return this.parent.isEditable;
    }
    public reset_password(): any {
		this.parent.reset_password();
    }
    public get username(): string {
        return this.parent.username;
    }
    public set username(s: string) {
		this.parent.username = s;
    }
    public get lastname(): string {
        return this.parent.lastname;
    }
    public set lastname(s: string) {
		this.parent.lastname = s;
    }

    public get firstname(): string {
        return this.parent.firstname;
    }
    public set firstname(s: string) {
		this.parent.firstname = s;
    }
    public get email(): string {
        return this.parent.email;
    }
    public set email(s: string) {
		this.parent.email = s;
    }
    public get phone(): string {
        return this.parent.phone;
    }
    public set phone(s: string) {
		this.parent.phone = s;
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
	//
}// class PersonBar