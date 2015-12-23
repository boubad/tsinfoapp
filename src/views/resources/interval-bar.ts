//intervalbar.ts
//
//
import {BaseComponent} from '../../data/basecomponent';
import {IntervalledViewModel} from '../../data/intervalmodel';
import {IIntervalledSigleItem} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('interval-bar')
export class IntervalBar extends BaseComponent<IntervalledViewModel<IIntervalledSigleItem>>  {
    //
    constructor() {
        super();
    }
	public get isEditable(): boolean {
        return this.parent.isEditable;
    }
    public get isReadOnly(): boolean {
        return this.parent.isReadOnly;
    }
    public get minDate(): string {
		return this.parent.minDate;
    }
    public get maxDate(): string {
		return this.parent.maxDate;
    }
    public get startDate(): string {
		return this.parent.startDate;
    }
    public set startDate(s: string) {
		this.parent.startDate = s;
    }
    public get endDate(): string {
		return this.parent.endDate;
    }
    public set endDate(s: string) {
		this.parent.endDate = s;
    }
}// IntervalBar
