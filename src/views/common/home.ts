//home.ts
import {HomeModel} from '../../data/homemodel';
import {InfoUserInfo} from './infouserinfo';
import {Redirect} from 'aurelia-router';
import {ETUDDETAIL_ROUTE} from '../../data/infoconstants';
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
		if (!this.is_etud) {
			return true;
		}
		let nid = this.userInfo.etudiant_id;
		if (nid === null) {
			return true;
		}
		if (this.userInfo.router !== null) {
			let url = this.userInfo.router.generate(ETUDDETAIL_ROUTE, { id: nid });
			if (url !== null) {
				return new Redirect(url);
			}
		}
		return true;
    }// activate
}// class Home

