//basecomponent.ts
import {BaseModel} from './basemodel';
import {BaseView} from './baseview';
import {UserInfo} from './userinfo';
import {HOME_ROUTE} from './infoconstants';
import {IDataManager,IDepartement, IUnite, IAnnee, IMatiere, ISemestre, IGroupe} from 'infodata';
//
export class BaseComponent<V extends BaseModel> {
	//
	private _model: any = new BaseView(new UserInfo());
	private _info: UserInfo = null;
	//
	constructor() {
	}
	
	protected post_bind(): any {
	}
	protected post_attached(): any {
	}
	protected post_detached(): any {
	}
	protected post_unbind(): any {
	}
	public bind(bindingContext: V, overrideContext?: any) {
		this._model = (bindingContext !== undefined) ? bindingContext : null;
		this._info = (this._model !== null) ? this._model.userInfo :
			new UserInfo();
		this.post_bind();
	}
	public unbind(): any {
		this.post_unbind();
	}
	public attached(): any {
		this.post_attached();
	}
	public detached(): any {
		this.post_detached();
	}
	protected get parent(): V {

		return this._model;
	}
	protected get info(): UserInfo {
		return this._info;
	}
	protected get dataService():IDataManager {
		return this.parent.dataService;
	}
	public get is_connected(): boolean {
		return this.info.is_connected;
	}
	public get is_notconnected(): boolean {
		return (!this.is_connected);
	}
	public get fullname(): string {
		return this.info.fullname;
	}
	public get has_url(): boolean {
		return this.info.has_url;
	}
	public get url(): string {
		return this.info.url;
	}
	public logout(): void {
		this.info.logout();
		this.info.navigate_to(HOME_ROUTE);
	}
	//
	public get is_busy(): boolean {
		return this.parent.is_busy;
	}
	public get is_not_busy(): boolean {
		return this.parent.is_not_busy;
	}
	//
	public get departements(): IDepartement[] {
        return this.parent.departements;
    }
    public get departement(): IDepartement {
        return this.parent.departement;
    }
    public set departement(s: IDepartement) {
		this.parent.departement = s;
    }
	//
	public get annees(): IAnnee[] {
        return this.parent.annees;
    }
    public get annee(): IAnnee {
        return this.parent.annee;
    }
    public set annee(s: IAnnee) {
		this.parent.annee = s;
    }
	//
	public get semestres(): ISemestre[] {
        return this.parent.semestres;
    }
    public get semestre(): ISemestre {
        return this.parent.semestre;
    }
    public set semestre(s: ISemestre) {
		this.parent.semestre = s;
    }
	//
	public get unites(): IUnite[] {
        return this.parent.unites;
    }
    public get unite(): IUnite {
        return this.parent.unite;
    }
    public set unite(s: IUnite) {
		this.parent.unite = s;
    }
	//
	public get matieres(): IMatiere[] {
        return this.parent.matieres;
    }
    public get matiere(): IMatiere {
        return this.parent.matiere;
    }
    public set matiere(s: IMatiere) {
		this.parent.matiere = s;
    }
	//
	public get groupes(): IGroupe[] {
        return this.parent.groupes;
    }
    public get groupe(): IGroupe {
        return this.parent.groupe;
    }
    public set groupe(s: IGroupe) {
		this.parent.groupe = s;
    }
}// class BaseBar