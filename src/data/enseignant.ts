//enseignant.ts
import {IEnseignant} from 'infodata';
import {DepartementPerson} from './departementperson';
import {Person} from './person';
import {ENSEIGNANT_TYPE, ENSEIGNANT_PREFIX} from './infoconstants';
//
//
export class Enseignant extends DepartementPerson implements IEnseignant {
    constructor(oMap?: any) {
        super(oMap);
    }
    public type(): string {
        return ENSEIGNANT_TYPE;
    }
    public store_prefix(): string {
        return ENSEIGNANT_PREFIX;
    }
}// class Enseignant
//