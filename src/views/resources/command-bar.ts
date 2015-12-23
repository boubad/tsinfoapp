//command-bar.ts
//
import {BaseEditBar} from '../../data/baseeditcomponent';
import {IBaseItem} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('command-bar')
export class CommandBar extends BaseEditBar<IBaseItem> {
    constructor() {
        super();
    }
}
