import type { IBaseDoc } from "./IBaseDoc";
import type { IBasePayload } from './IBasePayload';
//
export interface IItemPayload<T extends IBaseDoc> extends IBasePayload {
    items?: T[];
    item?: T;
    prev?: T;
    //
} // interface IItemPayload<T>
