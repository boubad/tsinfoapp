//baseeventdetailmodel.ts
//
import {IInfoEvent} from 'infodata';
import {UserInfo} from './userinfo';
import {BaseDetailModel} from './basedetailmodel';
//
export class BaseEventDetailModel<T extends IInfoEvent> extends BaseDetailModel<T> {
    //
	private _start: string;
	private _end: string;
    //
    constructor(userinfo: UserInfo) {
        super(userinfo);
    }
	protected set_currentitem(s:T): void {
		super.set_currentitem(s);
		this._start = null;
		this._end = null;
		if (this.currentItem !== null) {
			let d = this.currentItem.semestreMinDate;
			if ((d !== undefined) && (d !== null)) {
				this._start = d.toISOString().substr(0, 10);;
			}
			d = this.currentItem.semestreMaxDate;
			if ((d !== undefined) && (d !== null)) {
				this._end = d.toISOString().substr(0, 10);;
			}
		}// evt
	}
	public get genre(): string {
		return (this.currentItem !== null) ? this.currentItem.genre : null;
	}
	public set genre(s: string) {
		if (this.currentItem !== null) {
			this.currentItem.genre = s;
		}
	}
	public get eventDate(): string {
		let d: Date = null;
		if (this.currentItem !== null) {
			d = this.currentItem.eventDate;
		}
		return this.date_to_string(d);
	}
	public set eventDate(s: string) {
		if (this.currentItem !== null) {
			this.currentItem.eventDate = this.string_to_date(s);
		}
	}
	public get minDate(): string {
		return (this._start !== undefined) ? this._start : null;
	}
	public set minDate(s: string) {
		this._start = this.check_string(s);
	}
	public get maxDate(): string {
		return (this._end !== undefined) ? this._end : null;
	}
	public set endDate(s: string) {
		this._end = this.check_string(s);
	}
	public get semestreName(): string {
		return (this.currentItem !== null) ? this.currentItem.semestreName : null;
	}
	public get departementName(): string {
		return (this.currentItem !== null) ? this.currentItem.departementName : null;
	}
	public get anneeName(): string {
		return (this.currentItem !== null) ? this.currentItem.anneeName : null;
	}
	public get groupeName(): string {
		return (this.currentItem !== null) ? this.currentItem.groupeName : null;
	}
	public get uniteName(): string {
		return (this.currentItem !== null) ? this.currentItem.uniteName : null;
	}
	public get matiereName(): string {
		return (this.currentItem !== null) ? this.currentItem.matiereName : null;
	}
}
