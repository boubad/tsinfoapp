//person.ts
//
import {IPerson} from 'infodata';
import {BaseItem} from './baseitem';
import {MyCrypto} from './mycrypto';
import {PERSON_KEY, PERSON_PREFIX,SUPER_USERNAME} from './infoconstants';
//
//
var cc = new MyCrypto();
//
export class Person extends BaseItem implements IPerson {
    //
    private _email: string = null;
    private _phone: string = null;
    private _password: string = null;
    private _username: string = null;
    private _firstname: string = null;
    private _lastname: string = null;
	//
	private _dossier: string;
	private _sexe: string ;
	private _date: Date;
	private _birthYear:number;
	private _ville: string;
	private _etablissement: string;
	private _serieBac: string;
	private _optionBac: string;
	private _mentionBac: string;
	private _etudesSuperieures: string;
	private _apb: string;
	//
	private _groupeSigle:string;
	private _groupeid:string;
    //
    private _departementids: string[];
    private _anneeids: string[];
    private _semestreids: string[];
    private _matiereids: string[];
    private _uniteids: string[];
    private _groupeids: string[];
    private _affectationids: string[];
    private _eventids: string[];
	private _etudiantids: string[];
	private _enseignantids: string[];
	private _administratorids: string[];
	//
	
    //
    constructor(oMap?: any) {
        super(oMap);
        if ((oMap !== undefined) && (oMap !== null)) {
            if (oMap.username !== undefined) {
                this.username = oMap.username;
            }
            if (oMap.password !== undefined) {
                this.password = oMap.password;
            }
            if (oMap.firstname !== undefined) {
                this.firstname = oMap.firstname;
            }
            if (oMap.lastname !== undefined) {
                this.lastname = oMap.lastname;
            }
            if (oMap.email !== undefined) {
                this.email = oMap.email;
            }
            if (oMap.phone !== undefined) {
                this.phone = oMap.phone;
            }
			if (oMap.dossier !== undefined) {
				this.dossier = oMap.dossier;
			}
			if (oMap.sexe !== undefined) {
				this.sexe = oMap.sexe;
			}
			if (oMap.birthYear !== undefined) {
				this.birthYear = oMap.birthYear;
			}
			if (oMap.birthDate !== undefined) {
				this.birthDate = oMap.birthDate;
			}
			if (oMap.etablissement !== undefined) {
				this.etablissement = oMap.etablissement;
			}
			if (oMap.ville !== undefined) {
				this.ville = oMap.ville;
			}
			if (oMap.serieBac !== undefined) {
				this.serieBac = oMap.serieBac;
			}
			if (oMap.optionBac !== undefined) {
				this.optionBac = oMap.optionBac;
			}
			if (oMap.mentionBac != undefined) {
				this.mentionBac = oMap.mentionBac;
			}
			if (oMap.etudesSuperieures !== undefined) {
				this.etudesSuperieures = oMap.etudesSuperieures;
			}
			if (oMap.apb !== undefined) {
				this.apb = oMap.apb;
			}
			if (oMap.groupeSigle !== undefined){
				this.groupeSigle = oMap.groupeSigle;
			}
			if (oMap.sigleGroupe !== undefined){
				this.groupeSigle = oMap.sigleGroupe;
			}
			if (oMap.groupeid !== undefined){
				this.groupeid = oMap.groupeid;
			}
        } // oMap
    } // constructor
	//
	public get birthYear():number {
		return (this._birthYear !== undefined) ? this._birthYear : null;
	}
	public set birthYear(s:number) {
		this._birthYear = this.check_number(s);
	}
	public get groupeid():string {
		return (this._groupeid !== undefined) ? this._groupeid : null;
	}
	public set groupeid(s:string){
		this._groupeid = this.check_string(s);
	}
	public get groupeSigle(): string {
		return (this._groupeSigle !== undefined) ? this._groupeSigle : null;
	}
	public set groupeSigle(s: string) {
		this._groupeSigle = this.check_string(s);;
	}
	public get dossier(): string {
		return (this._dossier !== undefined) ? this._dossier : null;
	}
	public set dossier(s: string) {
		this._dossier = this.check_upper_string(s);
	}
	public get sexe(): string {
		return (this._sexe !== undefined) ? this._sexe : null;
	}
	public set sexe(s: string) {
		this._sexe =  this.check_upper_string(s);
	}
	public get birtDate(): Date {
		return (this._date !== undefined) ? this._date : null;
	}
	public set birthDate(s: Date) {
		this._date = this.check_date(s);
	}
	public get ville(): string {
		return (this._ville !== undefined) ? this._ville : null;
	}
	public set ville(s: string) {
		this._ville =  this.check_upper_string(s);
	}
	public get etablissement(): string {
		return (this._etablissement !== undefined) ? this._etablissement : null;
	}
	public set etablissement(s: string) {
		this._etablissement = this.check_upper_string(s);
	}
	public get serieBac(): string {
		return (this._serieBac !== undefined) ? this._serieBac : null;
	}
	public set serieBac(s: string) {
		this._serieBac =  this.check_upper_string(s);
	}
	public get optionBac(): string {
		return (this._optionBac !== undefined) ? this._optionBac : null;
	}
	public set optionBac(s: string) {
		this._optionBac =  this.check_upper_string(s);
	}
	public get mentionBac(): string {
		return (this._mentionBac !== undefined) ? this._mentionBac : null;
	}
	public set mentionBac(s: string) {
		this._mentionBac =  this.check_upper_string(s);
	}
	public get etudesSuperieures(): string {
		return (this._etudesSuperieures !== undefined) ? this._etudesSuperieures : null;
	}
	public set etudesSuperieures(s: string) {
		this._etudesSuperieures =  this.check_upper_string(s);
	}
	public get apb(): string {
		return (this._apb !== undefined) ? this._apb : null;
	}
	public set apb(s: string) {
		this._apb =  this.check_upper_string(s);
	}
	public get username(): string {
		return this._username;
	}
	public set username(s: string) {
		this._username = ((s !== undefined) && (s !== null) && (s.trim().length > 0)) ?
			s.trim().toLowerCase() : null;
	}
	public get password(): string {
		return this._password;
	}
	public set password(s: string) {
		this._password = (s !== undefined) ? s : null;
	}
	public get firstname(): string {
		return this._firstname;
	}
	public set firstname(s: string) {
    this._firstname = this.format_name(s);
	}
	public get lastname(): string {
		return ((this._lastname !== undefined) && (this._lastname !== null)) ?
			this._lastname : null;
	}
	public set lastname(s: string) {
		this._lastname = this.check_upper_string(s);
	}
	public get email(): string {
		return this._email;
	}
	public set email(s: string) {
		this._email = this.check_string(s);
	}
	public get phone(): string {
		return this._phone;
	}
	public set phone(s: string) {
		this._phone = this.check_string(s);
	}
	public get departementids(): string[] {
		return ((this._departementids !== undefined) && (this._departementids !== null)) ?
			this._departementids : [];
	}
	public set departementids(dd: string[]) {
		this._departementids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get groupeids(): string[] {
		return ((this._groupeids !== undefined) && (this._groupeids !== null)) ?
			this._groupeids : [];
	}
	public set groupeids(dd: string[]) {
		this._groupeids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get anneeids(): string[] {
		return ((this._anneeids !== undefined) && (this._anneeids !== null)) ?
			this._anneeids : [];
	}
	public set anneeids(dd: string[]) {
		this._anneeids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get semestreids(): string[] {
		return ((this._semestreids !== undefined) && (this._semestreids !== null)) ?
			this._semestreids : [];
	}
	public set semestreids(dd: string[]) {
		this._semestreids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get uniteids(): string[] {
		return ((this._uniteids !== undefined) && (this._uniteids !== null)) ?
			this._uniteids : [];
	}
	public set uniteids(dd: string[]) {
		this._uniteids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get matiereids(): string[] {
		return ((this._matiereids !== undefined) && (this._matiereids !== null)) ?
			this._matiereids : [];
	}
	public set matiereids(dd: string[]) {
		this._matiereids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get etudiantids(): string[] {
		return ((this._etudiantids !== undefined) && (this._etudiantids !== null)) ?
			this._etudiantids : [];
	}
	public set etudiantids(dd: string[]) {
		this._etudiantids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get enseignantids(): string[] {
		return ((this._enseignantids !== undefined) && (this._enseignantids !== null)) ?
			this._enseignantids : [];
	}
	public set enseignantids(dd: string[]) {
		this._enseignantids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get administratorids(): string[] {
		return ((this._administratorids !== undefined) && (this._administratorids !== null)) ?
			this._administratorids : [];
	}
	public set administratorids(dd: string[]) {
		this._administratorids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get affectationids(): string[] {
		return ((this._affectationids !== undefined) && (this._affectationids !== null)) ?
			this._affectationids : [];
	}
	public set affectationids(dd: string[]) {
		this._affectationids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	public get eventids(): string[] {
		return ((this._eventids !== undefined) && (this._eventids !== null)) ?
			this._eventids : [];
	}
	public set eventids(dd: string[]) {
		this._eventids = ((dd !== undefined) && (dd !== null)) ? dd : [];
	}
	//
	public to_map(oMap: any): void {
        super.to_map(oMap);
		if ((oMap !== undefined) && (oMap !== null)) {
			if (this.username !== null) {
				oMap.username = this.username;
			}
			if (this.password !== null) {
				oMap.password = this.password;
			}
			if (this.firstname !== null) {
				oMap.firstname = this.firstname;
			}
			if (this.lastname !== null) {
				oMap.lastname = this.lastname;
			}
			if (this.email !== null) {
				oMap.email = this.email;
			}
			if (this.phone !== null) {
				oMap.phone = this.phone;
			}
			if (this.dossier !== null) {
				oMap.dossier = this.dossier;
			}
			if (this.sexe !== null) {
				oMap.sexe = this.sexe;
			}
			if (this.birthYear !== null) {
				oMap.birthYear = this.birthYear
			}
			if (this.birthDate !== null) {
				oMap.birthDate = this.birthDate;
			}
			if (this.ville !== null) {
				oMap.ville = this.ville;
			}
			if (this.etablissement !== null) {
				oMap.etablissement = this.etablissement;
			}
			if (this.serieBac !== null) {
				oMap.serieBac = this.serieBac;
			}
			if (this.optionBac !== null) {
				oMap.optionBac = this.optionBac;
			}
			if (this.mentionBac !== null) {
				oMap.mentionBac = this.mentionBac;
			}
			if (this.etudesSuperieures !== null) {
				oMap.etudesSuperieures = this.etudesSuperieures;
			}
			if (this.apb !== null) {
				oMap.apb = this.apb;
			}
		}// oMap
    } // to_map
    //
    public store_prefix(): string {
        return PERSON_PREFIX;
    }
    public create_id(): string {
        let s = this.start_key();
        if ((s !== null) && (this.username !== null)) {
            s = s + this.prepare_string(this.username,true);
        }
        return s;
    }// create_id
    //
    public reset_password(): void {
        if (this.username !== null) {
            this.password = cc.md5(this.username);
        } else {
            this.password = null;
        }
    }
    public change_password(ct: string): void {
        if ((ct === undefined) || (ct === null)) {
            this.password = null;
        } else {
            var v = null;
            var x = ct;
            if (x.length > 0) {
                v = cc.md5(x);
            }
            this.password = v;
        }
    }
    public check_password(ct: string): boolean {
        if ((ct === undefined) || (ct === null)) {
            if (this.password === null) {
                return true;
            } else {
                return false;
            }
        }
        var v = cc.md5(ct);
        return (this.password == v);
    } // check_password
    //
    public type(): string {
        return PERSON_KEY;
    }
    //
    public get fullname(): string {
        return ((this.lastname !== null) && (this.firstname !== null)) ?
			(this.lastname + ' ' + this.firstname) : "";
    } // fullname
    //
    public toString(): string {
        return this.fullname;
    }
    public is_storeable(): boolean {
        return super.is_storeable() &&
            (this.username !== null) && (this.firstname !== null) &&
            (this.lastname !== null);
    }
	public get is_super():boolean {
		return (this.username !== null) && (this.username == SUPER_USERNAME);
	}
    public sort_func(p1: Person, p2: Person): number {
        let s1 = p1.fullname;
        let s2 = p2.fullname;
        if ((s1 !== null) && (s2 !== null)) {
            return s1.localeCompare(s2);
        } else if ((s1 === null) && (s2 !== null)) {
            return 1;
        } else if ((s1 !== null) && (s2 === null)) {
            return -1;
        } else {
            return 0;
        }
    } // sort_func
	public get_all_ids() : string[]{
		let oRet:string[] = [];
		this.check_id;
		this.add_id_to_array(oRet,this.id);
		this.add_array_to_array(oRet,this.departementids);
		this.add_array_to_array(oRet,this.anneeids);
		this.add_array_to_array(oRet,this.semestreids);
		this.add_array_to_array(oRet,this.groupeids);
		this.add_array_to_array(oRet,this.uniteids);
		this.add_array_to_array(oRet,this.matiereids);
		this.add_array_to_array(oRet,this.affectationids);
		this.add_array_to_array(oRet,this.eventids);
		this.add_array_to_array(oRet,this.etudiantids);
		this.add_array_to_array(oRet,this.enseignantids);
		this.add_array_to_array(oRet,this.administratorids);
		return oRet;
	}// get_all_ids
} // class Person
