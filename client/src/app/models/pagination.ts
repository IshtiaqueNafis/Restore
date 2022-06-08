export interface Metadata {
    currentPage: number,
    totalPages: number
    pageSize: number
    totalCount:number
}
export class PaginatedResponse<T>{
    constructor(items: T, metaData: Metadata) {
        this.items = items;
        this.metaData = metaData;
    }
    items:T;
    metaData:Metadata
}