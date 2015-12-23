//homemodel.ts
import {IPerson} from 'infodata';
import {BaseView} from './baseview';
import {UserInfo} from './userinfo';
import {ADMIN_ROUTE, CONSULT_ROUTE, ETUDDETAIL_ROUTE} from './infoconstants';
//
export class HomeModel extends BaseView {
	private _username: string = null;
	private _password: string = null;
	private _splashImage: string = null;
	//
	constructor(info: UserInfo) {
		super(info);
		this.title = 'Connexion';
	}
	//
	public get username(): string {
		return this._username;
	}
	public set username(s: string) {
		this._username = this.check_string(s);
	}
	public get password(): string {
		return this._password;
	}
	public set password(s: string) {
		this._password = (s !== undefined) ? s : null;
	}
	public get splash_image(): string {
		return this._splashImage;
	}
	public set splash_image(s: string) {
		this._splashImage = this.check_string(s);
	}
	//
	public get can_connect(): boolean {
		return this.is_not_busy && (this.username !== null) && (this.password !== null) &&
			(this.username.trim().length > 0) && (this.password.trim().length > 0);
	}
	public get cannot_connect(): boolean {
		return (!this.can_connect);
	}
	public get login_image(): string {
		return this.images_dir + "login.jpg";
	}
	public get has_splash_image(): boolean {
		return (this.splash_image !== null);
	}
	public get has_login_image(): boolean {
		return (this.login_image !== null);
	}
	private home_image(): string {
		if (this.is_super) {
			return this.images_dir + "admin.jpg";
		} else if (this.is_admin) {
			return this.images_dir + "oper.jpg";
		} else if (this.is_prof) {
			return this.images_dir + "home.jpg";
		} else if (this.is_etud) {
			return this.images_dir + "etudiant.jpg";
		} else {
			return this.login_image;
		}
	}
	private clear_data(): void {
		this._username = null;
		this._password = null;
	}
	public perform_login(): Promise<any> {
		if (!this.can_connect) {
			return Promise.resolve(false);
		}
		this.is_busy = true;
		this.clear_error();
		return this.userInfo.login(this.username, this.password).then((bRet) => {
			this.clear_data();
			let pPers = this.person;
			if ((pPers !== null) && (pPers.id !== null)) {
				this.splash_image = this.home_image();
				this.is_busy = false;
				if (this.is_super || this.is_admin) {
					return this.navigate_to(ADMIN_ROUTE);
				} else if (pPers.etudiantids.length > 0) {
					return this.navigate_to(ETUDDETAIL_ROUTE, { id: pPers.etudiantids[0] });
				} else {
					return this.navigate_to(CONSULT_ROUTE);
				} 
			} else {
				this.error_message = 'Identifiant et(ou) mot de passe non-reconnu(s)...';
			}
		}).catch((err) => {
			this.clear_data();
			this.set_error(err);
			this.is_busy = false;
			return false;
		});
	}// login
	public deactivate(): any {
		this._username = null;
		this._password = null;
	}

	public activate(params?: any, config?: any, instruction?: any): any {
		this.splash_image = this.home_image();
		this._username = null;
		this._password = null;
		return this.dataService.init_database();
	}// activate
}// class Home
