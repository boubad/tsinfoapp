import { DomainConstants } from "./DomainConstants";
import { InfoDataStore } from "./InfoDataStore";
import type { IDataStore } from "./IDataStore";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import type { IDataOption } from "./IDataOption";
import { initialEtudiant } from "./IEtudiantDoc";

export class BaseServices {
  public datastore: InfoDataStore;
  public dbUrl: string;
  //
  constructor(store?: IDataStore, dbUrl?: string) {
    this.dbUrl = dbUrl;
    this.datastore = new InfoDataStore(store, dbUrl);
  } // constructor
  public async saveAttachmentAsync(
    docid: string,
    attName: string,
    mimeType: string,
    data: Blob | ArrayBuffer
  ): Promise<Record<string, unknown>> {
    return this.datastore.maintainsBlobAsync(docid, attName, mimeType, data);
  } // SaveAttachmentAsync
  public async removeAttachmentAsync(
    docid: string,
    attName: string
  ): Promise<Record<string, unknown>> {
    return this.datastore.removeBlobAsync(docid, attName);
  } // RemoveAttachmentAsync
  //
  public async getItemOptionsAsync<T extends ISigleNamedDoc>(
    item: T,
    filter?: Record<string, unknown>
  ): Promise<readonly IDataOption[]> {
    const sel = filter
      ? { ...filter, doctype: item.doctype }
      : { doctype: item.doctype };
    const fields: readonly string[] = [
      DomainConstants.FIELD_ID,
      DomainConstants.FIELD_NAME,
      DomainConstants.FIELD_SIGLE,
      DomainConstants.FIELD_OBSERVATIONS,
    ];
    const pp: readonly Record<string, unknown>[] =
      await this.datastore.findAllDocsBySelectorAsync(sel, fields);
    const pz: IDataOption[] = [];
    const n = pp.length;
    for (let i = 0; i < n; i++) {
      const v = pp[i];
      if (v._id && v.sigle && v.name) {
        const id = v._id as string;
        const sigle = v.sigle as string;
        const title = v.name as string;
        const rem = v.observations ? v.observations : "";
        const subTitle = sigle + " " + rem;
        pz.push({ value: id, name: title, subTitle });
      }
    } // i
    if (pz.length > 1) {
      pz.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    if (pz.length < 1) {
      return pz;
    }
    const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
    const nx = pz.length;
    for (let i = 0; i < nx; i++) {
      pRet.push(pz[i]);
    } // i
    return pRet;
  } // getItemOptionsAsync

  //
  public async getPersonsOptionsByFilterAsync(
    sel: Record<string, unknown>
  ): Promise<readonly IDataOption[]> {
    const pRet: IDataOption[] = [];
    const fields: string[] = [
      DomainConstants.FIELD_ID,
      DomainConstants.FIELD_FIRSTNAME,
      DomainConstants.FIELD_LASTNAME,
      DomainConstants.FIELD_AVATAR,
      DomainConstants.FIELD_ATTACHMENTS,
      DomainConstants.FIELD_OBSERVATIONS,
    ];
    const sort: Record<string, unknown>[] = [
      { lastname: "asc" },
      { firstname: "asc" },
    ];
    const dd = await this.datastore.findAllDocsBySelectorAsync(
      sel,
      fields,
      sort
    );
    const n = dd.length;
    for (let i = 0; i < n; i++) {
      const v = dd[i];
      if (v && v._id && v.lastname && v.firstname) {
        const id = v._id as string;
        const lastname = (v.lastname as string).toUpperCase();
        const firstname = v.firstname as string;
        const title = lastname + " " + firstname;
        const subTitle = v.observations? v.observations as string : '';
        const avatar =
          lastname.substring(0, 0).toUpperCase() +
          firstname.substring(0, 0).toUpperCase();
        const p: IDataOption = {
          value: id,
          name: title,
          avatar,
          subTitle,
        };
        await this._checkOptionAvatarAsync(
          id,
          v._attachments,
          v.avatar as string,
          p
        );
        pRet.push(p);
      } // names
    } // i
    return pRet;
  } //GetPersonsOptionsByFilterAsync
  //
  public async getEtudiantsOptionsByIdsAsync(
    ids: readonly string[]
  ): Promise<readonly IDataOption[]> {
    const store = this.datastore;
    const vret: IDataOption[] = [];
    const n = ids.length;
    for (let i = 0; i < n; i++) {
      const p = await store.findItemByIdAsync(initialEtudiant, ids[i]);
      if (p) {
        vret.push({
          value: p._id,
          name: p._fullname
            ? p._fullname
            : p.lastname.toUpperCase() + " " + p.firstname,
          url: p._url,
        });
      }
    } // i
    if (vret.length > 1) {
      vret.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    } // sort
    return vret;
  } // getEtudiantsOptionsByIdsAsync
  //
  protected async _checkOptionAvatarAsync(
    docid: string,
    attachments: any,
    avatar: string,
    p: IDataOption
  ): Promise<void> {
    if (!docid || !attachments) {
      return;
    }
    const aa = await this.datastore.processDocAttachmentsAsync({
      _id: docid,
      _attachments: attachments,
    });
    if (avatar && avatar.length > 0) {
      const a = aa.find((x) => {
        return x.name && x.name === avatar;
      });
      if (a) {
        p.url = a.url;
        return;
      }
    } // avatar
    const px = aa.find((x) => {
      return x.content_type.startsWith("image/");
    });
    if (px) {
      p.url = px.url;
    }
  } // checkOptionAvatarAsync
  //
} // class BaseServices
