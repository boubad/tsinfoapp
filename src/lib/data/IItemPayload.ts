import type { IBaseDoc } from "./IBaseDoc";
import type { IBasePayload } from './IBasePayload';
//
export interface IItemPayload<T extends IBaseDoc> extends IBasePayload {
    readonly items?: readonly T[];
    readonly item?: T;
} // interface IItemPayload<T>
