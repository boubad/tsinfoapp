//eventdetailmodel.ts
//
import {BaseEventDetailModel} from './baseeventdetailmodel';
import {UserInfo} from './userinfo';
import {IInfoEvent} from 'infodata';
//
export class EventDetailModel<T extends IInfoEvent> extends BaseEventDetailModel<T> {
    constructor(userinfo: UserInfo) {
        super(userinfo);
    }
	
}
