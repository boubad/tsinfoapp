//
import {SigleNamedItem} from './siglenameditem';
import {MATIERE_TYPE, MATIERE_PREFIX} from './infoconstants';
//
export class Matiere extends SigleNamedItem {
    //
    private _uniteid: string = null;
    private _genre: string = null;
    private _matmodule: string = null;
    private _coef: number = null;
    private _ecs: number = null;
	private _order: number = null;
    //
    constructor(oMap?: any) {
        super(oMap);
        if ((oMap !== undefined) && (oMap !== null)) {
			if (oMap.uniteid !== undefined) {
				this.uniteid = oMap.uniteid;
			}
            if (oMap.coefficient !== undefined) {
                this.coefficient = oMap.coefficient;
            }
            if (oMap.ecs !== undefined) {
                this.ecs = oMap.ecs;
            }
            if (oMap.genre !== undefined) {
                this.genre = oMap.genre;
            }
            if (oMap.matmodule !== undefined) {
                this.matmodule = oMap.matmodule;
            }
			if (oMap.order !== undefined) {
				this.order = oMap.order;
			}
        }// oMap
    } // constructor
	//
	public get uniteid(): string {
        return this._uniteid;
    }
    public set uniteid(s: string) {
        this._uniteid = this.check_string(s);
    }
    public get genre(): string {
        return this._genre;
    }
    public set genre(s: string) {
        this._genre = this.check_upper_string(s);
    }
    public get matmodule(): string {
        return this._matmodule;
    }
    public set matmodule(s: string) {
        this._matmodule = this.check_upper_string(s);
    }
	public get order(): number {
        return this._order;
    }
    public set order(d: number) {
        let v = this.check_number(d);
        if ((v != undefined) && (v != null) && (v >= 0)) {
            this._order = v;
        } else {
            this._order = null;
        }
    }
    public get ecs(): number {
		return this._ecs;
    }
    public set ecs(d: number) {
        let v = this.check_number(d);
        if ((v != undefined) && (v != null) && (v > 0.0)) {
            this._ecs = v;
        } else {
            this._ecs = null;
        }
    }
    public get coefficient(): number {
		return this._coef;
    }
    public set coefficient(d: number) {
        let v = this.check_number(d);
        if ((v != undefined) && (v != null) && (v > 0)) {
            this._coef = v;
        } else {
            this._coef = null;
        }
    }
	//
	public to_map(oMap: any): void {
        super.to_map(oMap);
		if (this.uniteid !== null) {
			oMap.uniteid = this.uniteid;
		}
		if (this.genre !== null) {
			oMap.genre = this.genre;
		}
		if (this.matmodule !== null) {
			oMap.matmodule = this.matmodule;
		}
		if (this.coefficient !== null) {
			oMap.coefficient = this.coefficient;
		}
		if (this.ecs !== null) {
			oMap.ecs = this.ecs;
		}
		if (this.order !== null) {
			oMap.order = this.order;
		}
    }// to_map
   
    public store_prefix(): string {
        return MATIERE_PREFIX;
    }
    public type(): string {
        return MATIERE_TYPE;
    }
    public start_key(): string {
        let s = this.store_prefix();
        if ((s !== null) && (this.uniteid !== null)) {
            s = s + this.uniteid;
        }
        return s;
    }
    public is_storeable(): boolean {
        return super.is_storeable() && (this.uniteid !== null);
    }

} // class Matiere
