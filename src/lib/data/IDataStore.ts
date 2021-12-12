import type { IHttpOutput } from "./IHttpOutput";

//
export type IDataStore = {
    readonly isOnLineAsync: () => Promise<boolean>;
    readonly formBlobUrl: (id?: string, name?: string) => string | undefined;
    //
    readonly findDocRevisionAsync: (sid: string) => Promise<string | undefined>;
    readonly findDocByIdAsync: (id: string) => Promise<Record<string, unknown> | undefined>
    readonly maintainsDocAsync: (doc: Record<string, unknown>) => Promise<Record<string, unknown>>;
    readonly removeDocAsync: (id: string) => Promise<Record<string, unknown>>;
    //
    readonly findDocsBySelectorAsync: (
        sel: Record<string, unknown>,
        start?: number,
        count?: number,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ) => Promise<readonly Record<string, unknown>[]>;
    readonly findDocsCountBySelectorAsync:(sel: Record<string, unknown>) => Promise<number>;
    readonly findDocBySelectorAsync: (
        sel: Record<string, unknown>,
        fields?: readonly string[]
    ) => Promise<Record<string, unknown> | undefined>;
    readonly findAllDocsBySelectorAsync: (
        sel: Record<string, unknown>,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ) => Promise<readonly Record<string, unknown>[]>;
    readonly findAllDocsIdsBySelectorAsync: (sel: Record<string, unknown>) => Promise<readonly string[]>;
    readonly removeDocsBySelectorAsync: (sel: Record<string, unknown>) => Promise<readonly Record<string, unknown>[]>;
    //
    readonly getBlobDataAsync: (id: string, name: string) => Promise<IHttpOutput>
    readonly maintainsBlobAsync: (
        id: string,
        name: string,
        mime: string,
        data: Blob | ArrayBuffer
    ) => Promise<Record<string, unknown>>;
    readonly removeBlobAsync: (id: string, name: string) => Promise<Record<string, unknown>>;

    //
    readonly maintainsManyDocsAsync: (docs: readonly Record<string, unknown>[]) => Promise<readonly Record<string, unknown>[]>;
    readonly bulkGetAsync: (ids: readonly string[]) => Promise<readonly Record<string, unknown>[]>;
} // interface IDataStore2
