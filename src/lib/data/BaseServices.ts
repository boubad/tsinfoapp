import { DomainConstants } from "./DomainConstants";
import { InfoDataStore } from "./InfoDataStore";
import type { IDataStore } from "./IDataStore";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";
import type { IDataOption } from "./IDataOption";
import { initialEtudiant } from "./IEtudiantDoc";
import type { IDataUrlCreator } from './IDataUrlCreator';

export class BaseServices {
  private _datastore: InfoDataStore;
  private _dbUrl?: string;
  private _urlcreator?: IDataUrlCreator;
  //
  constructor(store: IDataStore, creator?: IDataUrlCreator, dbUrl?: string) {
    if (!store) {
      throw new Error("Invalid datastore");
    }
    this._datastore = new InfoDataStore(store, creator, dbUrl);
    this._dbUrl = dbUrl;
    this._urlcreator = creator;
  } // constructor
  //
  public get datastore(): InfoDataStore {
    return this._datastore;
  }
  public get dbUrl(): string | undefined {
    return this._dbUrl;
  }
  public get dataUrlCreator(): IDataUrlCreator | undefined {
    return this._urlcreator;
  }
  //
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
    filter?: Record<string, unknown>,
    bSortDesc?: boolean
  ): Promise<readonly IDataOption[]> {
    const sel: Record<string, unknown> = (filter) ? { ...filter } : {};
    sel[DomainConstants.FIELD_TYPE] = item.doctype;
    const fields: readonly string[] = [
      DomainConstants.FIELD_ID,
      DomainConstants.FIELD_NAME,
      DomainConstants.FIELD_SIGLE,
      DomainConstants.FIELD_OBSERVATIONS,
    ];
    const pp: readonly Record<string, unknown>[] =
      await this.datastore.findAllDocsBySelectorAsync(sel, fields);
    const pz: IDataOption[] = [];
    pp.forEach((v) => {
      const id = v[DomainConstants.FIELD_ID] as string;
      const sigle = v[DomainConstants.FIELD_SIGLE] as string;
      const title = v[DomainConstants.FIELD_NAME] as string;
      const rem = v[DomainConstants.FIELD_OBSERVATIONS] ? v[DomainConstants.FIELD_OBSERVATIONS] as string : "";
      const subTitle = sigle + " " + rem;
      pz.push({ value: id, name: title, subTitle });
    });
    if (pz.length > 1) {
      if (bSortDesc !== undefined && bSortDesc === true) {
        pz.sort((a, b) => {
          if (a.name < b.name) {
            return 1;
          } else if (a.name > b.name) {
            return -1;
          }
          return 0;
        });
      } else {
        pz.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }

    }
    if (pz.length < 1) {
      return pz;
    }
    return [{ value: "", name: "Aucune sélection" }, ...pz];
  } // getItemOptionsAsync

  //
  public async getPersonsOptionsByFilterAsync(
    sel: Record<string, unknown>
  ): Promise<readonly IDataOption[]> {
    const pRet: IDataOption[] = [];
    const fields: readonly string[] = [
      DomainConstants.FIELD_ID,
      DomainConstants.FIELD_FIRSTNAME,
      DomainConstants.FIELD_LASTNAME,
      DomainConstants.FIELD_AVATAR,
      DomainConstants.FIELD_ATTACHMENTS,
      DomainConstants.FIELD_OBSERVATIONS,
    ];
    const sort: readonly Record<string, unknown>[] = [
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
      const id = v[DomainConstants.FIELD_ID] as string;
      const lastname = (v[DomainConstants.FIELD_LASTNAME] as string).toUpperCase();
      const firstname = v[DomainConstants.FIELD_FIRSTNAME] as string;
      const title = lastname + " " + firstname;
      const subTitle = v[DomainConstants.FIELD_OBSERVATIONS] ? v[DomainConstants.FIELD_OBSERVATIONS] as string : '';
      const avatar =
        lastname.substring(0, 0).toUpperCase() +
        firstname.substring(0, 0).toUpperCase();
      const p: IDataOption = {
        value: id,
        name: title,
        avatar,
        subTitle,
      };
      if (v[DomainConstants.FIELD_ATTACHMENTS]) {
        await this._checkOptionAvatarAsync(
          id,
          v[DomainConstants.FIELD_ATTACHMENTS],
          v[DomainConstants.FIELD_AVATAR] as string,
          p
        );
      }// attachments
      pRet.push(p);
    } // i
    return pRet;
  } // GetPersonsOptionsByFilterAsync
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
    avatar: string | undefined,
    p: IDataOption
  ): Promise<void> {
    const doc: Record<string, unknown> = {};
    doc[DomainConstants.FIELD_ID] = docid;
    doc[DomainConstants.FIELD_ATTACHMENTS] = attachments;
    const aa = await this.datastore.processDocAttachmentsAsync(doc);
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
