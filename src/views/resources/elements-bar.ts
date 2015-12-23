//elements-bar.ts
//
import {BaseConsultBar} from '../../data/baseconsultcomponent';
import {IBaseItem} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('elements-bar')
export class ElementsBar extends BaseConsultBar<IBaseItem> {
    constructor() {
        super();
    }
}
