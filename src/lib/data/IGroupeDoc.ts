import { DomainConstants } from './DomainConstants';
import { GroupeType } from './GroupeType';
// IGroupeDoc.ts
//
import type { ISigleNamedDoc } from './ISigleNamedDoc';
//
export interface IGroupeDoc extends ISigleNamedDoc {
    parentid: string;
    groupetype: GroupeType;
    semestreid: string;
    _parentSigle?: string;
    _semestreSigle?: string;
} // interface IGroupeDoc
export function CreateGroupe(semestreid?: string, groupetype?: GroupeType, parentid?: string): IGroupeDoc {
    return (
        {
            _id: "",
            _rev: "",
            parentid: parentid ? parentid : "",
            groupetype: (groupetype) ? groupetype : GroupeType.Unknown,
            semestreid: semestreid ? semestreid : "",
            sigle: "",
            name: "",
            doctype: DomainConstants.TYPE_GROUPE,
            _linkfield: DomainConstants.FIELD_GROUPEID,
        }
    );
} // GetInitialGroupe
export const initialGroupe: IGroupeDoc = CreateGroupe();
