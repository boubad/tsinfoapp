//etudiant.ts
import {IEtudiant} from 'infodata';
import {DepartementPerson} from './departementperson';
import {Person} from './person';
import {ETUDIANT_TYPE, ETUDIANT_PREFIX} from './infoconstants';
//
export class Etudiant extends DepartementPerson implements IEtudiant {
    constructor(oMap?: any) {
        super(oMap);
    }
    public type(): string {
        return ETUDIANT_TYPE;
    }
    public store_prefix(): string {
        return ETUDIANT_PREFIX;
    }
}// class Etudiant