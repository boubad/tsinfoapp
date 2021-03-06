//semestresreportmodel.ts
//
import {UserInfo} from './userinfo';
import {BaseConsultViewModel} from './baseconsultmodel';
import {DisplayEtudiant, DisplayEtudiantsArray} from './displayetudiant';
import {IDisplayEtudiant, IEtudiantEvent} from 'infodata';
//
export class SemestreReportBase extends BaseConsultViewModel<IDisplayEtudiant> {
    //
    private _all_data: IDisplayEtudiant[] = [];
    //
    constructor(info: UserInfo) {
        super(info);
    }// constructor
    protected post_update_semestre(): Promise<boolean> {
		return super.post_update_semestre().then((r) => {
			return this.activate_refresh();
		});
    }
    protected is_refresh(): boolean {
        return (this.semestreid !== null);
    }
    protected prepare_refresh(): void {
        super.prepare_refresh();
        this._all_data = [];
    }
	protected get_hasitems():boolean {
		return (this._all_data.length > 0);
	}
    protected transform_data(pp: IEtudiantEvent[]): Promise<IDisplayEtudiant[]> {
        let oRet: IDisplayEtudiant[] = [];
        if ((pp !== undefined) && (pp !== null)) {
            let grp: DisplayEtudiantsArray = new DisplayEtudiantsArray();
            for (let p of pp) {
                grp.add_event(p);
            }
            oRet = grp.get_etudiantdisplays();
        }// pp
        return Promise.resolve(oRet);
    }// transformData
    protected get_initial_events(): Promise<IEtudiantEvent[]> {
        return Promise.resolve([]);
    }
	public deactivate(): any {
		if (this._all_data.length > 0) {
			for (let elem of this._all_data) {
				let x = elem.url;
				if (x !== null) {
					this.revokeUrl(x);
					elem.url = null;
				}
			}// elem
		}
	}// deactivate
    public refreshAll(): Promise<any> {
		if (this.is_busy){
			return Promise.resolve(false);
		}
		this.is_busy=true;
        this.prepare_refresh();
        if (!this.is_refresh()) {
			this.is_busy=false;
            return Promise.resolve(true);
        }
        let nc = this.itemsPerPage;
        let self = this;
        return this.get_initial_events().then((pp: IEtudiantEvent[]) => {
			// let xx = self.filter_etudevents(pp);
            return self.transform_data(pp);
        }).then((zz: IDisplayEtudiant[]) => {
            self._all_data = zz;
            let nt = self._all_data.length;
            let np = Math.floor(nt / nc);
            if ((np * nc) < nt) {
                ++np;
                self.pagesCount = np;
            }
            return self.refresh();
        }).then((x)=>{
			this.is_busy=false;
			return true;
		}).catch((rr)=>{
			this.is_busy= false;
			return false;
		});
    }// refreshAll
    public refresh(): Promise<any> {
		this.is_busy=true;
        this.clear_error();
        this.items = [];
        if (!this.is_refresh()) {
			this.is_busy=false;
            return Promise.resolve(true);
        }
        let nbItems = this._all_data.length;
        let nc = this.itemsPerPage;
        let istart = (this.currentPage - 1) * nc;
        if ((istart < 0) && (istart >= nbItems)) {
            return Promise.resolve(true);
        }
        let iend = istart + nc - 1;
        if (iend >= nbItems) {
            iend = nbItems - 1;
        }
        if ((iend < 0) && (iend >= nbItems)) {
            return Promise.resolve(true);
        }
        let oRet: IDisplayEtudiant[] = [];
        let i = istart;
        while (i <= iend) {
            let p = this._all_data[i++];
            oRet.push(p);
        }// i
        let self = this;
        return this.retrieve_avatars(oRet).then((pp: IDisplayEtudiant[]) => {
            self.items = pp;
			this.pageStatus = this.get_pageStatus();
			this.is_busy=false;
			return true;
		}).catch((rr)=>{
			this.is_busy= false;
			return false;
		});
    }// refresh
}// class BaseEditViewModel
