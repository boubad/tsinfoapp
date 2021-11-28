import { HTTP_MODIFIED, HTTP_OK, IHttpOutput } from "./IHttpOutput"

//
const _JSON_APPLICATION = 'application/json'
const _METHOD_HEAD = 'HEAD'
const _METHOD_GET = 'GET'
const _METHOD_PUT = 'PUT'
const _METHOD_POST = 'POST'
const _METHOD_DELETE = 'DELETE'
//
const _MODE_CORS = 'cors';
//
const _credentials = 'Basic ' + window.btoa('boubad:bouba256');
//
const _convertRsp = (rsp: Response): IHttpOutput => {
    const vv: Record<string, string> = {}
    rsp.headers.forEach((val: string, key: string) => {
        vv[key] = val
    })
    return {
        status: rsp.status,
        headers: vv
    }
}
//
export const fetchClient = {
    headAsync: async (url: string): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            headers: {
                Authorization: _credentials
            },
            method: _METHOD_HEAD,
            mode: _MODE_CORS,
        })
        return _convertRsp(rsp)
    }, // headAsync
    getAsync: async (url: string): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            headers: {
                Accept: _JSON_APPLICATION,
                Authorization: _credentials
            },
            method: _METHOD_GET,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        const body = await rsp.json()
        return {
            status: vret.status,
            headers: vret.headers,
            body: body
        }
    }, // getAsync
    putAsync: async (url: string, data: unknown): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            body: JSON.stringify(data),
            headers: {
                Accept: _JSON_APPLICATION,
                'Content-Type': _JSON_APPLICATION,
                Authorization: _credentials
            },
            method: _METHOD_PUT,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        const body = await rsp.json()
        return {
            status: vret.status,
            headers: vret.headers,
            body: body
        }
    }, // putAsync
    postAsync: async (url: string, data: unknown): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            body: JSON.stringify(data),
            headers: {
                Accept: _JSON_APPLICATION,
                'Content-Type': _JSON_APPLICATION,
                Authorization: _credentials
            },
            method: _METHOD_POST,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        const body = await rsp.json()
        return {
            status: vret.status,
            headers: vret.headers,
            body: body
        }
    }, // postAsync
    deleteAsync: async (url: string): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            headers: {
                Accept: _JSON_APPLICATION,
                Authorization: _credentials
            },
            method: _METHOD_DELETE,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        const body = await rsp.json()
        return {
            status: vret.status,
            headers: vret.headers,
            body: body
        }
    }, // deleteAsync
    getBlobDataAsync: async (url: string): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            headers: {
                Authorization: _credentials
            },
            method: _METHOD_GET,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        if (rsp.status === HTTP_OK || rsp.status === HTTP_MODIFIED) {
            const body = await rsp.arrayBuffer()
            return {
                status: vret.status,
                headers: vret.headers,
                body: body
            }
        } else {
            const body = await rsp.json()
            return {
                status: vret.status,
                headers: vret.headers,
                body: body
            }
        }
    }, // getBlobDataAsync
    putBlobAsync: async (
        url: string,
        mime: string,
        data: Blob | ArrayBuffer
    ): Promise<IHttpOutput> => {
        const rsp = await fetch(url, {
            body: data,
            headers: {
                Accept: _JSON_APPLICATION,
                'Content-Type': mime,
                Authorization: _credentials
            },
            method: _METHOD_PUT,
            mode: _MODE_CORS,
        })
        const vret = _convertRsp(rsp)
        const body = await rsp.json()
        return {
            status: vret.status,
            headers: vret.headers,
            body: body
        }
    } // putBlobAsync
} // fetchClient
