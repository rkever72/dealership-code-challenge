export class PagingModel {
    constructor(paging = {}) {
        this.currentPage = paging.currentPage || 1;
        this.endPage = paging.endPage || 0;
        this.pages = paging.pages || 0;
        this.pageSize = paging.pageSize || 50;
        this.startPage = paging.startPage || 0;
        this.totalItems = paging.totalItems || 0;
        this.totalPages = paging.totalPages || 0;
    }
}
