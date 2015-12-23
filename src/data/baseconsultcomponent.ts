//baseconsultcomponent.ts
//
import {BaseConsultViewModel} from './baseconsultmodel';
import {BaseComponent} from './basecomponent';
import {IBaseItem} from 'infodata';
//
export class BaseConsultBar<T extends IBaseItem> extends BaseComponent<BaseConsultViewModel<T>> {
	constructor() {
		super();
	}
	public get canShowForm(): boolean {
        return this.parent.canShowForm;
    }
    public refreshAll(): any {
		return this.parent.refreshAll();
    }
    public get items(): T[] {
        return this.parent.items;
    }
    public get currentItem(): T {
        return this.parent.currentItem;
    }
    public set currentItem(s: T) {
		this.parent.currentItem = s;
    }
    public get hasItems(): boolean {
        return this.parent.hasItems;
    }
    public get hasPages(): boolean {
        return this.parent.hasPages;
    }
    public get pageStatus(): string {
        return this.parent.pageStatus;
    }
    public get pagesCount(): number {
        return this.parent.pagesCount;
    }
    public get itemsPerPage(): number {
        return this.parent.itemsPerPage;
    }
    public set itemsPerPage(s: number) {
		this.parent.itemsPerPage = s;
    }
    public get canPrevPage(): boolean {
        return this.parent.canPrevPage;
    }
    public get canNextPage(): boolean {
        return this.parent.canNextPage;
    }
    public firstPage(): void {
		this.parent.firstPage();
    }
    public prevPage(): void {
		this.parent.prevPage();
    }
    public nextPage(): void {
		this.parent.nextPage();
    }
    public lastPage(): void {
		this.parent.lastPage();
    }
}