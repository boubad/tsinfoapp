import { DBConstants } from './DBConstants'
import type { ICouchDBUpdateResponse } from './ICouchDBUpdateResponse'
import type { IDataStore } from './IDataStore'
import type { IFetchClient } from './IFetchClient'
import { HTTP_ERROR, HTTP_OK, HTTP_MODIFIED, IHttpOutput } from './IHttpOutput'
//
//
const STRING_ETAG1 = 'etag'
const STRING_ETAG2 = 'ETag'
const STRING_FIND_IMPL = '_find'
const STRING_BULK_GET = '_bulk_get'
//
const STRING_ID = '_id'
const STRING_UNDER = '_'
const STRING_ARG_REV = '?rev='
//
const MAX_INT_VALUE = Number.MAX_SAFE_INTEGER
const CHUNK_SIZE = 128;
//
export class CouchDBClient implements IDataStore {
    //
    private readonly _baseurl: string
    private readonly _client: IFetchClient
    //
    constructor(client: IFetchClient, dbUrl?: string) {
        this._client = client
        this._baseurl = dbUrl && dbUrl.trim().length > 0 ? dbUrl.trim() : DBConstants.GetUrl()
        const n = this._baseurl.length
        if (this._baseurl[n - 1] !== '/') {
            this._baseurl += '/'
        }
    } // construxtor

