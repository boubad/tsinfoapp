//docpersist.d.ts
//
declare module 'infodata' {
	export interface IDocPersist {
        name: string;
		//
        exists_doc: (docid: string) => Promise<string>;
        read_doc: (docid: string, bAttachments?: boolean, bMeta?: Boolean) => Promise<IPouchDocument>;
        insert_doc: (doc: IPouchDocument) => Promise<PouchUpdateResponse>;
        update_doc: (doc: IPouchDocument) => Promise<PouchUpdateResponse>;
        remove_doc: (doc: IPouchDocument) => Promise<PouchUpdateResponse>;
        bulk_maintains: (docs: any[]) => Promise<PouchUpdateOptions[]>;
        docs_ids_range: (startkey: string, endkey: string,skip?: number, limit?: number) => Promise<string[]>;
        docs_read_range: (startkey: string, endkey: string, skip?: number, limit?: number) => Promise<IPouchDocument[]>;
        docs_array: (ids: string[]) => Promise<IPouchDocument[]>;
        remove_all_items: (startKey: string, endKey: string) => Promise<PouchUpdateOptions[]>;
		//
        isOnline: () => Promise<boolean>;
		//
        find_attachment: (docid: string, attachmentId: string) => Promise<Blob>;
        maintains_attachment: (docid: string, attachmentId: string,
            attachmentData: Blob, attachmentType: string) => Promise<any>;
        remove_attachment: (docid: string, attachmentId: string) => Promise<any>;
        //
        create_one_index: (field: string) => Promise<boolean>;
        create_multi_index: (fields: string[]) => Promise<boolean>;
        create_indexes: (fields: string[]) => Promise<boolean[]>;
        query_docs: (selector: any,  skip?: number, limit?: number,fields?: string[]) => Promise<IPouchDocument[]>;
		remove_query_docs: (sel: any) => Promise<boolean>;
		//
		replicate: (from: string, to: string, ids?: string[]) => Promise<boolean>;
    }// interface IDocPersist
    //
}// module infodata
