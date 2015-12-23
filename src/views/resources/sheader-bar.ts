//header-bar.ts
//
import {BaseComponent} from '../../data/basecomponent';
import {BaseView} from '../../data/baseview';
import {customElement} from 'aurelia-framework';
//
@customElement('sheader-bar')
export class SheaderBar extends BaseComponent<BaseView> {
	constructor() {
		super();
	}
	public get title(): string {
		return this.parent.title;
	}
	public get error_message(): string {
		return this.parent.error_message;
	}
	public get info_message(): string {
		return this.parent.info_message;
	}
	public get has_error_message(): boolean {
		return (this.error_message !== null);
	}
	public get has_info_Message(): boolean {
		return (this.info_message !== null);
	}
	//
}
