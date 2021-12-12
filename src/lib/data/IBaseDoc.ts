// IBaseDoc.ts
//

import type { IAttachedDoc } from "./IAttachedDoc";
import type { StatusType } from "./StatusType ";

//
export interface IBaseDoc {
    _id: string;
    _rev: string;
    doctype: string;
    _linkfield?: string;
    observations?: string;
    status?: StatusType;
    ownerid?: string;
    reptype?: string;
    _attachments?: IAttachedDoc[];
    _text?: string;
    _subText?: string;
    _avatar?: string;
    _url?: string;
    _loaded?: boolean;
    _modified?: boolean;
    _deleted?: boolean;
    _storeable?: boolean;
    _selected?: boolean;
} // interface IBaseDoc
