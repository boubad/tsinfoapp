//work-bar.ts
import {BaseComponent} from '../../data/basecomponent';
import {BaseView} from '../../data/baseview';
import {customElement} from 'aurelia-framework';
//
@customElement('work-bar')
export class WorkBar  extends BaseComponent<BaseView> {
    constructor() {
		super();
    }
    
}
