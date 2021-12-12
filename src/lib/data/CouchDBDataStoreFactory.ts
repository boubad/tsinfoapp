import type { IDataStore } from './IDataStore'
import type { IDataStoreFactory } from './IDataStoreFactory'
import type { IFetchClient } from './IFetchClient'
import { CouchDBClient } from './CouchDBClient'
import type { IDataUrlCreator } from './IDataUrlCreator';

export class CouchDBDataStoreFactory implements IDataStoreFactory {
  private _fetcher: IFetchClient
  private _urlCreator?: IDataUrlCreator
  private _baseurl?: string
  //
  constructor(fetcher: IFetchClient, urlCreator?: IDataUrlCreator, baseurl?: string) {
    this._urlCreator = urlCreator;
    this._fetcher = fetcher
    this._baseurl = baseurl
  }
  public getUrlCreator(): IDataUrlCreator | undefined {
    return this._urlCreator
  }
  public getDataStore(): IDataStore {
    return new CouchDBClient(this._fetcher, this._baseurl)
  } // getDataStore
} // class CouchDBDataStoreFactory
