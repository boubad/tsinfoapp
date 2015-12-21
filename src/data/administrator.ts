//administrator.ts
import {IAdministrator} from 'infodata';
import {DepartementPerson} from './departementperson';
import {Person} from './person';
import {ADMINISTRATOR_TYPE, ADMINISTRATOR_PREFIX} from './infoconstants';
//
export class Administrator extends DepartementPerson implements IAdministrator {
    constructor(oMap?: any) {
        super(oMap);
    }
    public type(): string {
        return ADMINISTRATOR_TYPE;
    }
    public store_prefix(): string {
        return ADMINISTRATOR_PREFIX;
    }
}// class Administrator
