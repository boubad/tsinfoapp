// synchromodel.ts
import {UserInfo} from './userinfo';
import {SynchroManager} from './syncmanager';
import {BaseView} from './baseview';
//
//
export class SynchroModel extends BaseView {
	//
	private _manager: SynchroManager;
	private _candidateServer: string;
	private _canPerform: boolean;
	//
	constructor(info: UserInfo) {
		super(info);
		if ((info !== undefined) && (info !== null)) {
			this._manager = new SynchroManager(info.dataService);
			this._canPerform = true;
		}
	}
	public get candidateServer(): string {
		return (this._candidateServer !== undefined) ? this._candidateServer : "";
	}
	public set candidateServer(s: string) {
		this._candidateServer = s;
	}
	private get syncManager(): SynchroManager {
		return (this._manager !== undefined) ? this._manager : null;
	}
	public get canPerform(): boolean {
		return ((this._canPerform !== undefined) && (this._canPerform !== null)) ?
			this._canPerform && this.is_not_busy : false;
	}
	public set canPerform(b: boolean) {
		this._canPerform = b;
	}
	public get servers(): string[] {
        return (this.syncManager !== null) ? this.syncManager.servers : [];
    }
    public get currentServer(): string {
        return (this.syncManager !== null) ? this.syncManager.currentServer : null;
    }
    public set currentServer(s: string) {
		if (this.syncManager !== null) {
			this.syncManager.currentServer = s;
		}
    }
	public get canRemovePersons():boolean {
		return this.is_super && this.is_not_busy && this.canImport && this.canExport;
	}
    public removeAllPersons():Promise<boolean> {
		this.is_busy = true;
		return this.dataService.remove_all_persons().then((b)=>{
			return this.loginInfo.refresh_data();
		}).then((bx)=>{
			this.is_busy = false;
			return true;
		}).catch((e)=>{
			this.set_error(e);
			this.is_busy = false;
			return false;
		})
	}//remove_all_persons
    public get canRemoveServer(): boolean {
        return (this.currentServer !== null) && (this.currentServer.trim().length > 0) &&
			this.canImport && this.canExport && this.is_not_busy;
    }
    public get cannotRemoveServer(): boolean {
        return (!this.canRemoveServer);
    }
    public removeServer(): void {
		if (this.syncManager !== null) {
			this.syncManager.remove_server(this.currentServer);
		}
    }// removeServer
    //
    public get canAddServer(): boolean {
        return (this.candidateServer !== null) && (this.candidateServer.trim().length > 0) &&
			this.canImport && this.canExport && this.is_not_busy;
    }
    public get cannotAddServer(): boolean {
        return (!this.canAddServer);
    }
    public addServer(): void {
		if (this.syncManager !== null) {
			this.syncManager.add_server(this.candidateServer);
			this.candidateServer = null;
		}
    }// addServer
    //
	public get canImport(): boolean {
        return (this.currentServer !== null) ?
			this.syncManager.canImport && this.is_not_busy : false;
    }
	public get canExport(): boolean {
        return (this.currentServer !== null) ?
			this.syncManager.canExport && this.is_not_busy : false;
    }
	public import(): Promise<any> {
		this.is_busy = true;
		this.canPerform = false;
		this.clear_error();
		this.info_message = "Synchronization en cours (import) ...";
		return this.syncManager.import_from().then((r) => {
			this.userInfo.loginInfo.refresh_data();
			this.info_message = "Synchronization termin??e!";
			this.canPerform = true;
			this.is_busy = false;
			return true;
		}).catch((e) => {
			this.set_error(e);
			this.canPerform = true;
			this.is_busy = false;
			return false;
		})
	}
	public export(): Promise<any> {
		this.is_busy = true;
		this.canPerform = false;
		this.clear_error();
		this.info_message = "Synchronization en cours (export) ...";
		return this.syncManager.export_to().then((r) => {
			this.info_message = "Synchronization termin??e";
			this.canPerform = true;
			this.is_busy = false;
			return true;
		}).catch((e) => {
			this.set_error(e);
			this.canPerform = true;
			this.is_busy = false;
			return false;
		})
	}
	public canActivate(params?: any, config?: any, instruction?: any): any {
		let bRet: boolean = false;
		if (this.is_connected) {
			bRet = this.is_admin || this.is_super || this.is_prof;
		}
		return bRet;
	}// canActivate
	public canDeactivate(): any {
		return this.is_not_busy;
	}
}// SynchroModel
