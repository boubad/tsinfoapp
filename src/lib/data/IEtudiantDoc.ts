import type { IPersonDoc } from './IPersonDoc';
import { DomainConstants } from './DomainConstants';

export interface IEtudiantDoc extends IPersonDoc {
    birthyear?: number;
    ident?: string;
    departement?: string;
    ville?: string;
    etablissement?: string;
    seriebac?: string;
    optionbac?: string;
    mentionbac?: string;
    apb?: number | null;
    redoublant?: string;
    typeformation?: string;
    sup?: string;
    notedirty?: boolean;
    evtdirty?: boolean;
    data?: Record<string, unknown>;
    s0?: Record<string, unknown>;
    s1?: Record<string, unknown>;
    s2?: Record<string, unknown>;
    s3?: Record<string, unknown>;
    s4?: Record<string, unknown>;
    s5?: Record<string, unknown>;
    s6?: Record<string, unknown>;
    //
} // interface IEtudiantDoc
export function CreateEtudiant(): IEtudiantDoc {
    return {
        _id: '',
        _rev: '',
        firstname: '',
        lastname: '',
        doctype: DomainConstants.TYPE_ETUDIANT,
        _linkfield: DomainConstants.FIELD_ETUDIANTID
    };
} // GetInitialEtudiant
//
export const initialEtudiant: IEtudiantDoc = CreateEtudiant();
