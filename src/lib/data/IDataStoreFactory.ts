import type { IDataStore } from './IDataStore'
import type { IDataUrlCreator } from './IDataUrlCreator'

export interface IDataStoreFactory {
  getDataStore(): IDataStore
  getUrlCreator(): IDataUrlCreator | undefined;
} // interface IDataStoreFactory
