import type { IPaginationData } from "./IPaginationData";
//
const _DEFAULT_PAGESIZE = 16;
const _DISPLAY_PAGES = 5;
//
export function GetInitialPaginationData(): IPaginationData {
    return {
        page: 0,
        pages: [],
        startPage: 0,
        lastPage: 0,
        pagesCount: 0,
        pageSize: _DEFAULT_PAGESIZE,
        itemsCount: 0,
    };
}// GetInitialPaginationData

export function PaginationDataSetItemsCount(p: IPaginationData, itemsCount: number): IPaginationData {
    const pp = Object.assign({}, p);
    let nc = pp.pageSize;
    if (nc < 1) {
        nc = _DEFAULT_PAGESIZE;
        pp.pageSize = nc;
    }
    if (itemsCount === undefined || itemsCount === null || itemsCount < 1) {
        const x = GetInitialPaginationData();
        x.pageSize = pp.pageSize;
        return x;
    }
    let oldPage = pp.page;
    if (oldPage < 1) {
        oldPage = 1;
    }
    pp.itemsCount = itemsCount;
    let np  = Math.floor(itemsCount / nc);
    if ((itemsCount % nc) !== 0) {
        np = np + 1;
    }
    pp.pagesCount = np;
    if (oldPage > np) {
        oldPage = np;
    }
    pp.startPage = Math.floor(oldPage - (_DISPLAY_PAGES / 2));
    if (pp.startPage < 1) {
        pp.startPage = 1;
    }
    pp.lastPage = pp.startPage + _DISPLAY_PAGES - 1;
    if (pp.lastPage > np) {
        pp.lastPage = np;
    }
    const pages: number[] = [];
    for (let i = pp.startPage; i <= pp.lastPage; i++) {
        pages.push(i);
    }
    pp.pages = pages;
    if (pp.page < pp.startPage) {
        pp.page = pp.startPage;
    }
    if (pp.page > pp.lastPage) {
        pp.page = pp.lastPage;
    }
    return pp;
}//PaginationDataSetItemsCount
export function PaginationDataSetPage(p: IPaginationData, page: number): IPaginationData {
    const pp = Object.assign({}, p);
    if (page < 1) {
        page = 1;
    }
    if (page > pp.pagesCount) {
        page = pp.pagesCount;
    }
    pp.page = page;
    let bChanged = false;
    if (page < pp.startPage) {
        bChanged = true;
        pp.lastPage = page;
        pp.startPage = pp.lastPage - (_DISPLAY_PAGES - 1);
        if (pp.startPage < 1) {
            pp.startPage = 1;
        }
        pp.lastPage = pp.startPage + (_DISPLAY_PAGES - 1);
        if (pp.lastPage > pp.pagesCount) {
            pp.lastPage = pp.pagesCount;
        }
    }
    if (page > pp.lastPage) {
        bChanged = true;
        pp.startPage = page;
        pp.lastPage = pp.startPage + (_DISPLAY_PAGES - 1);
        if (pp.lastPage > pp.pagesCount) {
            pp.lastPage = pp.pagesCount;
        }
        pp.startPage = pp.lastPage - (_DISPLAY_PAGES - 1);
        if (pp.startPage < 1) {
            pp.startPage = 1;
        }
    }
    if (bChanged) {
        const pages: number[] = [];
        for (let i = pp.startPage; i <= pp.lastPage; i++) {
            pages.push(i);
        }
        pp.pages = pages;
    }
    return pp;
}//PaginationDataSetPage
export function PaginationDataSetPageSize(p: IPaginationData, pageSize: number): IPaginationData {
    const pp = Object.assign({}, p);
    if (pageSize < 1 || pp.itemsCount < 1 || pageSize === pp.pageSize) {
        return pp;
    }
    pp.pageSize = pageSize;
    let oldPage = pp.page;
    if (oldPage < 1) {
        oldPage = 1;
    }
    let np = Math.floor(pp.itemsCount / pageSize);
    if ((pp.itemsCount % pageSize) !== 0) {
        np = np + 1;
    }
    pp.pagesCount = np;
    if (oldPage > np) {
        oldPage = np;
    }
    pp.startPage = Math.floor(oldPage - (_DISPLAY_PAGES / 2));
    if (pp.startPage < 1) {
        pp.startPage = 1;
    }
    pp.lastPage = pp.startPage + _DISPLAY_PAGES - 1;
    if (pp.lastPage > np) {
        pp.lastPage = np;
    }
    const pages: number[] = [];
    for (let i = pp.startPage; i <= pp.lastPage; i++) {
        pages.push(i);
    }
    pp.pages = pages;
    if (pp.page < pp.startPage) {
        pp.page = pp.startPage;
    }
    if (pp.page > pp.lastPage) {
        pp.page = pp.lastPage;
    }
    return pp;
}//PaginationDataSetPage

