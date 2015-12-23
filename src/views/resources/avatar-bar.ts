//avatar-bar.ts
//
import {BaseEditBar} from '../../data/baseeditcomponent';
import {IBaseItem} from 'infodata';
import {customElement} from 'aurelia-framework';
//
@customElement('avatar-bar')
export class AvatarBar extends BaseEditBar<IBaseItem> {
    constructor() {
        super();
    }
    public get avatarUrl(): string {
        return this.parent.avatarUrl;
    }
    public get hasAvatarUrl(): boolean {
        return (this.avatarUrl !== null);
    }
    public get canRemoveAvatar(): boolean {
        return this.parent.canRemoveAvatar;
    }
    public get cannotRemoveAvatar(): boolean {
        return (!this.canRemoveAvatar);
    }
    public get canSaveAvatar(): boolean {
        return this.parent.canSaveAvatar;
    }
    public get cannotSaveAvatar(): boolean {
        return (!this.canSaveAvatar);
    }
    public get workingUrl(): string {
        return this.parent.workingUrl;
    }
    public get hasWorkingUrl(): boolean {
        return (this.workingUrl !== null);
    }
    public avatarFileChanged(event: any): any {
		this.parent.avatarFileChanged(event);
    }// fileChanged
    public removeAvatar(): any {
        return this.parent.removeAvatar();
    }
    public saveAvatar(): any {
        return this.parent.saveAvatar();
    }// saveAvatar
}
