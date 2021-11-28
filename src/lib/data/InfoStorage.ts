//
const _storageAvailable = (type: string): boolean => {
  let storage: Storage | undefined = undefined;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      storage &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
}; //_storageAvailable
//
const LOCaL_STORAGE = "localStorage";
//
export class InfoStorage {
  //
  private _store: Storage = undefined;
  constructor(type?: string) {
    const stype = type ? type : LOCaL_STORAGE;
    if (_storageAvailable(stype)) {
      this._store = window[stype];
    }
  } // constructor
  public get(key: string): string | undefined {
    if (this._store && key) {
      try {
        const s = this._store.get(key);
        return s ? s : undefined;
      } catch (_e) {}
    } // store
    return undefined;
  } // get
  public set(key: string, val: string): void {
    if (!this._store || !key) {
      return;
    }
    const sv = val ? val.trim() : "";
    try {
      if (sv.length < 1) {
        this._store.removeItem(key);
      } else {
        this._store.setItem(key, sv);
      }
    } catch (_e) {}
  } // set
  public getObject(key: string): Record<string, unknown> | undefined {
    const s = this.get(key);
    if (s) {
      try {
        return JSON.parse(s);
      } catch (_e) {}
    } // s
    return undefined;
  } // getObject
  public setObject(key: string, obj: Record<string, unknown>): void {
    if (!this._store || !key) {
      return;
    }
    try {
      if (obj === undefined || obj === null) {
        this._store.removeItem(key);
      } else {
        const s = JSON.stringify(obj);
        this._store.setItem(key, s);
      }
    } catch (_e) {}
  } // getObject
} // class InfoStorage
