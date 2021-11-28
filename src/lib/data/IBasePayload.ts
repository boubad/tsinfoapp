import type { IDataOption } from "./IDataOption";

export interface IBasePayload {
    error?: string;
    info?: string;
    ok?: boolean;
    data?: Record<string,unknown>[] | IDataOption[] | unknown;
} // interface IBasePayload