    //
    public async isOnLineAsync(): Promise<boolean> {
        let s = this._baseurl
        if (s.endsWith('/')) {
            s = s.substring(0, s.length - 1)
        }
        const n = s.lastIndexOf('/')
        if (n > 0) {
            s = s.substring(0, n)
        }
        const p = await this._client.getAsync(s)
        if (p.status && p.status >= HTTP_ERROR) {
            return false;
        }
        const pp = p.body as Record<string, unknown>
        return pp.couchdb !== undefined && pp.couchdb !== null
    }
    //
    public formBlobUrl(docid?: string, attname?: string): string | undefined {
        if (docid && docid.trim().length > 0 && attname && attname.trim().length > 0) {
            return this._baseurl + encodeURI(docid.trim()) + '/' + encodeURI(attname.trim())
        } else {
            return undefined
        }
    } // formBlobUrl
    //
    public async findDocRevisionAsync(sid: string): Promise<string | undefined> {
        const hh = await this._client.headAsync(this._formUrl(sid))
        if (hh.status && hh.status >= HTTP_ERROR) {
            return undefined
        }
        const xh = hh.headers as Record<string, string>
        let sx = ''
        for (const key in xh) {
            if (key === STRING_ETAG1 || key === STRING_ETAG2) {
                sx = xh[key]
                break
            }
        } // key
        const n = sx.length
        if (n > 2) {
            sx = sx.slice(1, n - 1)
        }
        return (sx.length > 0) ? sx : undefined;
    } // findDocRevisionAsync
    public async findDocByIdAsync(id: string): Promise<Record<string, unknown> | undefined> {
        const url = this._formUrl(id) + '?attachments=true'
        const hx = await this._client.getAsync(url)
        const status = hx.status as number
        if (status === HTTP_OK || status === HTTP_MODIFIED) {
            return hx.body as Record<string, unknown>
        }
        return undefined;
    } // findDocByIdAsync
    public async maintainsDocAsync(ddoc: Record<string, unknown>): Promise<Record<string, unknown>> {
        const doc: Record<string, unknown> = {}
        let id = ''
        for (const key in ddoc) {
            const x = ddoc[key]
            if (x !== undefined && x !== null) {
                if (key === STRING_ID) {
                    id = (x as string).trim()
                } else if (!key.startsWith(STRING_UNDER)) {
                    doc[key] = x
                }
            } // value
        } // key
        if (id.length < 1) {
            // doc has not id
            const rsp = await this._createDocAsync(doc)
            return rsp as Record<string, unknown>
        } // id is empty
        // document has id
        doc._id = id
        const old = await this.findDocByIdAsync(id)
        if (old && old._id && old._rev) {
            // doc exists . Modify it
            const rev = old._rev as string
            if (old._attachments) {
                doc._attachments = old._attachments
            }
            const sUrl = this._formDocUrl(doc._id as string, rev)
            const hh = await this._client.putAsync(sUrl, doc)
            return hh.body as Record<string, unknown>
        } // old
        // insert new document
        const rsp = await this._createDocAsync(doc)
        return rsp as Record<string, unknown>
    } // maintainsDocAsync
    public async removeDocAsync(id: string): Promise<Record<string, unknown>> {
        const srev = await this.findDocRevisionAsync(id)
        if (!srev || srev.length < 1) {
            return {
                ok: true,
                error: 'Document  not found'
            }
        };
        const sUrl = this._formDocUrl(id, srev)
        const x = await this._client.deleteAsync(sUrl)
        return x.body as Record<string, unknown>
    } // removeDocAsync
    //
    public async findDocsBySelectorAsync(
        sel: Record<string, unknown>,
        start?: number,
        count?: number,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        if (!count) {
            count = 20
        }
        if (count < 1) {
            count = 20
        }
        const sUrl = this._formUrl(STRING_FIND_IMPL)
        const opts: Record<string, unknown> = {
            limit: count,
            selector: { ...sel },
            skip: start && start >= 0 ? start : 0
        }
        if (fields && fields.length > 0) {
            opts.fields = [...fields];
        }
        if (sort !== undefined && sort.length > 0) {
            opts.sort = [...sort];
        }
        const hrsp = await this._client.postAsync(sUrl, opts)
        if (hrsp.status && hrsp.status >= HTTP_ERROR) {
            return [];
        }
        const rsp = hrsp.body as Record<string, unknown>
        if (rsp.docs) {
            return rsp.docs as Record<string, unknown>[]
        }
        return [];
    } // findDocsBySelectorAsync
    public async findDocsCountBySelectorAsync(sel: Record<string, unknown>): Promise<number> {
        let offset = 0;
        const fields: readonly string[] = [STRING_ID];
        let done: boolean = false;
        const filter = { ...sel };
        while (!done) {
            const docs = await this.findDocsBySelectorAsync(filter, offset, CHUNK_SIZE, fields)
            const ncur = docs.length;
            offset += ncur;
            done = ncur < CHUNK_SIZE;
        }// not done
        return offset;
    } // findDocsCountBySelectorAsync
    public async findDocBySelectorAsync(
        sel: Record<string, unknown>,
        fields?: readonly string[]
    ): Promise<Record<string, unknown> | undefined> {
        const mm = await this.findDocsBySelectorAsync(sel, 0, 1, fields)
        return mm.length > 0 ? mm[0] : undefined;
    } // findDocBySelectorAsync
    public async findAllDocsBySelectorAsync(
        sel: Record<string, unknown>,
        fields?: readonly string[],
        sort?: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        return this.findDocsBySelectorAsync(sel, 0, MAX_INT_VALUE, fields, sort)
    } // findAllDocsBySelectorAsync
    public async findAllDocsIdsBySelectorAsync(sel: Record<string, unknown>): Promise<readonly string[]> {
        const fields: string[] = ['_id']
        const vRet: string[] = []
        const pp = await this.findAllDocsBySelectorAsync(sel, fields)
        pp.forEach((x) => {
            const id = x._id as string;
            vRet.push(id);
        });
        return vRet
    } // findAllDocsIdsBySelectorAsync
    //
    public async getBlobDataAsync(id: string, name: string): Promise<IHttpOutput> {
        const url = this.formBlobUrl(id, name)
        return this._client.getBlobDataAsync(url as string)
    } // getBlobDataAsync
    public async maintainsBlobAsync(
        id: string,
        name: string,
        mime: string,
        data: Blob | ArrayBuffer
    ): Promise<Record<string, unknown>> {
        const srev = await this.findDocRevisionAsync(id)
        if (!srev || srev.length < 1) {
            return {
                ok: false,
                error: 'Document  not found'
            }
        }
        const url = this.formBlobUrl(id, name) + '?rev=' + srev
        const hrsp = await this._client.putBlobAsync(url, mime, data)
        return hrsp.body as Record<string, unknown>
    } // maintainsBlobAsync
    public async removeBlobAsync(id: string, name: string): Promise<Record<string, unknown>> {
        const srev = await this.findDocRevisionAsync(id)
        if (!srev || srev.length < 1) {
            return {
                ok: true,
                error: 'Document  not found'
            }
        }
        const url = this._formAttachmentUrl(id, name, srev)
        const x = await this._client.deleteAsync(url)
        return x.body as Record<string, unknown>
    } // removeBlobAsync
    //
    public async maintainsManyDocsAsync(
        docs: readonly Record<string, unknown>[]
    ): Promise<readonly Record<string, unknown>[]> {
        const vRet: Record<string, unknown>[] = []
        const n = docs.length
        for (let i = 0; i < n; i++) {
            const doc = docs[i]
            const r = await this.maintainsDocAsync(doc)
            vRet.push(r)
        } // i
        return vRet
    } // maintainsManyDocsAsync(
    public async bulkGetAsync(ids: readonly string[]): Promise<readonly Record<string, unknown>[]> {
        const n = ids.length
        const vdocs: Record<string, unknown>[] = []
        for (let i = 0; i < n; i++) {
            const id = ids[i]
            vdocs.push({ id })
        } // i
        const sUrl = this._formUrl(STRING_BULK_GET)
        const hrsp = await this._client.postAsync(sUrl, { docs: vdocs })
        if (hrsp.status && hrsp.status >= HTTP_ERROR) {
            return [];
        }
        const rsp = hrsp.body as Record<string, unknown>
        const pRet: Record<string, unknown>[] = []
        if (rsp && rsp.results) {
            const rr = rsp.results as Record<string, unknown>[]
            rr.forEach((x) => {
                if (x.docs) {
                    const yy = x.docs as Record<string, unknown>[]
                    yy.forEach((y) => {
                        if (y.ok) {
                            pRet.push(y.ok as Record<string, unknown>)
                        }// ok
                    }); // y
                }// xdocs
            }); // x
        }// rsp.results
        return pRet
    } // bulkGetAsync
    public async removeDocsBySelectorAsync(
        sel: Record<string, unknown>
    ): Promise<readonly Record<string, unknown>[]> {
        const vRet: Record<string, unknown>[] = []
        const offset = 0
        const count = MAX_INT_VALUE
        const fields = [STRING_ID]
        const docs = await this.findDocsBySelectorAsync(sel, offset, count, fields)
        const n = docs.length
        for (let i = 0; i < n; i++) {
            const x = docs[i]
            if (x._id) {
                const id = '' + x._id
                const r = await this.removeDocAsync(id)
                vRet.push(r)
            }
        } // i
        return vRet
    } // removeDocsBySelectorAsync
    // Private fonctions
    //
    private _formUrl(uri: string): string {
        return this._baseurl + encodeURI(uri)
    } // formUrl
    private _formDocUrl(id: string, rev: string): string {
        return this._baseurl + encodeURI(id) + STRING_ARG_REV + rev
    } // formDocUrl
    private _formAttachmentUrl(id: string, attname: string, rev: string): string {
        return this._baseurl + encodeURI(id) + '/' + encodeURI(attname) + STRING_ARG_REV + rev
    } // formAttachmentUrl
    private async _createDocAsync(doc: Record<string, unknown>): Promise<ICouchDBUpdateResponse> {
        let sUrl = this._baseurl
        if (doc._id) {
            const sid = doc._id as string
            if (sid.trim().length > 0) {
                sUrl = this._baseurl + encodeURI(sid.trim())
                const xr = await this._client.putAsync(sUrl, doc)
                const r = xr.body as ICouchDBUpdateResponse
                return r
            }
            delete doc._id
        }
        const xr = await this._client.postAsync(sUrl, doc)
        const r = xr.body as ICouchDBUpdateResponse
        return r
    } // createDoc
    //
} // class CouchDBClient
