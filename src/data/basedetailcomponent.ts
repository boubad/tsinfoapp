//basedetailcomponent.ts
//
import {BaseComponent} from './basecomponent';
import {BaseModel} from './basemodel';
import {PersonItem} from './personitem';
import {IPersonItem} from 'infodata';
import {UserInfo} from './userinfo';
//
export class BaseDetailComponent<T extends IPersonItem,V extends BaseModel> 
extends BaseComponent<V> {
	//
	private _item:any = new PersonItem();
	//
	constructor(){
		super();
	}
	//
	protected post_set_item():Promise<boolean>{
		return Promise.resolve(true);
	}
	protected change_currentItem(s:T):Promise<boolean> {
		this._item = (s !== undefined) ? s : null;
		return this.post_set_item();
	}//change_currentItem
	public get currentItem(): T{
		return this._item;
	}
	public set currentItem(s:T){
		this.change_currentItem(s);	
	}
}//BaseDetailComponent
