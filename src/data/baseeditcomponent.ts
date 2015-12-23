//baseeditcomponent.ts
//
import {BaseComponent} from './basecomponent';
import {BaseEditViewModel} from './baseeditmodel';
import {IBaseItem} from 'infodata';
//
export class BaseEditBar<T extends IBaseItem> extends BaseComponent<BaseEditViewModel<T>> {
    //
    constructor() {
        super();
    }
    public get canShowForm(): boolean {
        return this.parent.canShowForm;
    }
    public get currentItem(): T {
        return this.parent.currentItem;
    }
    public set currentItem(s: T) {
		this.parent.currentItem = s;
    }
    public get isEditable(): boolean {
        return this.parent.isEditable;
    }
    public get isReadOnly(): boolean {
        return this.parent.isReadOnly;
    }
    public get isEditItem(): boolean {
        return this.parent.isEditItem;
    }
	public get isNotEditItem(): boolean {
		return this.parent.isNotEditItem;
	}
    public get canAdd(): boolean {
        return this.parent.canAdd;
    }
    public addNew(): any {
		this.parent.addNew();
    }
    public get canCancel(): boolean {
        return this.parent.canCancel;
    }
    public get cannotCancel(): boolean {
        return (!this.canCancel);
    }
    public cancel_add(): void {
		this.parent.cancel_add();
    }
    public cancel(): void {
        this.cancel_add();
    }
    public get canRemove(): boolean {
        return this.parent.canRemove;
    }
    public get cannotRemove(): boolean {
        return (!this.canRemove);
    }
    public get canSave(): boolean {
        return this.parent.canSave;
    }
    public get cannotSave(): boolean {
        return (!this.canSave);
    }
    //
    public save(): any {
        return this.parent.save();
    }// save
    public remove(): any {
        return this.parent.remove();
    }// remove
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
}// class BaseListComponent
