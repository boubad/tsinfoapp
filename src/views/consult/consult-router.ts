//constult-router.ts
///
import {Router} from 'aurelia-router';
import {BaseView} from '../../data/baseview';
import {InfoUserInfo} from '../common/infouserinfo';
//
export class ConsultRouter extends BaseView {
	//
	public static inject() { return [InfoUserInfo]; }
	//
	public heading: string = 'Consultation';
	public router: Router;
	//
	constructor(info: InfoUserInfo) {
		super(info);
		this.title = 'Consultation';
	}// constructor
	//
	public configureRouter(config, router: Router) {
		config.map([
			{ route: ['', 'home'], name:'home',moduleId: '../common/home', nav: true, title: 'Accueil' },
			{route: 'etudsearch', name: 'etudsearch', moduleId:'./etuds-search', nav: true, title: 'Rechercher' },
			{ route: 'semestreevents', name: 'semestreevents', moduleId:'./semestre-events', nav: true, title: 'Evènements' },
			{ route: 'groupeeventslist', name: 'groupeeventslist', moduleId:'./groupeevents-list', nav: true, title: 'Contrôles' },
			{ route: 'noteslist', name: 'noteslist', moduleId:'./notes-list', nav: true, title: 'Notes' },
			{ route: 'groupeevents', name: 'groupeevents', moduleId:'./groupeevents', nav: true, title: 'Devoirs' }
		]);
		this.router = router;
	}
	public canActivate(params?: any, config?: any, instruction?: any): any {
		let bRet: boolean = false;
		if (this.is_connected) {
			bRet = this.is_admin || this.is_super || this.is_prof;
		}
		return bRet;
	}// canActivate
}
