import type { IHttpOutput } from "./IHttpOutput";
//
export type IFetchFunc = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
//
export type IFetchClient = {
    readonly headAsync: (url: string) => Promise<IHttpOutput>;
    readonly getAsync: (url: string) => Promise<IHttpOutput>;
    readonly putAsync: (url: string, data: unknown) => Promise<IHttpOutput>;
    readonly postAsync: (url: string, data: unknown) => Promise<IHttpOutput>;
    readonly deleteAsync: (url: string) => Promise<IHttpOutput>;
    readonly getBlobDataAsync: (url: string) => Promise<IHttpOutput>;
    readonly putBlobAsync: (url: string, mime: string, data: Blob | ArrayBuffer) => Promise<IHttpOutput>
} // interface IFetchClient
