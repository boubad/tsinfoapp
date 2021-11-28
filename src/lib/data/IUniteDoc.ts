import { DomainConstants } from "./DomainConstants";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";

export interface IUniteDoc extends ISigleNamedDoc { } // interface IUniteDoc
//
export function CreateUnite(): IUniteDoc {
    return {
        _id: "",
        _rev: "",
        sigle: "",
        name: "",
        doctype: DomainConstants.TYPE_UNITE,
        _linkfield: DomainConstants.FIELD_UNITEID,
    };
} // CreateUnite
//
export const initialUnite: IUniteDoc = CreateUnite();
