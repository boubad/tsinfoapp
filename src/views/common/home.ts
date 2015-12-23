//home.ts
import {HomeModel} from '../../data/homemodel';
import {InfoUserInfo} from './infouserinfo';
import {Redirect} from 'aurelia-router';
import {ETUDDETAIL_ROUTE, CONSULT_ROUTE, ADMIN_ROUTE} from '../../data/infoconstants';
//
export class Home extends HomeModel {
	//
	static inject() { return [InfoUserInfo] }
	//
	//
	constructor(info: InfoUserInfo) {
		super(info);
	}
	public canActivate(params?: any, config?: any, instruction?: any): any {
		if (this.is_notconnected) {
			return true;
		}
		if (!this.is_etud) {
			return true;
		}
		let url: string = null;
		if (this.userInfo.router !== null) {
			let nid = this.userInfo.etudiant_id;
			if (nid !== null) {
				url = this.userInfo.router.generate(ETUDDETAIL_ROUTE, { id: nid });
			}
		}// connected
		if (url !== null) {
			return new Redirect(url);
		}
		return true;
    }// activate
}// class Home

