import type { IDataOption } from "./IDataOption";

export interface IBasePayload {
    readonly error?: string;
    readonly info?: string;
    readonly ok?: boolean;
    readonly data?: Record<string,unknown>[] | IDataOption[] | unknown;
} // interface IBasePayload
