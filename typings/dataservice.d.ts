//dataservice.d.ts
/// <reference path='./infodata.d.ts' />
/// <reference path='./docpersist.d.ts' />
//
declare module 'infodata' {
	//
	export interface IDataService {
        service: IDocPersist;
        itemFactory: IItemFactory;
        name: string;
        is_valid: boolean;
		//
		is_online: () => Promise<boolean>;
        find_item_by_id: (id: string, bAttach?: boolean,bMeta?:boolean) => Promise<IBaseItem>;
        save_item: (p: IBaseItem) => Promise<boolean>;
        remove_item: (p: IBaseItem) => Promise<boolean>;
        maintains_items: (pp: IBaseItem[]) => Promise<boolean[]>;
        get_ids: (startkey: string, endkey?: string, skip?: number, limit?: number) => Promise<string[]>;
        get_items_range: (startkey: string, endkey: string, skip?: number, limit?: number) => Promise<IBaseItem[]>;
        get_items_array: (ids: string[]) => Promise<IBaseItem[]>;
        remove_all_items: (startKey: string, endKey: string) => Promise<boolean>;
        //
        find_attachment: (docid: string, attachmentId: string) => Promise<Blob>;
        maintains_attachment: (docid: string, attachmentId: string,
            attachmentData: Blob, attachmentType: string) => Promise<boolean>;
        remove_attachment: (docid: string, attachmentId: string) => Promise<boolean>;
        //
        replicate_all: (from: string, to: string) => Promise<any>;
        replicate_person: (pPers: IPerson, from: string, to: string) => Promise<any>;
        replicate_to: (to: string) => Promise<any>;
        replicate_person_to: (pPers: IPerson, to: string) => Promise<any>;
        replicate_from: (from: string) => Promise<any>;
        replicate_person_from: (pPers: IPerson, from: string) => Promise<any>;
        //
        query_items: (type: string, selector?: any, skip?: number, limit?: number,fields?: string[]) => Promise<IBaseItem[]>;
        query_by_template: (temp: IBaseItem, skip?: number, limit?: number,fields?: string[]) => Promise<IBaseItem[]>;
        query_ids: (selector?: any, skip?: number, limit?: number) => Promise<string[]>;
		remove_query_item: (p:IBaseItem,sel?:any) => Promise<boolean>;
    }// interface IDataService
	//
	export interface IDataManager extends IDataService {
		init_database: () => Promise<boolean>; 
		retrieve_one_avatar: (item: IBaseItem,man:IUIManager) => Promise<IBaseItem>;
		retrieve_avatars : (items: IBaseItem[],man:IUIManager) => Promise<IBaseItem[]>;
		sync_person_avatars: (pPers:IPerson) => Promise<boolean> ;
		remove_groupeevent: (item:IGroupeEvent) =>Promise<boolean>;
		remove_profaffectation: (aff:IEnseignantAffectation) => Promise<boolean>;
		remove_etudaffectation: (aff:IEtudiantAffectation) =>Promise<boolean>;
		save_person_avatar: (pPers: IPerson, avatarid: string,
		avatarType: string, data: Blob, man:IUIManager) => Promise<boolean>;
		save_item_avatar: (pPers: IBaseItem, avatarid: string,
		avatarType: string, data: Blob, man:IUIManager) => Promise<boolean>;
		remove_item_avatar: (p: IBaseItem, man: IUIManager) => Promise<boolean> ; 
		remove_person_avatar: (pPers:IPerson, man: IUIManager) => Promise<boolean>;
		get_unite_matieres: (p:IUnite) => Promise<IMatiere[]>;
		get_semestre_groupe_etudaffectations: (sem: ISemestre, grp: IGroupe) => Promise<IEtudiantAffectation[]>;
		find_user: (username: string, password: string) => Promise<IPerson>; 
		refresh_person_docids: (pPers:IPerson) =>Promise<boolean>;
		get_all_departements: () => Promise<IDepartement[]>;
		remove_all_persons(): Promise<boolean>; 
		check_item_avatar: (p: IPersonItem) => Promise<boolean>;
		check_items_avatars: (items: IPersonItem[]) => Promise<boolean>;
	}// IDataManager
}
//