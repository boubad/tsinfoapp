// IPersonDoc.ts
//

import type { IBaseDoc } from "./IBaseDoc";

//
export interface IPersonDoc extends IBaseDoc {
    sexe?: string;
    birthdate?: string;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    address?: string,
    firstname: string;
    lastname: string;
    avatar?: string;
    roles?: string[];
    //
    _url?: string;
    _photoData?: ArrayBuffer;
    _avatar?: string;
    _fullname?: string;
} // interface IPersonDoc
